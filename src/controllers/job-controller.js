import { cloudinary } from "../config/cloudinary.config.js";
import { companyModel } from "../models/company-schema.js";
import { jobModel } from "../models/job-schema.js";

const addJob = async (req, res) => {
    try {
        let recruiter = req.user;
        let { title, description, skillsRequired, salary, location, experience, positions, type, companyId } = req.body;
        
        if (!title || !description || !skillsRequired || !salary || !location || !experience || !positions || !type || !companyId) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(400).json({status: "failed", message: "Company not found"});
        }
        let nowDate = new Date().toISOString().split("T")[0];
        let newJob = jobModel({
            title,
            description,
            location,
            skillsRequired,
            salary,
            experience,
            positions,
            type,
            companyId,
            recruiterId: recruiter._id,
            createdAt: nowDate
        })
        await newJob.save()
        res.status(201).json({status: "success", message: "JOb created successfully", data: newJob});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const deleteJob = async (req, res) => {
    try {
        let id = req.params.id;
        let job = await jobModel.findById(id);
        
        if (!job) {
            return res.status(400).json({ status: "failed", message: "Job not found" });
        }
        
        // 🗑 Delete from DB
        await jobModel.findByIdAndDelete(id);

        res.status(200).json({ status: "success", message: "Job deleted successfully", data: job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

const getJobForRecruiter = async (req, res) => {
    try {
        let recruiter = req.user;
        let jobs = await jobModel.find({recruiterId: recruiter._id});
        if (jobs.length === 0) {
            return res.status(404).json({ status: "failed", message: "No Job Registered" });
        }
        return res.status(200).json({ status: "success", message: "Jobs Fetch Successfully", data: jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

const getAllJobs = async (req, res) => {
    try {
        let jobs = await jobModel.find();
        if (jobs.length === 0) {
            return res.status(404).json({ status: "failed", message: "No Job Registered" });
        }
         return res.status(200).json({ status: "success", message: "Jobs Fetch Successfully", data: jobs });
    } catch (error) {
         console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

const filterJobs = async (req, res) => {
    try {
        let { location, salary, title } = req.body;
        let query = {};
    if (location) query.location = location;
    if (salary) query.salary = salary;
    if (title) query.title = title;
    
    if (Object.keys(query).length === 0) {
        return res.status(400).json({
            status: "failed",
            message: "Please provide at least one filter (location, salary, or title)"
        });
    }
        let jobs = await jobModel.find(query);

        if (jobs.length === 0) {
            return res.status(404).json({ status: "failed", message: "No JOBS" });
        }
        res.status(200).json({ status: "success", message: "Jobs Filtered Successfully", data: jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

const getCategoryJobs = async (req, res) => {
    try {
        let { title } = req.params;
        
        let jobs = await jobModel.find({title});
        if (jobs.length === 0) {
            return res.status(400).json({ status: "failed", message: "No JObs found" });
        }
        res.status(200).json({ status: "success", message: "Jobs fetch successfully", data: jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

const searchJob = async (req, res) => {
    try {
      const title = req.query.title;
  
      // Validate title
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ status: "failed", message: "Missing or invalid title parameter" });
      }
  
      const keyword = title.trim();
  
      // Perform a case-insensitive search
      const jobs = await jobModel.find({
        title: { $regex: keyword, $options: "i" }
      });
  
      if (jobs.length === 0) {
        return res.status(404).json({ status: "failed", message: "No jobs found" });
      }
  
      res.status(200).json({ status: "success", message: "Jobs fetched successfully", data: jobs });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}
  
const getSingleJob = async (req, res) => {
    try {
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "failed", message: "Id requied"});
        }
        let job = await jobModel.findById(id);
        if (job.length === 0) {
            return res.status(400).json({ status: "failed", message: "job not found id is wrong"});
        }
      res.status(200).json({ status: "success", message: "Job fetch successfully", data: job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });   
    }
}

const editJob = async (req, res) => {
    try {
        let { id, title, description, skillsRequired, salary, location, experience, positions, type, companyId } = req.body;
        if (!id || !title || !description || !skillsRequired || !salary || !location || !experience || !positions || !type || !companyId) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let job = await jobModel.findById(id);
        if (!job) {
            return res.status(404).json({status: "failed", message: "Job not found"});
        }
        // Update job fields
    job.title = title;
    job.description = description;
    job.skillsRequired = skillsRequired;
    job.salary = salary;
    job.location = location;
    job.experience = experience;
    job.positions = positions;
    job.type = type;
    job.companyId = companyId;

    // Save updated job
    await job.save();
    return res
      .status(200)
      .json({ status: "success", message: "Job updated successfully", data: job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });   
    }
}

export { addJob, deleteJob, getJobForRecruiter, getAllJobs, filterJobs, getCategoryJobs, searchJob, getSingleJob, editJob }