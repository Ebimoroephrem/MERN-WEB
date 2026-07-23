import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './Config/DB.js';
import authRouter from './Routes/authRoute.js';
import userRouter from './Routes/userRoute.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173']

app.use(cors({origin: allowedOrigins, credentials:true}));
app.use(cookieParser());
app.use(express.json());
// Point de terminaison de l'API
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//connection a la base de données
connectDB()

app.listen(PORT, ()=>{
    console.log(`Le serveur a démarré sur le port ${PORT}`);
})