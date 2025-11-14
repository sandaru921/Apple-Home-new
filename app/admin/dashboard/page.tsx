// app/admin/dashboard/page.tsx
import AdminSidebar from '@/components/AdminSidebar';
import DashboardStats from '@/components/DashboardStats';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            <span className="text-black">Welcome Back, </span>
            <span className="text-[#7CB342]">Admin</span>
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your store today.</p>
        </div>

        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">Add New Product</h3>
            <p className="text-sm text-gray-500 mt-1">Upload iPhone with images & specs</p>
            <button className="mt-4 text-[#7CB342] font-medium hover:underline">Go →</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">Create Offer</h3>
            <p className="text-sm text-gray-500 mt-1">Set discount & expiry for any model</p>
            <button className="mt-4 text-[#7CB342] font-medium hover:underline">Go →</button>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-gray-800">View Orders</h3>
            <p className="text-sm text-gray-500 mt-1">Manage pending & completed orders</p>
            <button className="mt-4 text-[#7CB342] font-medium hover:underline">Go →</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>• iPhone 16 Pro added to inventory</li>
            <li>• 30% OFF offer created for iPhone 15</li>
            <li>• Customer Sandaru placed order #1001</li>
            <li>• Stock updated for iPhone 14 (x50)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}