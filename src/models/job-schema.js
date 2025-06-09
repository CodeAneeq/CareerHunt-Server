import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true},
  skillsRequired: { type: [String], required: true },
  salary: { type: String, required: true },
  location: { type: String, required: true },
  experience: { type: String, required: true },
  positions: { type: Number, required: true },
  type: { type: String, required: true },
  companyId: { type: mongoose.Types.ObjectId, ref: 'company'},
  recruiterId: { type: mongoose.Types.ObjectId, ref: 'user'},
  createdAt: {type: String}
});

export const jobModel = mongoose.model("job", jobSchema);
