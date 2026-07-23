import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


// connexion à la base de données MongoDB
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB CONNECTER ${conn.connection.host} `);
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
export default connectDB;