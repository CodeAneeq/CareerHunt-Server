import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user-schema.js";
import Constants from "../constant.js";
import sendMail from "../utilities/email.send.js";

const signUp = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({status: "failed", message: "Profile Image is required"});
        }
        let { name, email, password, role, number } = req.body;
        
        if (!name || !email || !password || !role || !number ) {
            return res.status(404).json({status: "failed", message: "All fields are required"});           
        }
        let duplicateEmail = await userModel.findOne({email});
        if (duplicateEmail) {
            return res.status(404).json({status: "failed", message: "Email already in use"});   
        }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await  bcrypt.hash(password, salt);
        let newUser = await userModel({
            name,
            email,
            password: hashPassword,
            role,
            number,
            profile: {
                profileImg: req.file.path
            }
        })        
        await newUser.save()
        let payload = {
            user: {
                id: newUser._id,
            },
        };
        let token = jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: "1y" });
        newUser.token = token;
        await newUser.save();
        res.status(201).json({status: "success", message: "User Sign Up successfully", data: newUser});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const login = async (req, res) => {
    try {
        let {email, password} = req.body;
        if (!email || !password) {
            return res.status(404).json({status: "failed", message: "All fields are required"});
        }
        let logUser = await userModel.findOne({email})
        if (!logUser) {
            return res.status(404).json({status: "failed", message: "User not found"});
        }
        let isMatch = await bcrypt.compare(password, logUser.password);
        if (!isMatch) {
            return res.status(404).json({status: "failed", message: "Password is wrong"});
        }
        let payload = {
            user: {
                id: logUser._id,
            },
        };
        let token = jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: "1y" });
        logUser.token = token;
        await logUser.save();
        res.status(201).json({status: "success", message: "User login successfully", data: logUser});
    } catch (error) {
         console.log(error.message);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const sendOTP = async (req, res) => {
    try {
        let { email } = req.body
        if (!email) {
            return res.status(404).json({status: "failed", message: "Email is required"});
        }
        let userExist = await userModel.findOne({email});
        if (!userExist) {
            return res.status(404).json({status: "failed", message: "User not found"});
        }
        const OTP = Math.floor(Math.random() * 900000 + 100000);

        const mailResponse = sendMail({
            email: [email],
             subject: "For Verification OTP",
            html: `<h1>Please verify OTP and teh OTP is ${OTP}</h1>`
        })

        if (!mailResponse) {
            return res.status(500).json({status: "failed", message: "Internal Server Error"});            
        }
        userExist.otp = {
            value: OTP.toString(),
            validation: false,
            expireAt: new Date(Date.now() + 1000 * 60 * 10)
        }
        await userExist.save()
        res.status(201).json({status: "success", message: "OTP send successfully", data: userExist});
    } catch (error) {
            console.log(error.message);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const verifyOTP = async (req, res) => {
    try {
        let { email, otp } = req.body
        if (!email || !otp) {
            return res.status(404).json({status: "failed", message: "All Fields are required"});
        }
        let userExist = await userModel.findOne({email});
        if (!userExist) {
            return res.status(404).json({status: "failed", message: "User not found"});
        }
        if (userExist.otp.value !== otp) {
            return res.status(404).json({status: "failed", message: "otp is wrong or expired"});
        }
        userExist.otp.validation= true;
        await userExist.save()
        res.status(201).json({status: "success", message: "OTP Verified successfully", data: userExist});
    } catch (error) {
            console.log(error.message);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

const resetPassword = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({status: "failed", message: "All Fields are required"});
        }
        let userExist = await userModel.findOne({email});
        if (!userExist) {
            return res.status(404).json({status: "failed", message: "User not found"});
        }
        if (userExist.otp.validation !== true) {
            return res.status(404).json({status: "failed", message: "You are not validated user"});
        }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await  bcrypt.hash(password, salt);
        userExist.password = hashPassword;   
        userExist.otp.validation = false;   
        await userExist.save()
        let payload = {
            user: {
                id: userExist._id,
            },
        };
        let token = jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: "1y" });
        userExist.token = token;
        await userExist.save();
        res.status(201).json({status: "success", message: "Password Change successfully", data: userExist});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }

}

const getUserById = async (req, res) => {
    try {
        let id = req.params.id;
        let user = await userModel.findById(id);
        res.status(200).json({status: "success", message: "User Fetch Successfully", data: user})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})        
    }
}

const getUser = async (req, res) => {
    try {
        let user = await userModel.find();
        res.status(200).json({status: "success", message: "User Fetch Successfully", data: user})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})        
    }
}

const getLoggedUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res
                .status(401)
                .json({ status: "failed", message: "Unauthorized: No token provided" });
            }
        
            const token = authHeader.split(" ")[1];
        
            const decoded = jwt.verify(token, Constants.SECRET_KEY);
            console.log("Decoded Token:", decoded);

            const user = await userModel.findById(decoded.user.id);
            console.log(user);
            
            if (!user) {
                return res
                .status(404)
                .json({ status: "failed", message: "User not found" });
            }
           res.status(200).json({status: "success", message: "Logged User", data: user})
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})   
    }
}

const addStudentDetails = async (req, res) => {
    try {  
        if (!req.file) {
            return res.status(400).json({status: "failed", message: "Resume is required"}); 
        }
        let user = req.user;

        let {bio, skills} = req.body;
        if (!bio || !skills) {
            return res.status(400).json({status: "failed", message: "All fields are required"});           
        }
        if (typeof skills === "string") {
  skills = JSON.parse(skills);
}
        if (skills.length === 0) {
            return res.status(400).json({status: "failed", message: "Skills are required"});           
        }
        let userExist = await userModel.findOne({email: user.email})
        if (!userExist) {
            return res.status(404).json({status: "failed", message: "User Not Found"});   
        } 
         const updatedUser = await userModel.findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          "profile.bio": bio,
          "profile.resume": req.file.path,
          "profile.skills": skills,
        },
      },
      { new: true } // return the updated document
    );
        // await userExist.save();
        res.status(201).json({status: "success", message: "Student details added successfully", data: updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}


export {signUp, login, sendOTP, verifyOTP, resetPassword, getUserById, getLoggedUser, addStudentDetails, getUser}