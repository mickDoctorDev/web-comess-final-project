import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ดึง cookie session user 
  const userId = request.cookies.get('chat_user_id')?.value;
  
  // ป้องกันไม่ให้เข้าหน้าหลักและหน้าจอย่อยต่างๆ ถ้ายังไม่ล็อกอิน
  if ((request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/chat')) && !userId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ไม่ให้คนที่ล็อกอินแล้ว เข้าไปหน้า login หรือ register อีก
  if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) && userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  // ป้องกันหน้า admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = request.cookies.get('chat_is_admin')?.value;
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// ระบุว่าให้ Middleware ทำงานกับหน้าไหนบ้าง
export const config = {
  matcher: ['/', '/chat/:path*', '/login', '/register', '/admin/:path*'],
};
