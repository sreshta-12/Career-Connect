import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signJwt } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../config/validate.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ name: data.name, email: data.email, passwordHash });
    const token = signJwt({ id: user._id, email: user.email, name: user.name });
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = signJwt({ id: user._id, email: user.email, name: user.name });
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
