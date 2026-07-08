import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin/dashboard and its sub-routes
  if (pathname.includes('/admin/dashboard')) {
    const adminSessionCookie = request.cookies.get('admin_session');

    let locale = 'en'; // default
    const segments = pathname.split('/');
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'ar')) {
      locale = segments[1];
    }

    if (!adminSessionCookie?.value) {
      // Redirect to login if cookie is missing
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const idToken = adminSessionCookie.value;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    try {
      // Verify token via Firebase REST API
      const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      if (!verifyRes.ok) {
        throw new Error('Invalid token');
      }

      const verifyData = await verifyRes.json();
      const user = verifyData.users?.[0];

      if (!user || user.email !== 'dr-mohammed-shabaan@dr.com') {
        throw new Error('Unauthorized user');
      }

      // Token is valid and user is authorized, allow request to proceed to intlMiddleware
    } catch (error) {
      console.error('Middleware Auth Error:', error);
      // Redirect to login if token is invalid or unauthorized
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      const response = NextResponse.redirect(loginUrl);
      // Clear the invalid cookie
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Continue with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
