import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('chat_user_id')?.value;
    const username = cookieStore.get('chat_username')?.value;

    if (!userId || !username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, productName, price } = await req.json();

    if (!productId || !productName || price === undefined) {
      return NextResponse.json({ error: 'Missing product details' }, { status: 400 });
    }

    await connectToDatabase();
    const newOrder = await Order.create({
      userId,
      username,
      productId,
      productName,
      price
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
