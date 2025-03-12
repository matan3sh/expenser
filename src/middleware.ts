import { withClerkMiddleware } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default withClerkMiddleware((req: NextRequest) => {
  return NextResponse.next()
})

// Stop Middleware running on static files
export const config = {
  // Protects all routes, including api/trpc
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
