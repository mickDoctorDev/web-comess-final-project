// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';
import User from '@/models/User';
import Product from '@/models/Product';

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

        await connectToDatabase();
        
        // ตรวจสอบโควต้า
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                const today = new Date();
                const isSameDay = user.lastMessageDate &&
                    user.lastMessageDate.getDate() === today.getDate() &&
                    user.lastMessageDate.getMonth() === today.getMonth() &&
                    user.lastMessageDate.getFullYear() === today.getFullYear();

                if (isSameDay) {
                    if (user.dailyQuota >= 20 && user.role !== 'admin') {
                        return NextResponse.json({ error: 'คุณใช้โควต้าคุยแชทครบ 20 ครั้งของวันนี้แล้ว กรุณากลับมาใหม่ในวันพรุ่งนี้ครับ' }, { status: 429 });
                    }
                    user.dailyQuota += 1;
                } else {
                    user.dailyQuota = 1;
                    user.lastMessageDate = today;
                }
                await user.save();
            }
        }

        // ดึงข้อมูลสินค้าทั้งหมดจาก Database เพื่อนำไปเป็น Context ให้ AI
        const products = await Product.find({}, 'name description price').lean() || [];
        const productListString = products.map((p: any) => `- ${p.name} (ราคา ${p.price} บาท): ${p.description}`).join('\n');

        // 1. เรียกใช้งาน Gemini API
        // เพิ่ม System Instruction เพื่อให้ AI ตอบคำถามได้ครอบคลุมเกี่ยวกับเว็บไซต์ทั้งหมดและมีข้อมูลสินค้าปัจจุบัน
        const systemInstructionStr = `คุณคือ AI Assistant ประจำเว็บไซต์ Noppawat Company บริการของบริษัทมีทั้งเครื่องใช้ไฟฟ้า อุปกรณ์อิเล็กทรอนิกส์ บริการแจ้งซ่อม และสินค้าต่างๆ คุณสามารถให้ความช่วยเหลือตอบคำถามได้ทั้งหมดเกี่ยวกับเว็บไซต์นี้รวมถึงสินค้าและการบริการต่างๆ หากผู้ใช้ถามเรื่องอื่นคุณสามารถแนะนำและตอบได้ตามความคุ้นเคยอย่างสุภาพ ให้ตอบคำถามอย่างสุภาพและกระชับ ไม่เกิน 3 บรรทัด แต่ให้ยกเว้นถ้ามีการถามถึงผู้พัฒนา ซึ่งพัฒนาระบบโดย นาย นพวรรธน์ หล่อยิ่งยงไพศาล 6730259021 คณะวิศวกรรมศาสตร์

ข้อมูลสินค้าที่มีจำหน่ายในคลังของเรา (อัปเดตแบบเรียลไทม์):
${productListString || 'ขณะนี้ยังไม่มีสินค้าในระบบ'}

เมื่อผู้ใช้อยากรู้เกี่ยวกับสินค้า หรือค้นหาสินค้า ให้คุณอิงข้อมูลจากรายการสินค้านี้เพื่อตอบได้เลย`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstructionStr
        });

        // ส่งข้อความไปหา Gemini
        const result = await model.generateContent(message);
        const aiResponse = result.response.text();

        // 2. บันทึกข้อมูลลง MongoDB (ทำคู่ขนานไปเลย)

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