import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
    if (hash !== user.passwordHash) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
    }

    // เซ็ต Cookie หลังล็อกอินสำเร็จ
    const cookieStore = await cookies();
    cookieStore.set('chat_user_id', user._id.toString(), {
      httpOnly: true, // ป้องกัน XSS
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
      path: '/',
    });
    
    // ตั้งค่าเก็บ username ไว้ให้ฝั่ง Client เรียกดูได้ (httpOnly = false)
    cookieStore.set('chat_username', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    if (user.role === 'admin') {
      cookieStore.set('chat_is_admin', 'true', {
        httpOnly: false, // เพื่อให้ฝั่ง UI รู้ว่าควรปุ่ม Admin ไหม
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    } else {
      cookieStore.delete('chat_is_admin');
    }

    return NextResponse.json({ message: 'เข้าสู่ระบบสำเร็จ', userId: user._id, username: user.username });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', details: error.message }, { status: 500 });
  }
}
