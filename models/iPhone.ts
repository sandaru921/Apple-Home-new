// models/iPhone.ts
import mongoose from 'mongoose';

const iPhoneSchema = new mongoose.Schema({
  category: { type: String, default: 'Brand New iPhones' }, // NEW
  model: { type: String, required: true },
  colors: [{ type: String }],
  storage: [{ type: String }],
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  condition: { type: String, required: false },
  batteryHealth: { type: Number, required: false },
  isUnlocked: { type: Boolean, required: false },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.iPhone || mongoose.model('iPhone', iPhoneSchema);