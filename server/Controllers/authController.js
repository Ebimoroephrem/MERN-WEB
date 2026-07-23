import userModel from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../Config/nodemailler.js";
import { PASSWORD_RESET_OTP_TEMPLATE, EMAIL_TEMPLATE } from "../Config/emailTemplate.js";

const  registerUser = async (req,res)=>{
    try{
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            return res.status(400).json({ success: false, message: "Veuillez remplir tous les champs"});
        }
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: "Cet email est déjà utilisé"});
        }
        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        // Création du nouvel utilisateur
        const newUser = new userModel({
            name,
            email,
            password: hashPassword
        });
        // Enregistrement de l'utilisateur dans la base de données
        await newUser.save();
        // Génération du token JWT
        const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET, {expiresIn: "7d"});
         
        res.cookie('token', token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
            }
        )
        //Envoi del'email de bienvenue
       
       const mailOptions = {
        from: process.env.SEND_EMAIL,
        to: newUser.email,
        subject: "Bienvenue sur notre plateforme",
        text: `Bonjour ${newUser.name},\n\nMerci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous compter parmi nous !\n\nCordialement,\nL'équipe de support ${process.env.SEND_EMAIL}`
       }
        // Envoi de l'email
      try {
        await transporter.sendMail(mailOptions);
       } catch(error) {
       console.log("Erreur email :", error.message);
       }
        return res.status(201).json({success: true, message: "Utilisateur enregistré avec succès", token});

    }catch(error){
        res.status(500).json({success: false, message: "Erreur lors de l'inscription", error: error.message})
    }
}

const loginUser = async (req,res)=>{
 try{
    const {email,password} = req.body;
    // Vérification des champs
    if(!email || !password){
        return res.status(400).json({success: false, message: "Veuillez remplir tous les champs"});
    }
    // Vérification de l'existence de l'utilisateur
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({success: false, message: "Email ou mot de passe incorrect"});
    }
    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({success: false, message: "Email ou mot de passe incorrect"});
    }
    // Génération du token JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        
    // Envoi du token dans un cookie sécurisé
    
    res.cookie('token', token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        }
    )
    return res.status(200).json({success: true, message: "Connexion réussie", token});

 }
    catch(error){
        res.status(500).json({success:false, message: "Erreur lors de la connexion", error: error.message})

    }
}
const logoutUser = async (req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({success: true, message: "Déconnexion réussie"});

    }catch(error)
    {        res.status(500).json({success: false, message: "Erreur lors de la déconnexion", error: error.message  
        })
    }

}
// Fonction pour envoyer un OTP de vérification (à implémenter)
const sendVerifyOtp = async (req,res)=>{
    try{
        // Logique pour générer et envoyer un OTP de vérification par email
        const userId = req.userId;
    
         const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Le compte est déjà vérifié" });
        }
        // Générer un OTP et définir une date d'expiration
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpire = Date.now() + 24 * 60 *60* 1000; // Expire dans 24 heures
        await user.save();

          console.log("OTP généré :", otp)           // ← log 1
        console.log("Email destinataire :", user.email)

        // Envoyer l'OTP par email
        const mailOptions = {
            from: process.env.SEND_EMAIL,
            to: user.email,
            subject: "Votre code de vérification",
            //text: `Bonjour ${user.name},\n\nVoici votre code de vérification : ${otp}\n\nCe code est valide pendant 24 heures.\n\nCordialement,\nL'équipe de support ${process.env.SEND_EMAIL}`,
            html: EMAIL_TEMPLATE(user.name, otp)
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({success: true, message: "OTP de vérification envoyé avec succès"});
    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur lors de l'envoi de l'OTP", error: error.message})
    }
}

