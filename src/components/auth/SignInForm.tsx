'use client'

import { SignIn } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export function SignInForm() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignIn routing="hash" afterSignInUrl={pathname} />
    </div>
  )
}
