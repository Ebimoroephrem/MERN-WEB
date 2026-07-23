import userModel from '../Models/UserModel.js';

const getUserData = async (req, res) => {
    try {
        const userId = req.userId  // ✅ depuis middleware

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            success: true,
            userData: {
                name: userData.name,
                email: userData.email,           // utile pour le frontend
                isAccountVerified: userData.isAccountVerified,
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

export {getUserData};