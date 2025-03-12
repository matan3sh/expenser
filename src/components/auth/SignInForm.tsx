'use client'

import { SignIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export function SignInForm() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Please Sign In to Continue</h1>
      <SignIn routing="hash" path="/sign-in" afterSignInUrl={pathname} />
    </div>
  )
}
