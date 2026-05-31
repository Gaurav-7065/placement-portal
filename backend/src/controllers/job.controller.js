import Job from "../modals/Job.js";

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

        res.status(200).send({
            message:"Placement drive created successfully! 🚀",
            job:newJob
        })
    }
    catch(error){
        res.status(500).send({
            message:"Failed to create placement job drive",
            error:error.message
        });

    }

}

export const jobController={
    createJob
}