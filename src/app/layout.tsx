import { UserInitializer } from '@/components/auth/UserInitializer'
import { ClientMobileLayout } from '@/components/mobile/layout/ClientMobileLayout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
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
      <UserInitializer />
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            'min-h-screen bg-background antialiased',
            inter.className
          )}
        >
          <ThemeProvider>
            <SettingsProvider>
              {/* Desktop version */}
              <div className="hidden lg:block">{children}</div>

              {/* Mobile version */}
              <div className="lg:hidden h-screen flex flex-col">
                <ClientMobileLayout>{children}</ClientMobileLayout>
              </div>
            </SettingsProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
