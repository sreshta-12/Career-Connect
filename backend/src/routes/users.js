import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { profileSchema } from '../config/validate.js';
import { extractSkills } from '../utils/extractSkills.js';

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const me = await User.findById(req.user.id);
  res.json(me);
});

router.put('/me', auth, async (req, res) => {
  try {
    const data = profileSchema.parse(req.body);
    const me = await User.findByIdAndUpdate(req.user.id, data, { new: true });
    res.json(me);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/extract-skills', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const skills = extractSkills(text || '');
    res.json({ skills });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
