import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: '' },
  description: { type: String, required: true },
  skills: { type: [String], default: [] },
  budget: { type: Number },
  location: { type: String },
  tags: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paid: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Job', jobSchema);
