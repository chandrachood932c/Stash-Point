import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  avatar: { type: String, default: '' },
  accountId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
