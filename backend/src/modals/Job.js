import mongoose from 'mongoose'

const JobsSchema=new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
    ctc:{
        type:String,
        required:true,
    },
    minCgpa:{
        type:String,
        required:true
    },
    allowedYears:[{
        type:Number,
    }],
    deadline:{
        type:Date,
        required:true
    },
    externalLink:{
        type:String,
        required:true
    }

},{timestamps:true})

const Job=mongoose.model('Job',JobsSchema);
export default Job;