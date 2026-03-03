import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductInteractive, { Product, Offer } from './ProductInteractive';
import { getBaseUrl } from '@/lib/utils';
import { Metadata } from 'next';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/iphones/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch product on server:', error);
    return null;
  }
}

async function getOffer(id: string, offerId: string): Promise<Offer | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/offers?iphoneId=${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const productOffers = await res.json();
    const matched = productOffers.find((o: Offer) => o._id === offerId && o.iPhoneId?._id === id);
    if (matched && new Date(matched.endDate) > new Date()) {
      return matched;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch offer on server:', error);
    return null;
  }
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found | Apple Home'
    };
  }

  return {
    title: `${product.model} | Apple Home`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl]
    }
  };
}

export default async function ProductDetailsPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ offer?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound(); // Triggers a 404 page if product is null
  }

  let activeOffer: Offer | null = null;
  if (resolvedSearchParams.offer) {
    activeOffer = await getOffer(resolvedParams.id, resolvedSearchParams.offer);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <ProductInteractive product={product} activeOffer={activeOffer} />
    </div>
  );
}
