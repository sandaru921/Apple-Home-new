'use client';
import Navbar from '@/components/Navbar';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-black">About </span>
              <span className="text-[#7CB342]">Apple Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for premium Apple products in Sri Lanka since 2018
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, text: '100% Authentic Products' },
                  { icon: Users, text: 'Expert Support Team' },
                  { icon: Award, text: '1-Year Warranty on All Devices' },
                  { icon: Clock, text: '24-Hour Islandwide Delivery' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-[#7CB342]" />
                    <span className="text-lg text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl h-96 border" />
          </div>
        </section>
      </div>
    </>
  );
}