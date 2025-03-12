import { SignInForm } from '@/components/auth/SignInForm'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { auth } from '@clerk/nextjs/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{userId ? children : <SignInForm />}</main>
    </div>
  )
}
