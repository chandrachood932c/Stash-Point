import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { issueOtp, verifyOtp } from '../services/otp.service.js';

const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

export async function signup(req, res, next) {
  try {
    const { fullName, email } = req.body;
    if (!fullName?.trim() || !email?.trim()) return res.status(400).json({ success: false, message: 'fullName and email are required' });
    const normalized = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalized });
    if (!user) user = await User.create({ fullName: fullName.trim(), email: normalized, avatar: '' });
    await issueOtp(normalized);
    res.json({ success: true, userId: user._id, message: 'OTP sent' });
  } catch (e) { next(e); }
}

export async function signin(req, res, next) {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = email && await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await issueOtp(email);
    res.json({ success: true, userId: user._id, message: 'OTP sent' });
  } catch (e) { next(e); }
}

export async function verify(req, res, next) {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otp } = req.body;
    if (!email || !/^\d{6}$/.test(String(otp))) return res.status(400).json({ success: false, message: 'Valid email and 6-digit OTP are required' });
    await verifyOtp(email, otp);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.cookie(process.env.COOKIE_NAME || 'stash-point-session', token, cookieOptions());
    res.json({ success: true, user: { id: user._id, fullName: user.fullName, email: user.email, avatar: user.avatar } });
  } catch (e) { next(e); }
}

export async function me(req, res) { res.json({ success: true, user: { id: req.user._id, fullName: req.user.fullName, email: req.user.email, avatar: req.user.avatar } }); }
export async function logout(req, res) { res.clearCookie(process.env.COOKIE_NAME || 'stash-point-session'); res.json({ success: true }); }
