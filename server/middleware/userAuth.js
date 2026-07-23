import jwt from 'jsonwebtoken';

const userAuth = async (req,res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(400).json({success:false, message:"Pas autorisé essai a nouveau "})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if(decoded.id){
            req.userId = decoded.id;
            next();
        }
            else{
                return res.status(400).json({success: false, message: "Token invalide"});
            }
    }
    catch(error){
        res.status(500).json({success: false, message: "Erreur d'authentification", error: error.message})
    }

}
export default userAuth