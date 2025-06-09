import { applicationModel } from "../models/application-schema.js";
import { jobModel } from "../models/job-schema.js";

// const createApplication = async (req, res) => {
//  try {
//     let user = req.user;
//     let { jobId } = req.body
//     if (!jobId) {
//         return res.status(400).json({status: "failed", message: "Job iD is required"});
//     }
//     const job = await jobModel.findById(jobId);
//     if (!job) {
//       return res.status(404).json({
//         status: "failed",
//         message: "Job not found",
//       });
//     }
//     const alreadyApplied = await applicationModel.findOne({userId: user._id});
//     if (alreadyApplied) {
//         return res.status(400).json({status: "failed", message: "Already Applied"});
//     }
//     let nowDate = new Date().toISOString().split("T")[0];
//     let application = applicationModel({
//         resumeLink: user.profile.resume,
//         jobId,
//         userId: user._id,
//         appliedAt: nowDate
//     })
//     await application.save();
//     res.status(201).json({status: "success", message: "Application Created", data: application});
//  } catch (error) {
//      console.log(error);
//      res.status(500).json({status: "failed", message: "Internal Server Error"});
//  }   
// }

const createApplication = async (req, res) => {
  try {
    let user = req.user;
    let { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ status: "failed", message: "Job ID is required" });
    }

    const job = await jobModel.findById(id);
    if (!job) {
      return res.status(404).json({ status: "failed", message: "Job not found" });
    }

    const alreadyApplied = await applicationModel.findOne({ userId: user._id, id });
    if (alreadyApplied) {
      return res.status(400).json({ status: "failed", message: "Already Applied" });
    }

    let nowDate = new Date().toISOString().split("T")[0];

    const application = new applicationModel({
      resumeLink: user.profile.resume, // ✅ Cloudinary link
      jobId: id,
      userId: user._id,
      isApply: true,
      appliedAt: nowDate,
    });

    await application.save();

    res.status(201).json({ status: "success", message: "Application Created", data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};


const getApplications = async (req, res) => {
    try {
        let recruiter = req.user;
        let id = req.params.id;
        if (!id) {
            return res.status(400).json({status: "failed", message: "id required"})
        }
        let applications = await applicationModel.find({jobId: id});
        if (applications.length === 0) {
            return res.status(404).json({status: "failed", message: "No applicants"})
        }
        return res.status(200).json({status: "success", message: "Applicants fetch successfullly", data: applications})
    } catch (error) {
        console.log(error);
     res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

const changeStatus = async (req, res) => {
 try {
    let { id, status } = req.body;
    if (!id || !status) {
            return res.status(400).json({status: "failed", message: "id required"})
    }
    let application = await applicationModel.findByIdAndUpdate(id, {status}, {new: true});
    if (!application) {
        return res.status(404).json({status: "failed", message: "No application found"});
    }

    res.status(200).json({status: "success", message: "Status changed successfully", data: application})
 } catch (error) {
     console.log(error);
     res.status(500).json({status: "failed", message: "Internal Server Error"});
 }
}

const getAppliedStatus = async (req, res) => {
  try {
    let student = req.user;
    let {id} = req.params;
    let job = await applicationModel.find({jobId: id, userId: student._id});
    if (job.length !== 0) {
    return res.status(200).json({ applied: true });
  } else {
    return res.status(200).json({ applied: false });
  }
  } catch (error) {
   console.log(error);
     res.status(500).json({status: "failed", message: "Internal Server Error"}); 
  }
}

const getApplicationsByUser = async (req, res) => {
  try {
    let user = req.user;
    let applications = await applicationModel.find({userId: user._id});
    if (applications.length === 0) {
      return res.status(404).json({ status: 'failed', message: "No applied job" });
    }
    return res.status(200).json({status: "success", message: "Applications fetch successfully", data: applications});
  } catch (error) {
    console.log(error);
     res.status(500).json({status: "failed", message: "Internal Server Error"}); 
  }
}

export {createApplication, getApplications, changeStatus, getAppliedStatus, getApplicationsByUser}