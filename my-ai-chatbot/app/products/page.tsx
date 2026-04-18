"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Sparkles } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (product: Product) => {
    if (!confirm(`ยืนยันการสั่งซื้อ ${product.name}\nราคา ฿${product.price.toLocaleString()} ใช่หรือไม่?`)) return;
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product._id, 
          productName: product.name, 
          price: product.price 
        })
      });
      if (res.ok) {
        alert("🎉 สั่งซื้อสำเร็จ! ข้อความถูกส่งเข้าระบบเรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">รายการสินค้า</h1>
              <p className="text-gray-500 text-sm">สินค้าตัวอย่างสำหรับทดสอบระบบ</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 text-xl font-medium animate-pulse">กำลังตรวจสอบคลังสินค้า...</div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white border border-gray-100 shadow-sm rounded-2xl py-20 flex flex-col items-center justify-center opacity-80">
            <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl text-gray-600 font-medium">แอดมินยังไม่ได้ลงรายการสินค้าเลยครับ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all flex flex-col">
                <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=ไม่มีรูปภาพ';
                    }}
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm flex-1 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-green-600 font-bold text-lg">฿{product.price.toLocaleString()}</p>
                    <button 
                      onClick={() => handleBuy(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition-colors font-semibold shadow-sm"
                    >
                      สั่งซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
