import mongoose from "mongoose";
import { ENV } from './lib/env.js'
import User from './modals/User.js'
import bcrypt from 'bcryptjs'
try {


    await mongoose.connect(ENV.MONGO_URL);
    const hashPassword = bcrypt.hashSync(ENV.COORDINATOR_PASS, 10);

    await User.create({
        username: "coordinator",
        email: "coordinator@gmail.com",
        password: hashPassword,
        role: "coordinator"
    })
    console.log("coordinator created");
}
catch (error) {
    console.error('seeding failed:', error);
}
finally {
    process.exit();
}