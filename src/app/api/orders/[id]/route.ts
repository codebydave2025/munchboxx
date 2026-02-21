import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'orders.json');

async function getOrders(): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(ordersFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return sample orders
    return [
      {
        id: 'ORD-12345',
        customer: {
          name: 'John Doe',
          phone: '+234 800 123 4567',
          address: '123 Main St, Lagos',
          notes: 'Please ring the doorbell'
        },
        items: [
          { id: 1, name: 'Jollof Rice', price: 2500, quantity: 2 },
          { id: 2, name: 'Grilled Chicken', price: 3500, quantity: 1 }
        ],
        total: 8500,
        status: 'confirmed',
        date: new Date().toISOString()
      },
      {
        id: 'ORD-67890',
        customer: {
          name: 'Jane Smith',
          phone: '+234 800 987 6543',
          address: '456 Park Ave, Abuja',
          notes: 'Leave at the gate'
        },
        items: [
          { id: 3, name: 'Fried Rice', price: 2800, quantity: 1 },
          { id: 4, name: 'Beef Stew', price: 1500, quantity: 2 }
        ],
        total: 5800,
        status: 'packaging',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'ORD-001',
        customer: {
          name: 'John Doe',
          phone: '+234 800 123 4567',
          address: '123 Main St, Lagos',
          notes: 'Please ring the doorbell'
        },
        items: [
          { id: 1, name: 'Jollof Rice', price: 2500, quantity: 2 },
          { id: 2, name: 'Grilled Chicken', price: 3500, quantity: 1 }
        ],
        total: 8500,
        status: 'pending',
        date: new Date().toISOString()
      },
      {
        id: 'ORD-002',
        customer: {
          name: 'Jane Smith',
          phone: '+234 800 987 6543',
          address: '456 Park Ave, Abuja',
          notes: 'Leave at the gate'
        },
        items: [
          { id: 3, name: 'Fried Rice', price: 2800, quantity: 1 },
          { id: 4, name: 'Beef Stew', price: 1500, quantity: 2 }
        ],
        total: 5800,
        status: 'confirmed',
        date: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
}

async function saveOrders(orders: any[]) {
  try {
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const { status } = await request.json();

    const orders = await getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      console.log('Order not found:', orderId);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the order status
    orders[orderIndex].status = status;

    // Save the updated orders
    await saveOrders(orders);

    return NextResponse.json({
      success: true,
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const orders = await getOrders();
    const order = orders.find(order => order.id === orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}