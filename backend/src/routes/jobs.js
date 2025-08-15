import express from 'express';
import Job from '../models/Job.js';
import auth from '../middleware/auth.js';
import { jobSchema } from '../config/validate.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { skill, location, tag, q } = req.query;
    const filter = {};
    
    if (skill) filter.skills = { $regex: new RegExp(skill, 'i') };
    if (location) filter.location = { $regex: new RegExp(location, 'i') };
    if (tag) filter.tags = { $regex: new RegExp(tag, 'i') };
    
    if (q) {
      filter.$or = [
        { title: { $regex: new RegExp(q, 'i') } },
        { company: { $regex: new RegExp(q, 'i') } },
        { description: { $regex: new RegExp(q, 'i') } }
      ];
    }
    
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('createdBy', 'name skills bio');
      
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const data = jobSchema.parse(req.body);
    const job = await Job.create({ ...data, createdBy: req.user.id, paid: true });
    
    // Populate the createdBy field before sending response
    const populatedJob = await Job.findById(job._id).populate('createdBy', 'name skills bio');
    res.json(populatedJob);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
