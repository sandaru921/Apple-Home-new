// models/Slide.ts
import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Slide || mongoose.model('Slide', slideSchema);