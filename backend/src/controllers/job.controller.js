import Job from "../modals/Job.js";
import User from '../modals/User.js'
import Application from "../modals/Application.js";
import { sendJobAlertEmail } from "../utils/emailService.js";
export async function createJob(req, res) {

    try {

        const { companyName, role, ctc, minCgpa, allowedYears, deadline, externalLink } = req.body;

        const newJob = await Job.create({
            companyName,
            role,
            ctc,
            minCgpa,
            allowedYears,
            deadline,
            externalLink,
            postedBy: req.user.id
        })


        res.status(200).json({
            message: "Placement drive created successfully! 🚀",
            job: newJob
        })

        // =========================================================================
        // BACKGROUND TASK: FILTERS AND EMAILS (Runs smoothly without blocking the UI)
        // =========================================================================

        const eligibleStudents = await User.find({
            cgpa: { $gte: Number(minCgpa) },
            year: { $in: allowedYears }
        }).select('email');

        if (eligibleStudents.length > 0) {
            const emailList = eligibleStudents.map(user => user.email);
            await sendJobAlertEmail(emailList, newJob);
        }
        else {
            console.log("ℹ️ Job posted, but no students currently match the eligibility parameters.");
        }
    }
    catch (error) {
        console.error("❌ Error in createJob pipeline:", error);
        // Safety check: If our code crashed BEFORE reaching step 3, send an error back to the frontend
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Server error while posting job." });
        }
    }

}

//FETCH ALL JOBS WITH ELIGIBILITY CHECKS
export async function getJobs(req, res) {
    try {
        const jobs = await Job.find();

        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(401).json({ message: "Student record  not found" });
        }

        const customizedJobs = jobs.map(job => {

            if (req.user.role === 'coordinator') {
                return { ...job._doc, eligible: true, inelligibleReason: "Coordinators have full view access" }
            }

            const cgpaOk = student.cgpa >= job.minCgpa;
            const yearOk = job.allowedYears.includes(student.year);
            const eligible = cgpaOk && yearOk

            let ineligibleReason = "";
            if (!eligible) {
                const reasons = [];
                if (!cgpaOk) reasons.push(`Your CGPA (${student.cgpa}) is below the required ${job.minCgpa}`);
                if (!yearOk) reasons.push(`Your current year (${student.year}) is not eligible. Allowed years: ${job.allowedYears.join(', ')}`);
                ineligibleReason = reasons.join(" AND ");
            }
            return {
                ...job._doc, eligible, ineligibleReason
            }
        })
        res.status(200).json(customizedJobs);

    }
    catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }

}

// FETCH A SINGLE JOB BY ID WITH ELIGIBILITY
export async function getJobById(req, res) {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job placement Drive not found" });
        }
        const student = await User.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: "Student record not found" });
        }

        const cgpaOk = student.cgpa >= job.minCgpa;
        const yearOk = job.allowedYears.includes(student.year);
        const eligible = cgpaOk && yearOk;

        let ineligibleReason = "";
        if (!eligible) {
            const reasons = [];
            if (!cgpaOk) reasons.push(`Requires minimum CGPA of ${job.minCgpa}`);
            if (!yearOk) reasons.push(`Your year is not eligible`);
            ineligibleReason = reasons.join("AND");
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

// update status of job
export async function JobStatus(req, res) {
    const { id } = req.params;

    const { status } = req.body

    try {
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status: status },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(updatedApplication);
        if (!updatedApplication) {
            return res.status(401).json({
                success: false,
                message: "No Application is matching that id could be located"
            })
        }

        return res.status(200).json({
            success: true,
            message: "dsfasdf",
            data: updatedApplication
        })

    }
    catch (error) {
        if (error.name == "ValidationError") {
            return res.status(400).json({ success: false, message: error.message })
        }

        console.error("Error inside UpdateApplication", error);

        return res.status(500).json({ success: false, message: "Internal server error" })

    }

}

export async function getApplicantByJob(req, res) {
    try {
        const { jobId } = req.params;
        console.log(jobId);

        const Applicants = await Application.find({ jobId })
            .populate('studentId', 'username email role')
            .sort({ createdAt: -1 });
        
        


        return res.status(200).json({
            success: true,
            count: Applicants?.length,
            data: Applicants
        })

    }
    catch (error) {
        console.error("Error in getApplicant", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });

    }
}

export const jobController = {
    createJob,
    getJobs,
    getJobById,
    JobStatus,
    getApplicantByJob
}