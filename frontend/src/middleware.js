import { NextResponse } from 'next/server';

export function middleware(request) {
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
