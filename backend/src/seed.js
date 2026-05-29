import mongoose from "mongoose";
import {ENV} from './lib/env.js'
import User from './modals/User.js'
import bcrypt from 'bcryptjs'

await mongoose.connect(ENV.MONGO_URL);
const hashPassword=await bcrypt.hash(ENV.COORDINATOR_PASS,10);

await User.create({
    username:"coordinator",
    email:"coordinator@gmail.com",
    password:hashPassword,
    role:"coordinator"
})
console.log("coordinator created");
process.exit();