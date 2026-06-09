import express from 'express';
const app=express();
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import { ENV } from './lib/env.js';
import cors from 'cors'


import authRoutes from './routes/auth.routes.js'
import verifyToken from './middleware/verifyToken.js';
import jobRoutes from './routes/job.routes.js'
import applyRoutes from './routes/application.route.js'

dotenv.config(); 
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or your real deployed website URL
  credentials: true 
}));
// Authoriztion
app.use('/api/auth',authRoutes);
// post job
app.use('/api/jobs',jobRoutes);
// apply for jobs
app.use('/api/applications',applyRoutes);
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