import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import ChatHistory from '@/models/ChatHistory';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('chat_is_admin')?.value;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const users = await User.find({}, '-passwordHash -salt').lean();

    // หาจำนวน Chat ของแต่ละคน
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        const chats = await ChatHistory.find({ userId: user._id.toString() }).lean();
        const totalMessages = chats.reduce((acc, chat) => acc + (chat.messages?.length || 0), 0);

        return {
          _id: user._id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          totalChats: chats.length,
          totalMessages: totalMessages,
        };
      })
    );

    return NextResponse.json({ users: usersWithStats });
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
