import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()
const mongo_uri = process.env.MONGO_URI;

export const connectToMongoDB = async ()=>{
    try {
        await mongoose.connect(mongo_uri);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}