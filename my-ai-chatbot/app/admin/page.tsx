"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, MessageSquareText, Shield, ArrowLeft } from "lucide-react";

type UserStat = {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  totalChats: number;
  totalMessages: number;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้ หรือคุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-lg">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">เข้าถึงไม่ได้</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ผู้ใช้งานทั้งหมด</p>
              <p className="text-3xl font-bold text-gray-800">{users.length} <span className="text-lg font-medium text-gray-500">คน</span></p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <MessageSquareText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ข้อความจากโควต้าบอทรวม</p>
              <p className="text-3xl font-bold text-gray-800">
                {users.reduce((acc, user) => acc + user.totalMessages, 0)} <span className="text-lg font-medium text-gray-500">ข้อความ</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">รายชื่อผู้ใช้งานทั้งหมดในระบบ</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-4 font-medium border-b border-gray-100">ชื่อผู้ใช้</th>
                  <th className="p-4 font-medium border-b border-gray-100">บทบาท</th>
                  <th className="p-4 font-medium border-b border-gray-100 text-center">หัวข้อแชท</th>
                  <th className="p-4 font-medium border-b border-gray-100 text-center">ประวัติคุยรวม (ครั้ง)</th>
                  <th className="p-4 font-medium border-b border-gray-100">เข้าร่วมเมื่อ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                    <td className="p-4 font-medium text-gray-800">{user.username}</td>
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">User</span>
                      )}
                    </td>
                    <td className="p-4 text-center text-gray-600">{user.totalChats}</td>
                    <td className="p-4 text-center text-gray-600">{user.totalMessages}</td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center text-gray-500">ยังไม่มีผู้ใช้งานในขณะนี้</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
