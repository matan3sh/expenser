import { SignInForm } from '@/components/auth/SignInForm'
import { auth } from '@clerk/nextjs/server'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  return userId ? children : <SignInForm />
}
