// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';

import { cookies } from 'next/headers';

// ดึง API Key จาก .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, chatId } = body;

        // อ่าน userId อย่างปลอดภัยจาก Cookie ที่ตั้งไว้ตอนล็อกอิน
        const cookieStore = await cookies();
        const userId = cookieStore.get('chat_user_id')?.value;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. เรียกใช้งาน Gemini API
        // เพิ่ม System Instruction บังคับให้ AI เล่นบทบาทและตอบเฉพาะเรื่องที่ระบุ
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: "คุณคือผู้เชี่ยวชาญเฉพาะทางในเรื่อง เครื่องใช้ไฟฟ้า เสนอคำตอบและให้ความช่วยเหลือเฉพาะเรื่องนี้เท่านั้น หากผู้ใช้ถามเรื่องอื่น ไม่ต้องตอบ ให้ตอบปฏิเสธอย่างสุภาพว่าคุณถูกสร้างมาสำหรับเรื่องนี้เท่านั้น ถ้าตอบคำถามได้ข้อให้ตอบไม่เกิน100อักษร และไม่เกิน3บรรทัด"
        });

        // ส่งข้อความไปหา Gemini
        const result = await model.generateContent(message);
        const aiResponse = result.response.text();

        // 2. บันทึกข้อมูลลง MongoDB (ทำคู่ขนานไปเลย)
        await connectToDatabase();

        // สมมติว่านี่คือการแชทครั้งแรก (ยังไม่มี chatId ส่งมา)
        let currentChat;
        if (!chatId && userId) {
            // สร้างประวัติแชทใหม่
            currentChat = await ChatHistory.create({
                userId: userId,
                title: message.substring(0, 30) + '...', // เอาข้อความแรกมาตั้งเป็นชื่อแชท
                messages: [
                    { role: 'user', content: message },
                    { role: 'ai', content: aiResponse }
                ]
            });
        } else if (chatId) {
            // อัปเดตประวัติแชทเดิม
            currentChat = await ChatHistory.findByIdAndUpdate(
                chatId,
                {
                    $push: {
                        messages: {
                            $each: [
                                { role: 'user', content: message },
                                { role: 'ai', content: aiResponse }
                            ]
                        }
                    }
                },
                { new: true }
            );
        }

        // 3. ส่งคำตอบกลับไปให้ Frontend
        return NextResponse.json({
            reply: aiResponse,
            chatId: currentChat?._id || null, // ส่ง ID กลับไปเผื่อใช้คุยต่อในรอบหน้า
        });

    } catch (error: any) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}