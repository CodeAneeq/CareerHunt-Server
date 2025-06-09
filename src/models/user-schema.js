import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "recruiter"], required: true },
  token: { type: String, default: "" },
  otp: {
      value: { type: String },
      expireAt: { type: Date },
      validation: { type: Boolean, default: false },
    },
  number: {type: Number, required: true},
  profile: {
  bio: {type: String},
  profileImg: { type: String},
  resume: { type: String},
  skills: { type: [String]},
  }  
});

export const userModel = mongoose.model("users", userSchema);
