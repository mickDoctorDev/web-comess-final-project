"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench, CheckCircle, Clock, AlertCircle } from "lucide-react";

type Repair = {
  _id: string;
  item: string;
  modelName?: string;
  imageUrl?: string;
  description: string;
  status: 'pending' | 'acknowledged' | 'completed';
  createdAt: string;
};

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [item, setItem] = useState("");
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("ไฟล์ภาพมีขนาดใหญ่เกินไป (สูงสุดไม่เกิน 3MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl("");
    }
  };

  const fetchRepairs = async () => {
    try {
      const res = await fetch("/api/repairs");
      if (res.ok) {
        const data = await res.json();
        setRepairs(data.repairs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim() || !description.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, modelName, description, imageUrl }),
      });
      if (res.ok) {
        setItem("");
        setModelName("");
        setDescription("");
        setImageUrl("");
        fetchRepairs(); // refresh the list
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold"><Clock className="w-3 h-3"/> รอคิว</span>;
      case 'acknowledged': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"><AlertCircle className="w-3 h-3"/> รับเรื่องแล้ว</span>;
      case 'completed': 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><CheckCircle className="w-3 h-3"/> เสร็จสิ้น</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-600" />
            ระบบแจ้งซ่อมออนไลน์
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">แบบฟอร์มแจ้งซ่อม</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">สิ่งที่ต้องการส่งซ่อม</label>
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="เช่น แอร์, คอมพิวเตอร์, ปริ้นเตอร์"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">รุ่นที่จะซ่อม (Model)</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="เช่น Macbook Pro M1, Daikin Inverter"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">รูปที่เสีย (เพื่อประเมินอาการ)</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange} 
                  className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img src={imageUrl} alt="Preview" className="h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1.5 text-sm">รายละเอียดอาการเสีย</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[120px] resize-none"
                  placeholder="อธิบายอาการเบื้องต้นให้ช่างทราบ..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-sm"
              >
                {loading ? "กำลังส่งข้อมูล..." : "ส่งคำขอบริการ"}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">ประวัติการแจ้งของฉัน</h2>
            {fetchLoading ? (
              <p className="text-center text-gray-500 py-8 animate-pulse">กำลังโหลด...</p>
            ) : repairs.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center opacity-60">
                <Wrench className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-500">ยังไม่มีประวัติการแจ้งซ่อม</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {repairs.map(repair => (
                  <div key={repair._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{repair.item} {repair.modelName && <span className="text-sm font-medium text-gray-500">({repair.modelName})</span>}</h3>
                      {getStatusBadge(repair.status)}
                    </div>
                    {repair.imageUrl && (
                      <img src={repair.imageUrl} alt="ภาพอาการเสีย" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm mb-3" />
                    )}
                    <p className="text-sm text-gray-600 mb-2 truncate">{repair.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(repair.createdAt).toLocaleDateString('th-TH', { 
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
