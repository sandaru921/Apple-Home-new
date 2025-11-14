// app/admin/analytics/page.tsx
'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-black">Analytics </span>
            <span className="text-[#7CB342]">Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-1">Track performance and growth</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm text-green-600">+22%</span>
            </div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">LKR 86.4M</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm text-green-600">+15%</span>
            </div>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-2xl font-bold">1,842</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <ShoppingBag className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm text-green-600">+8%</span>
            </div>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-2xl font-bold">3,210</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm text-green-600">+5.2%</span>
            </div>
            <p className="text-sm text-gray-500">Conversion</p>
            <p className="text-2xl font-bold">3.8%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">Revenue Trend</h3>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Line Chart Here</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">Top Products</h3>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Bar Chart Here</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 bg-[#7CB342] text-white rounded-xl font-medium hover:bg-[#6fa135]">
            Export Report
          </button>
        </div>
      </main>
    </div>
  );
}