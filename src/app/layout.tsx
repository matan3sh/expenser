import { UserInitializer } from '@/components/auth/UserInitializer'
import { ClientMobileLayout } from '@/components/mobile/layout/ClientMobileLayout'
import { SettingsProviderWrapper } from '@/components/providers/settings-provider-wrapper'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Expenser - Track Your Expenses',
  description: 'A modern expense tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <SettingsProviderWrapper>
        <UserInitializer />
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(
              'min-h-screen bg-background antialiased',
              inter.className
            )}
          >
            <ThemeProvider>
              {/* Mobile-only version */}
              <div className="h-screen flex flex-col">
                <ClientMobileLayout>{children}</ClientMobileLayout>
              </div>

              {/* Toast notifications */}
              <Toaster position="top-center" richColors closeButton />
            </ThemeProvider>
          </body>
        </html>
      </SettingsProviderWrapper>
    </ClerkProvider>
  )
}
