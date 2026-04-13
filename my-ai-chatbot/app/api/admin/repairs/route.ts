import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Repair from '@/models/Repair';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('chat_is_admin')?.value === 'true';
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const repairs = await Repair.find().sort({ createdAt: -1 });
    return NextResponse.json({ repairs });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('chat_is_admin')?.value === 'true';
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { repairId, status } = await req.json();
    await connectToDatabase();
    const updatedRepair = await Repair.findByIdAndUpdate(repairId, { status }, { new: true });
    return NextResponse.json({ repair: updatedRepair });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
