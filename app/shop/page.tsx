// app/shop/page.tsx

import ShopInteractive from './ShopInteractive';
import Navbar from '@/components/Navbar';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata = {
  title: 'Shop | Apple Home',
  description: 'Premium Apple Devices in Sri Lanka. Find the latest iPhones, iPads, MacBooks, and Apple Watches.',
};

import { connectDB } from '@/lib/db';
import IPhone from '@/models/iPhone';

async function getProducts() {
  try {
    await connectDB();
    const products = await IPhone.find({}).sort({ createdAt: -1 }).lean();
    // Serialization is required to pass to Client Components
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error('Failed to fetch products on server:', err);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <ShopInteractive initialProducts={products} />
    </>
  );
}