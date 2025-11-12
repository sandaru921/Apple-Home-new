// app/page.tsx
import { connectDB } from '@/lib/db';
import iPhone from '@/models/iPhone';
import Slide from '@/models/Slide';
import Offer from '@/models/Offer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Countdown from '@/components/Countdown';

async function getData() {
  await connectDB();

  const [slidesRaw, offersRaw, featuredRaw] = await Promise.all([
    Slide.find({}).lean(),
    Offer.find({ endDate: { $gt: new Date() } })
      .populate({
        path: 'iPhoneId',
        select: 'model price imageUrl',
      })
      .lean(),
    iPhone.find({ featured: true }).limit(4).lean(),
  ]);

  // SAFE SLIDES
  const slides = (slidesRaw || []).map(s => ({
    _id: s._id?.toString() || '',
    imageUrl: s.imageUrl || '',
  }));

  // SAFE OFFERS — ONLY VALID ONES
  const offers = (offersRaw || [])
    .filter((o): o is NonNullable<typeof o> => !!o && !!o.iPhoneId) // Type guard
    .map(o => ({
      _id: o.toString(),
      discountPercent: o.discountPercent,
      endDate: o.endDate.toISOString(),
      iPhone: {
        _id: o.iPhoneId._id.toString(),
        model: o.iPhoneId.model,
        price: Number(o.iPhoneId.price),
        imageUrl: o.iPhoneId.imageUrl,
      },
    }));

  // SAFE FEATURED
  const featured = (featuredRaw || []).map(f => ({
    _id: f._id?.toString() || '',
    model: f.model || 'Unknown',
    price: Number(f.price) || 0,
    imageUrl: f.imageUrl || '/placeholder.png',
  }));

  return { slides, offers, featured };
}

export default async function Home() {
  const { slides, offers, featured } = await getData();

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Navbar />

      {/* Slideshow */}
      {slides.length > 0 && (
        <div className="relative h-96 overflow-hidden bg-gray-100">
          <Image
            src={slides[0].imageUrl}
            alt="Hero Slide"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Offer Banner */}
      {offers.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xl font-bold">
              {offers[0].discountPercent}% OFF {offers[0].iPhone.model}
            </p>
            <p className="text-sm mt-1">
              Ends in: <Countdown endDate={offers[0].endDate} />
            </p>
            <Link
              href="/shop"
              className="inline-block mt-2 px-6 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100"
            >
              Buy Now
            </Link>
          </div>
        </div>
      )}

      {/* Featured iPhones */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-light dark:text-text-dark">
            Featured iPhones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(phone => (
              <Link
                key={phone._id}
                href="/shop"
                className="block group bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={phone.imageUrl}
                    alt={phone.model}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                    unoptimized
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-text-light dark:text-text-dark">
                    {phone.model}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    LKR {phone.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-primary/10 dark:bg-gray-900 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-text-light dark:text-text-dark">
            © 2025 iPhone Shop LK. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}