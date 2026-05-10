import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('user_role')?.value;
    
    // Requirement: "if anyone somehow hit admin, if he don't autherized for admin then rediect him login"
    if (!token || role !== 'admin') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Prevent logged-in users from visiting login page
  if (pathname === '/auth/login' && token) {
    const role = request.cookies.get('user_role')?.value;
    if (role === 'admin') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
