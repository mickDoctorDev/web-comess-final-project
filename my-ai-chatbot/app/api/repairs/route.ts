import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Repair from '@/models/Repair';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('chat_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const repairs = await Repair.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ repairs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('chat_user_id')?.value;
    const username = cookieStore.get('chat_username')?.value;
    if (!userId || !username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { item, modelName, imageUrl, description } = await req.json();
    await connectToDatabase();
    const newRepair = await Repair.create({ userId, username, item, modelName, imageUrl, description });
    return NextResponse.json({ repair: newRepair }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
