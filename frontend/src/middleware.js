import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check for the refresh token cookie
  const refreshToken = request.cookies.get('jwt_refresh');

  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!refreshToken) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect authenticated users away from the login page
  if (pathname === '/admin/login' && refreshToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
