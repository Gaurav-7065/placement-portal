import mongoose from 'mongoose';

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['student','coordinator'],
        default:'student'
    },
    rollNo:{
        type:String,
        default:""
    },
    year:{
        type:Number,
        default:1
    },
    cgpa:{
        type:Number,
        default:0.0
    }
},{timestamps:true})

const User=mongoose.model("User",UserSchema);
export default User;