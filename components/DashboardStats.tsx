// components/DashboardStats.tsx
export default function DashboardStats() {
  const stats = [
    { label: 'Total Sales', value: 'LKR 2.4M', change: '+12%', color: 'text-[#7CB342]' },
    { label: 'Active Customers', value: '1,842', change: '+8%', color: 'text-blue-600' },
    { label: 'In Stock', value: '428', change: '-3%', color: 'text-orange-600' },
    { label: 'Pending Orders', value: '24', change: '+5%', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-400 mt-1">{stat.change} from last month</p>
        </div>
      ))}
    </div>
  );
}