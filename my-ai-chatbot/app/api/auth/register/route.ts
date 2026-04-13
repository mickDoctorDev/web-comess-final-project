import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้และรหัสผ่านไม่ควรว่างเปล่า' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านด้วย scrypt ของ Node.js (ไม่ต้องลงตัวอื่นเพิ่ม)
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');

    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';

    const newUser = await User.create({
      username,
      passwordHash,
      salt,
      role,
    });

    return NextResponse.json({ message: 'ลงทะเบียนสำเร็จ', userId: newUser._id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการสม้ครสมาชิก', details: error.message }, { status: 500 });
  }
}
