import { NextResponse } from 'next/server';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            // Define auth routes that logged-in users shouldn't access
            const isAuthRoute =
                nextUrl.pathname === '/admin/login' ||
                nextUrl.pathname === '/admin/forgot-password' ||
                nextUrl.pathname.startsWith('/admin/reset-password');

            if (isOnAdmin) {
                if (isLoggedIn) {
                    if (isAuthRoute) {
                        // Redirect logged-in users to dashboard
                        return NextResponse.redirect(new URL('/admin', nextUrl));
                    }
                    return true;
                }

                // Allow unauthenticated access to auth routes
                if (isAuthRoute) {
                    return true;
                }

                // Redirect unauthenticated users to login page
                return false;
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
