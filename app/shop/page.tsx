// app/shop/page.tsx
import { getBaseUrl } from '@/lib/utils';
import ShopInteractive from './ShopInteractive';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Shop | Apple Home',
  description: 'Premium Apple Devices in Sri Lanka. Find the latest iPhones, iPads, MacBooks, and Apple Watches.',
};

async function getProducts() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/iphones`, { 
      next: { revalidate: 60 } // Cache results and regenerate every 60 seconds in background
    });

    if (!res.ok) {
      console.error('Failed to fetch products on server:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.iphones || []);
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