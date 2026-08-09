import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes requiring authentication
const protectedRoutes = ['/dashboard', '/profile', '/student', '/company', '/jobs', '/applications'];

// Routes reserved for unauthenticated users
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    console.log('Middleware triggered for path:', pathname);
    // 1. Read HttpOnly cookies set by Go backend
    const accessToken = req.cookies.get('access_token')?.value;
    // const refreshToken = req.cookies.get('refresh_token')?.value;

    // User has an active session if either token cookie exists
    const isAuthenticated = Boolean(accessToken);

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // 2. Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Redirect authenticated users trying to access /login or /register
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

// 4. Exclude static assets, Next.js internal routes, and images
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$).*)',
    ],
};