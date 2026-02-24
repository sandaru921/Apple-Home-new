// app/admin/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardStats from '@/components/DashboardStats';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { totalSales: 'LKR 0', activeCustomers: 0, inStock: 0, pendingOrders: 0 },
    recentActivity: [] as string[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching dashboard content');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            <span className="text-black">Welcome Back, </span>
            <span className="text-[#7CB342]">Admin</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your store today.</p>
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-32 bg-gray-200 rounded-2xl mb-10 w-full"></div>
            <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <DashboardStats stats={data.stats} />

            {/* Quick Actions */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/admin/inventory" className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">Add New Product</h3>
                <p className="text-sm text-gray-500 mt-1">Upload iPhone with images & specs</p>
                <div className="mt-4 text-[#7CB342] font-medium hover:underline">Go →</div>
              </Link>
              <Link href="/admin/customize" className="block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800">Create Offer or Slide</h3>
                <p className="text-sm text-gray-500 mt-1">Manage landing page dynamic content</p>
                <div className="mt-4 text-[#7CB342] font-medium hover:underline">Go →</div>
              </Link>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-not-allowed opacity-60">
                <h3 className="font-semibold text-gray-800">View Orders (Coming Soon)</h3>
                <p className="text-sm text-gray-500 mt-1">Manage pending & completed orders</p>
                <button className="mt-4 text-gray-400 font-medium">Go →</button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Database Activity</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {data.recentActivity.length === 0 && <li>No recent activity generated yet.</li>}
                {data.recentActivity.map((msg, i) => (
                  <li key={i}>• {msg}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}