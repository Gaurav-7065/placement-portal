import express from 'express';
const app=express();
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import { ENV } from './lib/env.js';

import authRoutes from './routes/auth.routes.js'
import verifyToken from './middleware/verifyToken.js';

dotenv.config(); 
app.use(express.json());
app.use('/api/auth',authRoutes)

app.get('/api/test',verifyToken,(req,res)=>{

    res.status(200).send({message:"successfull"});

})

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