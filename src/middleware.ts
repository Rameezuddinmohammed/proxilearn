import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  // The homepage is the only public route.
  // All other routes, including /dashboard, will be automatically protected.
  publicRoutes: ["/"]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};