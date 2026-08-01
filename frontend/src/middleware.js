import { NextResponse, userAgent } from 'next/server';

export function middleware(request) {
  const { device } = userAgent(request);
  const isMobileOrTablet = device.type === 'mobile' || device.type === 'tablet';

  if (isMobileOrTablet && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const { pathname } = request.nextUrl;

  // 1. Block direct access to /admin/login
  if (pathname === '/admin/login' || pathname === '/admin/login/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Secret code login route: /admin/{code}/login
  const secretLoginMatch = pathname.match(/^\/admin\/([^\/]+)\/login\/?$/);
  if (secretLoginMatch) {
    const code = secretLoginMatch[1];
    
    // Check if the code matches the environment variable
    if (code === process.env.ADMIN_CODE) {
      // Serve the actual login page silently
      return NextResponse.rewrite(new URL('/admin/login', request.url));
    } else {
      // Wrong code -> redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
