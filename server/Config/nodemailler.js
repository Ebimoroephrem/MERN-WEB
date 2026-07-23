import nodemailer from 'nodemailer';

// Configuration du transporteur de mail
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

})
// ✅ Ajoute ce test pour vérifier la connexion au démarrage
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Erreur email :", error.message);
    } else {
        console.log("✅ Serveur email Brevo prêt");
    }
});

export default transporter;