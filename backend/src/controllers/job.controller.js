import Job from "../modals/Job.js";
import User from '../modals/User.js'
export async function createJob(req,res){

    try{
        const {companyName,role,ctc,minCgpa,allowedYears,deadline,externalLink}=req.body;
       const newJob= await Job.create({
             companyName,
             role,
             ctc,
             minCgpa,
             allowedYears,
             deadline,
             externalLink,
             postedBy:req.user.id
        })

        res.status(200).json({
            message:"Placement drive created successfully! 🚀",
            job:newJob
        })
    }
    catch(error){
        res.status(500).json({
            message:"Failed to create placement job drive",
            error:error.message
        });

    }

}

//FETCH ALL JOBS WITH ELIGIBILITY CHECKS
export async function getJobs(req,res) {
    try{
        const jobs=await Job.find();

        const student=await User.findById(req.user.id);
        if(!student){
            return res.status(401).json({message:"Student record  not found"});
        }
        
        const customizedJobs=jobs.map(job=>{

            if(req.user.role==='coordinator'){
                return {...job._doc,eligible:true,inelligibleReason:"Coordinators have full view access"}
            }

            const cgpaOk=student.cgpa>=job.minCgpa;
            const yearOk=job.allowedYears.includes(student.year);
            const eligible=cgpaOk&&yearOk

            let ineligibleReason="";
            if(!eligible){
                const reasons=[];
                if(!cgpaOk) reasons.push(`Your CGPA (${student.cgpa}) is below the required ${job.minCgpa}`);
                if(!yearOk) reasons.push(`Your current year (${student.year}) is not eligible. Allowed years: ${job.allowedYears.join(', ')}`);
                ineligibleReason=reasons.join(" AND ");
            }
            return {
                ...job._doc,eligible,ineligibleReason
            }
        })
        res.status(200).json(customizedJobs);

    }
    catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  } 
    
}

// FETCH A SINGLE JOB BY ID WITH ELIGIBILITY
export async function getJobById(req,res){
    try{
        const job=await Job.findById(req.params.id);
            
        if(!job){
            return res.status(404).json({message:"Job placement Drive not found"});
        }
        const student=await User.findById(req.user.id);
        if(!student){
            return res.status(404).json({message:"Student record not found"});
        }
        
        const cgpaOk=student.cgpa>=job.minCgpa;
        const yearOk=job.allowedYears.includes(student.year);
        const eligible= cgpaOk&&yearOk;

        let ineligibleReason="";
        if(!eligible){
            const reasons=[];
            if(!cgpaOk) reasons.push(`Requires minimum CGPA of ${job.minCgpa}`);
            if(!yearOk) reasons.push(`Your year is not eligible`);
            ineligibleReason=reasons.join("AND");
        }
        res.status(200).json({
            ...job._doc,
            eligible,
            ineligibleReason
        })
    }
    catch (error) {
    res.status(500).json({ message: "Error fetching job item", error: error.message });
  }
}

export const jobController={
    createJob,
    getJobs,
    getJobById
}