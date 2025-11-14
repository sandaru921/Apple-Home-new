// app/admin/customers/page.tsx
'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Search, Mail, Eye, Star } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  loyalty: 'Gold' | 'Silver' | 'Bronze';
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<Customer[]>([
    { _id: '1', name: 'Nimal Perera', email: 'nimal@gmail.com', orders: 12, spent: 2400000, joined: '2024-01-15', loyalty: 'Gold' },
    { _id: '2', name: 'Kamal Silva', email: 'kamal@yahoo.com', orders: 8, spent: 1200000, joined: '2024-03-20', loyalty: 'Silver' },
    { _id: '3', name: 'Sunil Jayasinghe', email: 'sunil@outlook.com', orders: 3, spent: 450000, joined: '2025-02-10', loyalty: 'Bronze' },
  ]);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Customer </span>
            <span className="text-[#7CB342]">Management</span>
          </h1>
          <p className="text-gray-600 mt-1">View and manage your loyal customers</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7CB342]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Loyalty</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full border" />
                        <div>
                          <p className="font-medium text-gray-900">{c.name}</p>
                          <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{c.orders}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#7CB342]">LKR {c.spent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getLoyaltyColor(c.loyalty)}`}>
                        <Star className="w-3 h-3" />
                        {c.loyalty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}