import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Pages anyone can open without being signed in.
// Keep any other public pages you already have (pricing, landing pages, etc.).
const isPublicRoute = createRouteMatcher(['/', '/login(.*)', '/sign-up(.*)', '/join(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Only check "is signed in" here. Don't redirect by role/tenant in this file:
  // /post-auth does that, and doing it here sends new members to /onboarding.
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
