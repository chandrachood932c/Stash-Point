import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['image', 'document', 'video', 'audio', 'other'] },
  extension: { type: String, required: true },
  size: { type: Number, required: true, min: 0 },
  url: { type: String, required: true },
  storageKey: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sharedWith: [{ type: String, lowercase: true, trim: true, index: true }],
}, { timestamps: true });

fileSchema.index({ owner: 1, createdAt: -1 });
fileSchema.index({ sharedWith: 1, createdAt: -1 });
fileSchema.index({ name: 1 });

export default mongoose.model('File', fileSchema);
