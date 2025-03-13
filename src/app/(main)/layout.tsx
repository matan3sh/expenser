import { SignInForm } from '@/components/auth/SignInForm'
import { MainLayout } from '@/components/layout/MainLayout'
import { auth } from '@clerk/nextjs/server'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  return <MainLayout>{userId ? children : <SignInForm />}</MainLayout>
}
