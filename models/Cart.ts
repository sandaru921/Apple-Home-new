import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  price: number;
  model: string;
  imageUrl: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Phone', required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedColor: { type: String },
  selectedStorage: { type: String },
  price: { type: Number, required: true },
  model: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
