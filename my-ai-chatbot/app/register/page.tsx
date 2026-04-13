"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bot } from "lucide-react";
import { Suspense } from "react";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ลงทะเบียนสำเร็จ ไปหน้าเข้าสู่ระบบอัตโนมัติ 
        // หรือสามารถสั่ง login ได้เลย แต่อันนี้ไปหน้า login ง่ายสุด
        router.push("/login?registered=true");
      } else {
        setError(data.error || "ไม่สามารถสมัครสมาชิกได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full space-y-4">
      {error && (
        <div className="w-full text-center p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      <div>
        <label className="block text-gray-700 font-medium mb-1.5 text-sm">ชื่อผู้ใช้</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="กรอกรหัสผ่านของคุณ"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1.5 text-sm">ยืนยันรหัสผ่าน</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed mt-4 shadow-sm"
      >
        {loading ? "กำลังโหลด..." : "สมัครสมาชิก"}
      </button>
    </form>
  )
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 font-sans">สร้างบัญชีใหม่</h1>
        
        <Suspense fallback={<div>กำลังโหลด...</div>}>
          <RegisterForm />
        </Suspense>

        <p className="mt-8 text-center text-sm text-gray-600">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}
