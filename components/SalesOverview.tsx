// components/SalesOverview.tsx
'use client';

import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Props {
  overview: {
    today: string;
    week: string;
    month: string;
    year: string;
  };
}

export default function SalesOverview({ overview }: Props) {
  const stats = [
    { label: 'Today', value: overview.today, change: 'Daily Total', icon: Calendar },
    { label: 'This Week', value: overview.week, change: 'Weekly Total', icon: TrendingUp },
    { label: 'This Month', value: overview.month, change: 'Monthly Total', icon: DollarSign },
    { label: 'This Year', value: overview.year, change: 'Yearly Total', icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-6 h-6 text-[#7CB342]" />
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}