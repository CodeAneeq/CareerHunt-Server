import { cloudinary } from "../config/cloudinary.config.js";
import { companyModel } from "../models/company-schema.js";

const addCompany = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({status: "failed", message: "Image is required"});
        }
        let recruiter = req.user;
        let { name, description, location, website } = req.body;
        
        if (!name || !description || !location || !website) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let duplicateName = await companyModel.findOne({name});
        if (duplicateName) {
            return res.status(404).json({status: "failed", message: "Company Name already registered"});
        };
        let nowDate = new Date().toISOString().split("T")[0];
        let newCompany = companyModel({
            name,
            description,
            location,
            website,
            logo: req.file.path,
            recruiterId: recruiter._id,
            createdAt: nowDate
        })
        await newCompany.save()
        res.status(201).json({status: "success", message: "Company created successfully", data: newCompany});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const deleteCompany = async (req, res) => {
    try {
        let id = req.params.id;
        let company = await companyModel.findById(id);
        
        if (!company) {
            return res.status(400).json({ status: "failed", message: "Company not found" });
        }

        // 🧠 Extract public_id from logo URL (assuming Cloudinary URL)
        const logoUrl = company.logo;
        const publicId = logoUrl.split('/').pop().split('.')[0]; // Extract filename without extension

        // 🗑 Delete image from Cloudinary
       let del =  await cloudinary.uploader.destroy(publicId);
        console.log(del);
        
        // 🗑 Delete from DB
        await companyModel.findByIdAndDelete(id);

        res.status(200).json({ status: "success", message: "Company deleted successfully", data: company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
};

const getCompany = async (req, res) => {
    try {
        let recruiter = req.user;
        let companies = await companyModel.find({recruiterId: recruiter._id});
        if (companies.length === 0) {
            return res.status(404).json({ status: "failed", message: "No Company Registered" });
        }
        return res.status(200).json({ status: "success", message: "Company Fetch Successfully", data: companies });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}

const getAllCompany = async (req, res) => {
    try {
        let companies = await companyModel.find();
        if (companies.length === 0) {
            return res.status(404).json({ status: "failed", message: "No Company Registered" });
        }
        return res.status(200).json({ status: "success", message: "Company Fetch Successfully", data: companies });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
}


const editCompany = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({status: "failed", message: "Image is required"});
        }
        let { id, name, description, location, website } = req.body;
        if (!name || !description || !location || !website) {
            return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let company = await companyModel.findById(id);
        if (!company) {
            return res.status(404).json({status: "failed", message: "Company not found"});
        }
        // Update company fields
    company.name = name;
    company.logo = req.file.path;
    company.description = description;
    company.website = website;
    company.location = location;

    // Save updated job
    await company.save();
    return res
      .status(200)
      .json({ status: "success", message: "Job updated successfully", data: company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });   
    }
}

export { addCompany, deleteCompany, getCompany, getAllCompany, editCompany }