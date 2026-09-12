import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import OtpVerification from '../models/otp.model.js';

const otpLength = 6;
const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES || 10);
const maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5);

function mailer() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: process.env.EMAIL_USER ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD } : undefined,
  });
}

export async function issueOtp(email) {
  const normalized = email.toLowerCase().trim();
  const recent = await OtpVerification.findOne({ email: normalized, createdAt: { $gt: new Date(Date.now() - Number(process.env.OTP_RESEND_SECONDS || 60) * 1000) } });
  if (recent) throw Object.assign(new Error('Please wait before requesting another OTP'), { statusCode: 429 });
  const otp = crypto.randomInt(10 ** (otpLength - 1), 10 ** otpLength).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  await OtpVerification.deleteMany({ email: normalized, verified: false });
  await OtpVerification.create({ email: normalized, otpHash, expiresAt: new Date(Date.now() + expiresMinutes * 60 * 1000) });
  if (process.env.EMAIL_HOST) {
    await mailer().sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: normalized, subject: 'Your Stash Point OTP', text: `Your OTP is ${otp}. It expires in ${expiresMinutes} minutes.` });
  } else {
    console.log(`[DEV] OTP for ${normalized}: ${otp}`);
  }
}

export async function verifyOtp(email, otp) {
  const record = await OtpVerification.findOne({ email: email.toLowerCase().trim(), verified: false }).sort({ createdAt: -1 });
  if (!record || record.expiresAt < new Date()) throw Object.assign(new Error('OTP expired or not found'), { statusCode: 400 });
  if (record.attempts >= maxAttempts) throw Object.assign(new Error('Too many OTP attempts'), { statusCode: 429 });
  record.attempts += 1;
  const valid = await bcrypt.compare(String(otp), record.otpHash);
  if (!valid) { await record.save(); throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 }); }
  record.verified = true;
  await record.save();
  return true;
}
