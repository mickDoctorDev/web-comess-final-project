"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, MessageSquareText, Shield, ArrowLeft, Wrench, PackagePlus, CheckCircle, Clock } from "lucide-react";

type UserStat = {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  totalChats: number;
  totalMessages: number;
};

type Repair = {
  _id: string;
  username: string;
  item: string;
  modelName?: string;
  imageUrl?: string;
  description: string;
  status: 'pending' | 'acknowledged' | 'completed';
  createdAt: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserStat[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'users' | 'repairs' | 'products'>('users');

  // Product Form State
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodImg, setProdImg] = useState("");
  const [prodLoading, setProdLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, repairsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/repairs")
        ]);

        if (!usersRes.ok || !repairsRes.ok) {
          throw new Error("Failed to fetch");
        }

        const usersData = await usersRes.json();
        const repairsData = await repairsRes.json();

        setUsers(usersData.users || []);
        setRepairs(repairsData.repairs || []);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้ หรือคุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateRepair = async (repairId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/repairs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repairId, status })
      });
      if (res.ok) {
        const data = await res.json();
        setRepairs(prev => prev.map(r => r._id === repairId ? data.repair : r));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ภาพมีขนาดใหญ่เกินไป (สูงสุดไม่เกิน 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProdImg("");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          imageUrl: prodImg || undefined
        })
      });
      if (res.ok) {
        alert("เพิ่มสินค้าสำเร็จ");
        setProdName("");
        setProdDesc("");
        setProdPrice("");
        setProdImg("");
      } else {
        alert("ใส่ข้อมูลไม่ถูกต้อง");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setProdLoading(false);
    }
  };

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
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>ดูผู้ใช้ & สถิติ</button>
          <button onClick={() => setActiveTab('repairs')} className={`px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 ${activeTab === 'repairs' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>จัดการแจ้งซ่อม {repairs.filter(r => r.status === 'pending').length > 0 && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}</button>
          <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-xl font-semibold transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>เพิ่มสินค้า</button>
        </div>

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Table */}
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
                      <th className="p-4 font-medium border-b border-gray-100 text-center">ประวัติคุยรวม (ครั้ง)</th>
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
                        <td className="p-4 text-center text-gray-600">{user.totalMessages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repairs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Wrench className="w-5 h-5" /> รายการแจ้งซ่อมที่เข้ามา</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="p-4 font-medium border-b border-gray-100 whitespace-nowrap">ลูกค้า</th>
                    <th className="p-4 font-medium border-b border-gray-100 whitespace-nowrap">อุปกรณ์</th>
                    <th className="p-4 font-medium border-b border-gray-100 w-1/3">อาการ</th>
                    <th className="p-4 font-medium border-b border-gray-100 text-center">เวลาแจ้ง</th>
                    <th className="p-4 font-medium border-b border-gray-100 text-center">จัดการสถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">ไม่มีคำขอ</td></tr>}
                  {repairs.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-800">@{r.username}</td>
                      <td className="p-4 text-gray-700 font-medium">
                        {r.item}
                        {r.modelName && <div className="text-xs text-gray-500 font-normal mt-0.5">รุ่น: {r.modelName}</div>}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        <div className="flex gap-3 items-start">
                          {r.imageUrl && (
                            <img src={r.imageUrl} alt="ภาพเสีย" className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0" />
                          )}
                          <p className="line-clamp-3">{r.description}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 text-center">
                        {new Date(r.createdAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRepair(r._id, e.target.value)}
                          className={`p-2 rounded-lg text-sm border font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none text-center
                              ${r.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              r.status === 'acknowledged' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-green-50 text-green-700 border-green-200'}
                            `}
                        >
                          <option value="pending">รอรับเรื่อง</option>
                          <option value="acknowledged">รับเรื่องแล้ว (ช่างกำลังไป)</option>
                          <option value="completed">เสร็จสิ้นเรียบร้อย</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in max-w-2xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center gap-2"><PackagePlus className="w-5 h-5" /> เพิ่มสินค้าใหม่</h2>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">ชื่อสินค้า</label>
                <input required type="text" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="เครื่องปรับอากาศ Inverter 12000 BTU" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">ราคาสินค้า (บาท)</label>
                <input required type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="15900" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">คำอธิบาย</label>
                <textarea required value={prodDesc} onChange={e => setProdDesc(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[100px]" placeholder="เพิ่มความเย็นสบาย ประหยัดไฟเบอร์ 5..." />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">อัปโหลดรูปภาพสินค้า</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {prodImg && (
                  <div className="mt-3">
                    <img src={prodImg} alt="Preview" className="h-40 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
              </div>
              <button type="submit" disabled={prodLoading} className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors">
                {prodLoading ? "กำลังเซฟลงฐานข้อมูล..." : "เพิ่มสินค้า"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
