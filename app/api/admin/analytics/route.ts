export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    
    let totalRevenue = 0;
    let totalItems = 0;
    orders.forEach(o => {
      totalRevenue += o.totalAmount;
      totalItems += o.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    });

    // Approximate format logic
    let formattedRevenue = `LKR ${(totalRevenue || 0).toLocaleString()}`;
    if (totalRevenue >= 1000000) {
      formattedRevenue = `LKR ${(totalRevenue / 1000000).toFixed(1)}M`;
    } else if (totalRevenue >= 1000) {
      formattedRevenue = `LKR ${(totalRevenue / 1000).toFixed(1)}K`;
    }

    const totalCustomers = await User.countDocuments({ role: { $ne: 'admin' } });

    // Conversion rate calculation is mock for now since we don't track page views,
    // but calculating dynamically from total items sold / 1000 visits mock
    const conversionRate = totalItems > 0 ? ((totalItems / 1000) * 100).toFixed(1) + '%' : '0.0%';

    return NextResponse.json({
      revenue: formattedRevenue,
      customers: totalCustomers,
      orders: orders.length,
      conversion: conversionRate
    });

  } catch (err) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
