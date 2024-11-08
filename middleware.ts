import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/api/:path*',
    // Add specific paths you want to protect
    '/api/9986f653-6b60-4fe2-92fe-fe110e4f8441/store', // Your specific API route
    '/dashboard/:path*', // Protect all dashboard routes
    // Add any other paths you want to protect here
  ],
};
