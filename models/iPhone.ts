// models/iPhone.ts
import mongoose from 'mongoose';

const iPhoneSchema = new mongoose.Schema({
  model: { type: String, required: true },
  colors: [{ type: String, required: true }],
  storage: [{ type: String, required: true }],
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.iPhone || mongoose.model('iPhone', iPhoneSchema);