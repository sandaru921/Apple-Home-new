// models/Offer.ts
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  iPhoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'iPhone', required: true },
  discountPercent: { type: Number, required: true },
  endDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Offer || mongoose.model('Offer', offerSchema);