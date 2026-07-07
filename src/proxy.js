import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Check if it's an admin dashboard route
  // We check for /admin/dashboard to catch /en/admin/dashboard and /ar/admin/dashboard
  if (pathname.includes('/admin/dashboard')) {
    const session = request.cookies.get('admin_session');
    if (!session) {
      // Find the locale prefix if it exists
      const segments = pathname.split('/');
      let locale = 'en'; // default
      if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'ar')) {
        locale = segments[1];
      }
      
      // Redirect to login page
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // Continue with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
