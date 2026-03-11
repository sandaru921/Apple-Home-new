import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductInteractive, { Product, Offer } from './ProductInteractive';

import { Metadata } from 'next';

import { connectDB } from '@/lib/db';
import IPhone from '@/models/iPhone';
import OfferModel from '@/models/Offer';

async function getProduct(id: string): Promise<Product | null> {
  try {
    await connectDB();
    const product = await IPhone.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product on server:', error);
    return null;
  }
}

async function getOffer(id: string, offerId: string): Promise<Offer | null> {
  try {
    await connectDB();
    const matched: any = await OfferModel.findOne({ _id: offerId, iPhoneId: id }).populate('iPhoneId').lean();
    if (matched && new Date(matched.endDate) > new Date()) {
      return JSON.parse(JSON.stringify(matched));
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
