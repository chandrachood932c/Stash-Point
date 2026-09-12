import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'stash-point-session'];
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
}
