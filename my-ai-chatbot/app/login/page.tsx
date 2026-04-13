"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // หากล็อกอินสำเร็จ ให้รีเฟรชหน้าแล้วไปที่หน้าหลัก
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 font-sans">เข้าสู่ระบบ</h1>
        
        {error && (
          <div className="w-full text-center p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">ชื่อผู้ใช้</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="กรอกรหัสผ่านของคุณ"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed mt-2 shadow-sm"
          >
            {loading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>

      {/* Footer / Credits */}
      <footer className="mt-8 pb-4 w-full flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
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
    </div>
  );
}
