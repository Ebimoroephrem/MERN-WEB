import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, "Veuillez entrer votre nom"]},
    email: {type: String, required: [true, "Veuillez entrer votre email"], unique: true, trim: true },
    password: { type: String, required: [true, "Veuillez entrer votre mot de passe"]},
    createdAt: { type: Date, default: Date.now },
    verifyOtp: { type: String , default: ''},
    verifyOtpExpire: { type: Number, default: 0},
    isAccountVerified: { type: Boolean, default: false},
    resetPasswordOtp: { type: String, default: ''},
    resetPasswordOtpExpire: { type: Number, default: 0},
})

const userModel = mongoose.models.Users || mongoose.model("Users", userSchema);

export default userModel;