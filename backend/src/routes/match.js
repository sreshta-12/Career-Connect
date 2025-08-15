import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { matchScore } from '../utils/match.js';

const router = express.Router();

// Get jobs with match scores for the authenticated user
router.get('/jobs-with-score', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Apply the same filtering logic as the regular jobs endpoint
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

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
    
    const jobsWithScore = jobs.map(job => ({
      ...job.toObject(),
      matchScore: matchScore(job, user)
    }));

    // Sort by match score (highest first)
    jobsWithScore.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json(jobsWithScore);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
