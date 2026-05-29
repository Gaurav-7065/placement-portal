import express from 'express';
const app=express();
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import { ENV } from './lib/env.js';
dotenv.config(); 

app.get("/",(req,res)=>{
    res.status(200).send("server is live");
})

const startServer=async()=>{
    try{
        await connectDb();
        app.listen(ENV.PORT,()=>{
                console.log(`server running on ${ENV.PORT}`)
    })
    }
    catch(error){
        console.log("Server error",error);
    }
}
startServer();