import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true},
  location: { type: String, required: true },
  website: { type: String, required: true },
  logo: { type: String, default: "" },
  recruiterId: { type: mongoose.Types.ObjectId, ref: 'user'},
  createdAt: {type: String}
});

export const companyModel = mongoose.model("company", companySchema);
