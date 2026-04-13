"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wrench, Package, MessageCircle, LogOut, Shield, AlignCenter } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // อ่านชื่อผู้ใช้และสิทธิ์การเป็น Admin จากคุกกี้บน Client-side
    if (typeof document !== 'undefined') {
      const nameMatch = document.cookie.match(new RegExp('(^| )chat_username=([^;]+)'));
      if (nameMatch) {
        setUsername(decodeURIComponent(nameMatch[2]));
      }

      const adminMatch = document.cookie.match(new RegExp('(^| )chat_is_admin=([^;]+)'));
      if (adminMatch && adminMatch[2] === 'true') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative text-gray-800">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">Noppawat company</h1>
        <div className="flex items-center gap-4">
          {username && (
            <span className="hidden sm:inline-block text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              สวัสดี, @{username}
            </span>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 flex-nowrap text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors font-semibold border border-blue-200"
            >
              <Shield className="w-4 h-4" />
              Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm bg-white hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-2 rounded-lg transition-colors font-medium border border-gray-200 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline-block">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Content (Menus) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12 flex flex-col">

        <div className="text-center mb-12 mt-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">บริการของเรา</h2>
          <p className="text-gray-500 text-lg">เลือกเมนูที่คุณต้องการใช้งานด้านล่างนี้เลยครับ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          {/* Card 1: แจ้งซ่อม */}
          <Link href="/repairs" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 py-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Wrench className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">แจ้งซ่อม</h3>
            <p className="text-gray-500 text-sm">ส่งคำขอแจ้งซ่อมแซมหรือบำรุงรักษาอุปกรณ์ของคุณ</p>
          </Link>

          {/* Card 2: รายการสินค้า */}
          <Link href="/products" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 py-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">รายการสินค้า</h3>
            <p className="text-gray-500 text-sm">ตรวจสอบแค็ตตาล็อกสินค้าและชิ้นส่วนอะไหล่ของเรา</p>
          </Link>
        </div>
      </main>

      {/* Footer / Credits */}
      <footer className="mt-auto pb-8 pt-4 w-full flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
        <p className="text-gray-500 text-sm font-medium">
          Developed by <span className="text-blue-600 font-bold">Noppawat Loryingyongphaisal</span>
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="w-4 h-[1px] bg-gray-300"></span>
          <p className="text-gray-400 text-xs font-semibold tracking-wide uppercase flex items-center gap-1">
            Powered by <span className="text-gray-800 bg-gray-200 px-1.5 py-0.5 rounded">Antigravity</span>
          </p>
          <span className="w-4 h-[1px] bg-gray-300"></span>
        </div>
      </footer>

      {/* Floating Chat Button or Popup */}
      {isChatOpen ? (
        <ChatWidget onClose={() => setIsChatOpen(false)} />
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 z-50 flex items-center justify-center group"
          title="เปิดแชทบอท"
        >
          <MessageCircle className="w-7 h-7" />
          {/* Tooltip เล็กๆ เด้งออกมาเมื่อเอาเมาส์วาง */}
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            คุยกับแชทบอท
          </span>
        </button>
      )}
    </div>
  );
}
