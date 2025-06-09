import jwt from "jsonwebtoken";
import Constants from "../constant.js";
import { userModel } from "../models/user-schema.js";


let authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
        .status(401)
        .json({ status: "failed", message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, Constants.SECRET_KEY);
    
    const user = await userModel.findById(decoded.user.id);
    if (!user) {
        return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }
    req.user = user
    next()
    }  catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid or expired token" });
  }
    
}

let checkRecruiter = (req, res, next) => {
        let user = req.user;        
        if (user.role !== 'recruiter') {
            return res.status(404).json({status: "failed", message: "only recruiter can access"})
        }
        next()

}

export {authMiddleware, checkRecruiter}