// models/ChatHistory.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    role: 'user' | 'ai';
    content: string;
}

export interface IChatHistory extends Document {
    userId: string; // ผูกกับระบบ Login ของผู้ใช้
    title: string;  // ชื่อหัวข้อแชท (เอาไว้แสดงใน Dashboard/Sidebar)
    messages: IMessage[]; // ประวัติการคุย
    isFavorite: boolean; // สำหรับฟีเจอร์ Saved / Favorites
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
});

const ChatHistorySchema = new Schema<IChatHistory>(
    {
        userId: { type: String, required: true },
        title: { type: String, default: 'New Chat' },
        messages: [MessageSchema],
        isFavorite: { type: Boolean, default: false },
    },
    {
        timestamps: true, // สร้าง createdAt และ updatedAt ให้อัตโนมัติ
    }
);

// ป้องกันการสร้าง Model ซ้ำเวลารัน Next.js
export default mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);