import mongoose from "mongoose";
import {ENV} from './env.js'

export const connectDb=async()=>{
    try{
        if(!ENV.MONGO_URL){
            throw new Error("db url is not defined in enviroment variable");
        }
        const conn=await mongoose.connect(ENV.MONGO_URL);
        console.log("connected to db",conn.connection.host);
    }
    catch(error){
        console.error("Error connecting to mongoDB",error);
        process.exit(1);
    }
}
