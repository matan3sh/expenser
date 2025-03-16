import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for protected routes (all routes except root and sign-in)
const isProtectedRoute = createRouteMatcher([
  '/((?!$|sign-in).*)', // Match everything except root path and sign-in
])

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that aren't the root path or sign-in
  if (isProtectedRoute(req)) {
    await auth.protect()

    const { userId } = await auth()

    if (userId) {
      try {
        // Call the init API route
        await fetch(`${req.nextUrl.origin}/api/auth/init`, {
          method: 'POST',
          body: JSON.stringify({ userId }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error calling init API:', error)
      }
    }
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
