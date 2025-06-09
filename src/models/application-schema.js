import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema({
  resumeLink : { type: String},
  status: { type: String, enum: ['pending', 'rejected', 'selected'], default:'pending' },
  jobId: { type: mongoose.Types.ObjectId, ref: 'job'},
  userId: { type: mongoose.Types.ObjectId, ref: 'user'},
  isApply: { type: Boolean, required: true},
  appliedAt: {type: String}
});

export const applicationModel = mongoose.model("application", applicationSchema);
