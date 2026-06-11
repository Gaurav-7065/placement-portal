import mongoose from "mongoose";
import Application from "../modals/Application.js";
import Job from "../modals/Job.js";
export async function applyJob(req,res) {
    console.log("request arrived");
    console.log(req.body);
    try{
        const {jobId}=req.body;
        
    if(!jobId){
        return res.status(400).json({message:"Job Id is required to Apply"});
    }
    
    // 2. DEFENSIVE GUARD: Check if the string structure is structurally valid hex
    if(!mongoose.Types.ObjectId.isValid(jobId)){
        return res.status(400).json({ message: "Invalid Job ID format format!" });
    }
    const jobExist=await Job.findById(jobId);
    
    if(!jobExist){
       return res.status(404).json({message:"The job placement drive does not exist"});
    }

    const alreadyApplied=await Application.findOne({
        studentId:req.user.id,
        jobId:jobId
    });
    console.log(req.user.id);

    if(alreadyApplied){
      return  res.status(400).json({message:"You have already applied to this job placement drive"});
    }
    
    const newApplication=await Application.create({
        jobId:jobId,
        studentId:req.user.id,
        status:"Applied"
    });
    console.log(newApplication);

    res.status(201).json({
        message:"Application submitted successfully",
        application:newApplication
    })

    }
    catch(error){
        res.status(500).json({ message: "Error processing job application", error: error.message });
    }
}
// Get my application
export async function getMyApplication(req,res) {
    try{
        const applications=await Application.find({studentId:req.user.id})
        .populate({path:"jobId",select:"companyName role ctc deadline"}).
        sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:applications.length,
            applications
        })
    }
    catch(error){
         res.status(500).json({
            message:"error fetching your application history",
            error:error.message
         })
    }
}

export const applyController={
    applyJob,
    getMyApplication
}