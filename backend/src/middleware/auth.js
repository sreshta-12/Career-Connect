import { verifyJwt } from '../utils/jwt.js';
export default function auth(req, res, next) {
  console.log('Auth middleware - headers:', req.headers);
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  console.log('Auth middleware - token:', token ? token.substring(0, 20) + '...' : 'none');
  
  if (!token) {
    console.log('Auth middleware - missing token');
    return res.status(401).json({ error: 'Missing token' });
  }
  
  try {
    const user = verifyJwt(token);
    console.log('Auth middleware - user verified:', user);
    req.user = user;
    next();
  } catch (e) {
    console.log('Auth middleware - token verification failed:', e.message);
    return res.status(401).json({ error: 'Invalid/expired token' });
  }
}
