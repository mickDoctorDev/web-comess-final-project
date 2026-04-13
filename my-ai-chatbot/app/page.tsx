"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Box, Cpu, Shield, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40rem] h-[40rem] bg-purple-700/10 rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      {/* Navbar Minimalist */}
      <nav className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-xl leading-none">N</span>
          </div>
          <span className="text-lg font-bold tracking-wider text-gray-100">NOPPAWAT</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 border border-gray-700/50 hover:border-gray-500 rounded-full px-5 py-2 backdrop-blur-sm"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8 animate-fade-in-down">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Welcome to the Future of Enterprise</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 flex flex-col gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-sm">
            Noppawat
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
            Company
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
          ขับเคลื่อนธุรกิจของคุณด้วยเทคโนโลยีที่ล้ำสมัยที่สุด 
          พบกับบริการซ่อมบำรุงอัจฉริยะ แค็ตตาล็อกสินค้าคุณภาพ และ AI ผู้ช่วยส่วนตัว
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full overflow-hidden font-bold transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative">เริ่มใช้งานระบบ</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>

      {/* Feature Highlights (Subtle footer) */}
      <div className="absolute bottom-10 w-full hidden lg:flex justify-center gap-16 px-10 text-gray-500 text-sm font-medium">
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <Cpu className="w-4 h-4 text-gray-600" /> AI-Powered
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <Shield className="w-4 h-4 text-gray-600" /> Secure Platform
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <Globe className="w-4 h-4 text-gray-600" /> 24/7 Availability
        </div>
        <div className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <Box className="w-4 h-4 text-gray-600" /> Innovation Driven
        </div>
      </div>
    </div>
  );
}
