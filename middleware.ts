import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      !isAuthPage &&
      req.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');
        // Always allow access to login and signup pages without a token to prevent redirect loops
        if (isAuthPage) return true;
        
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
