"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, User, Bot, X } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // อ้างอิง SpeechRecognition Object
  const recognitionRef = useRef<any>(null);
  const originalInputRef = useRef<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // เลื่อนหน้าจอลงมาล่างสุดเสมอเวลามีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ตั้งค่าระบบฟังเสียง (Speech Recognition) เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; 
        recognitionRef.current.interimResults = true; 
        recognitionRef.current.lang = "th-TH"; 

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          const space = originalInputRef.current && currentTranscript ? " " : "";
          setInput(originalInputRef.current + space + currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("เกิดข้อผิดพลาดในการรับเสียง:", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        console.warn("เบราว์เซอร์ของคุณไม่รองรับระบบสั่งงานด้วยเสียง");
      }
    }
  }, []);

  // ฟังก์ชันเปิด/ปิดไมค์
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      originalInputRef.current = input;
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // ฟังก์ชันส่งข้อความ
  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const currentInput = input;
    const userMessage: Message = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMessage]);

    if (isListening) recognitionRef.current?.stop();
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, chatId }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
        if (data.chatId && !chatId) {
          setChatId(data.chatId);
        }
      } else {
        setMessages((prev) => [...prev, { role: "ai", content: "เกิดข้อผิดพลาด: " + (data.error || "ไม่สามารถตอบกลับได้") }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์" }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[350px] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200 animate-in slide-in-from-bottom-5">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="font-bold">บริการสอบถามข้อมูล</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-700 p-1 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Chat History Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2">
            <Bot className="w-12 h-12 text-blue-200" />
            <p className="text-sm">พิมพ์หรือพูดเพื่อเริ่มสนทนากับ AI ได้เลยครับ</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 text-sm rounded-2xl flex gap-2 ${msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none shadow-sm"
                  }`}
              >
                {msg.role === "ai" && <Bot className="w-4 h-4 shrink-0 text-blue-500 mt-1" />}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.role === "user" && <User className="w-4 h-4 shrink-0 text-white mt-1" />}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t p-3">
        <div className="flex items-end gap-2">
          <button
            onClick={toggleListening}
            className={`p-2.5 rounded-full transition-colors shrink-0 ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            title="กดเพื่อพูด"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? "กำลังฟัง..." : "พิมพ์ข้อความที่นี่..."}
            className="flex-1 p-2.5 text-sm border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-24"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl disabled:bg-blue-300 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