const verifyEmail = async (req,res)=>{
    try{
        const { otp} = req.body;
        const userId = req.userId; // Récupérer l'ID utilisateur à partir du token d'authentification
        if(!otp){
            return res.status(400).json({success: false, message: "Veuillez fournir l'OTP"});
        }
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({success: false, message: "Utilisateur non trouvé"});
        }
        if(user.verifyOtp !== otp || user.verifyOtp === ''){
            return res.status(400).json({success: false, message: "OTP invalide"});
        }
        if(Date.now() > user.verifyOtpExpire){
            return res.status(400).json({success: false, message: "OTP expiré"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpire = 0;
        await user.save();
        return res.status(200).json({success: true, message: "Email vérifié avec succès"});

    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur lors de la vérification de l'email", error: error.message})
    }
}
// verifcation de l'authentification de l'utilisateur
const isAuthentified = (req, res, ) => {
    try{
        res.status(200).json({success: true, message: "Utilisateur authentifié"});

    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur lors de la vérification de l'authentification", error: error.message})
    }
}
//Renitialisation du mot de passe par otp 
const sendResetOtp = async (req, res)=>{
    const {email} = req.body;
    // Vérification de l'email
    if(!email){
        return res.status(400).json({success:false, message: "Veuillez fournir votre adresse email"});
    }
       // Vérification de l'existence de l'utilisateur
    try{
        const user = await userModel.findOne({email: email.trim()});
        console.log("User trouvé :", user)  
        if(!user){
            return res.status(400).json({success: false, message: "Utilisateur non trouvé"});
        }
        // Générer un OTP et définir une date d'expiration
         const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpire = Date.now() + 15 * 60 *60* 1000; // Expire dans 15 minutes
        await user.save();

          console.log("OTP généré :", otp)           // ← log 1
        console.log("Email destinataire :", user.email)

        // Envoyer l'OTP par email
        const mailOptions = {
            from: process.env.SEND_EMAIL,
            to: user.email,
            subject: "Réinitialisation du mot de passe OTP",
           // text: `Bonjour ${user.name},\n\nVoici votre code de réinitialisation : ${otp}\n\nCe code est valide pendant 15 minutes.\n\nCordialement,\nL'équipe de support ${process.env.SEND_EMAIL}`,
            html: PASSWORD_RESET_OTP_TEMPLATE(user.name, otp)
        }
        await transporter.sendMail(mailOptions);
        return res.status(200).json({success: true, message: "OTP de réinitialisation envoyé avec succès"});


    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur lors de la réinitialisation du mot de passe", error: error.message})
    }
}
const resetPassword = async(req, res)=>{
    // Vérification des champs
    const {email, otp, newPassword}= req.body;
    if(!email || !otp || !newPassword){
        return res.status(400).json({success: false, message: "Veuillez fournir tous les champs requis"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "Utilisateur non trouvé"});
        }
        if(user.resetPasswordOtp !== otp || user.resetPasswordOtp === ''){
            return res.status(400).json({success: false, message: "OTP invalide"});
        }
        if(Date.now() > user.resetPasswordOtpExpire){
            return res.status(400).json({success: false, message: "OTP expiré"});
        }
        // Hash du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;
        user.resetPasswordOtp = '';
        user.resetPasswordOtpExpire = 0;
        await user.save();
        return res.status(200).json({success: true, message: "Mot de passe réinitialisé avec succès"});
    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur lors de la réinitialisation du mot de passe", error: error.message})
    }
}


const resendOtp = async (req, res) => {
    try {
        // 1 — Récupère l'utilisateur via le token JWT dans le cookie
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "Utilisateur non identifié" });
        }

        // 2 — Vérifie que l'utilisateur existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        }

        // 3 — Vérifie si le compte est déjà vérifié
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Ce compte est déjà vérifié" });
        }

        // 4 — Génère un nouvel OTP à 6 chiffres
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // 5 — Met à jour l'OTP et son expiration dans la BDD
        user.verificationToken = otp;
        user.verificationTokenExpiry = Date.now() +15 * 60 * 60 * 1000; // 15h
        await user.save();

        // 6 — Envoie l'email avec le nouvel OTP
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Nouveau code de vérification",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #4F46E5;">Nouveau code OTP</h2>
                    <p>Bonjour <strong>${user.name}</strong>,</p>
                    <p>Voici votre nouveau code de vérification :</p>
                    <div style="
                        font-size: 32px; 
                        font-weight: bold; 
                        letter-spacing: 8px;
                        color: #4F46E5;
                        background: #F3F4F6;
                        padding: 16px;
                        text-align: center;
                        border-radius: 8px;
                        margin: 20px 0;
                    ">
                        ${otp}
                    </div>
                    <p style="color: #6B7280;">Ce code expire dans <strong>24 heures</strong>.</p>
                    <p style="color: #EF4444;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.log("Erreur envoi email :", emailError.message);
            return res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'email" });
        }

        return res.status(200).json({ success: true, message: "Nouveau code envoyé avec succès" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};


export {registerUser, loginUser, logoutUser, sendVerifyOtp, verifyEmail, isAuthentified, sendResetOtp, resetPassword, resendOtp};
