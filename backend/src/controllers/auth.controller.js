import User from '../modals/User.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ENV } from '../lib/env.js';

//Regiter Logic 
export async function register(req,res) {
    try{
        const {username,email,cgpa,password,rollNo,year,role}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already existed"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);
        
        const newUser=new User({
            username,
            email,
            password:hashPassword,
            cgpa,
            rollNo,
            year,
            role:'student'
        })

        await newUser.save();   
        res.status(201).json({
            message:"Register Successfully",
            User:{id:newUser._id,name:newUser.username,email:newUser.email,role:newUser.role}

        })
    }
    catch(error){
        res.status(500).json({
            message:"Internal Server error during registration",error:error.message

        })
        

    }
}

// Login and return Token
export async function login(req,res){
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Email or Password"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
           return res.status(400).json({message:"Invalid Email or Password"});
        }

        const token=jwt.sign(
            // payload
            {id:user._id,role:user.role},
            ENV.JWT_SECRET,
            {expiresIn:'1d'}
        )

        res.status(200).json({
            message:"Login Successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                role:user.role
            }
        })
    }

    catch(error){
        res.status(500).json({ message: "Login failed", error: error.message });
    }

}

export const authController = {
    register,
    login
};

