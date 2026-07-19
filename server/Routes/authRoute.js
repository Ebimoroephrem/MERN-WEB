import express from "express";
import { registerUser,loginUser,logoutUser,verifyEmail,sendVerifyOtp, isAuthentified,sendResetOtp,resetPassword,resendOtp} from "../Controllers/authController.js";
import userAuth from "../middleware/userAuth.js";


const authRouter = express.Router();

authRouter.post("/inscription", registerUser);
authRouter.post("/connexion", loginUser);
authRouter.post("/deconnexion", logoutUser);
authRouter.post("/verification-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/authentification", userAuth, isAuthentified);
authRouter.post("/send-password-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-otp", resendOtp);

export default authRouter;