import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login') || req.nextUrl.pathname.startsWith('/admin/signup');

    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      !isAuthPage &&
      req.nextauth.token?.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login') || req.nextUrl.pathname.startsWith('/admin/signup');
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
