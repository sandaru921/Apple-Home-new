'use client';
import Navbar from '@/components/Navbar';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-black">Get in </span>
              <span className="text-[#7CB342]">Touch</span>
            </h1>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {[
                { icon: Phone, label: 'Phone', value: '+94 77 123 4567' },
                { icon: Mail, label: 'Email', value: 'support@applehome.lk' },
                { icon: MapPin, label: 'Address', value: 'No. 45, Galle Road, Colombo 03' },
                { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9AM–7PM' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-[#7CB342]/10 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#7CB342]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 rounded-3xl h-96 border" />
          </div>
        </section>
      </div>
    </>
  );
}