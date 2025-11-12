// app/shop/page.tsx
import { connectDB } from '@/lib/db';
import iPhone from '@/models/iPhone';
import ShopClient from './ShopClient';

async function getiPhones() {
  await connectDB();

  const docs = await iPhone.find({}).lean(); // Get plain objects

  // CONVERT EVERYTHING TO JSON-SAFE FORMAT
  return docs.map((doc: any) => ({
    _id: doc._id.toString(),           // ← CRITICAL: Convert ObjectId
    model: doc.model,
    price: Number(doc.price),
    imageUrl: doc.imageUrl,
    colors: Array.isArray(doc.colors) ? doc.colors : [],
    storage: Array.isArray(doc.storage) ? doc.colors : [],
    description: doc.description || '',
    featured: Boolean(doc.featured),
  }));
}

export default async function ShopPage() {
  const iphones = await getiPhones();

  return <ShopClient initialiPhones={iphones} />;
}