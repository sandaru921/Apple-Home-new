export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    const allOrders = await Order.find().sort({ createdAt: -1 });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    let salesToday = 0;
    let salesWeek = 0;
    let salesMonth = 0;
    let salesYear = 0;

    const formattedList = allOrders.map((order, index) => {
      const orderDate = new Date(order.createdAt);
      
      if (order.status !== 'cancelled') {
        if (orderDate >= today) salesToday += order.totalAmount;
        if (orderDate >= firstDayOfWeek) salesWeek += order.totalAmount;
        if (orderDate >= firstDayOfMonth) salesMonth += order.totalAmount;
        if (orderDate >= firstDayOfYear) salesYear += order.totalAmount;
      }

      return {
        _id: order._id,
        receiptNo: `ORD-${1000 + allOrders.length - index}`,
        customer: order.customerDetails.name || 'Guest',
        items: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
        total: order.totalAmount,
        date: (orderDate ? new Date(orderDate) : new Date())?.toLocaleString(),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      };
    });

    const formatCurrency = (num: number) => {
      if (num >= 1000000) return `LKR ${(num/1000000).toFixed(1)}M`;
      if (num > 0) return `LKR ${(num || 0)?.toLocaleString()}`;
      return 'LKR 0';
    };

    return NextResponse.json({
      overview: {
        today: formatCurrency(salesToday),
        week: formatCurrency(salesWeek),
        month: formatCurrency(salesMonth),
        year: formatCurrency(salesYear),
      },
      list: formattedList
    });

  } catch (error) {
    console.error('Failed to fetch sales data', error);
    return NextResponse.json({ error: 'Failed to fetch sales data' }, { status: 500 });
  }
}
