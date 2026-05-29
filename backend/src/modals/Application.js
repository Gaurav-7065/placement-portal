import mongoose from 'mongoose';

const ApplicationSchema=new mongoose.Schema({
    jobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['Applied','Selected','Rejected','Shortlisted'],
        default:'Applied'
    }
},{timestamps:true});

const Application=mongoose.model('Application',ApplicationSchema);
export default Application