import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

export const connectDatabase = () => {
    return mongoose.connect(CONNECTION_STRING);
}