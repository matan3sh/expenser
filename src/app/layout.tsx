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
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export const dynamic = 'force-dynamic'

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
              'min-h-screen bg-slate-800 antialiased flex items-center justify-center',
              inter.className
            )}
          >
            <ThemeProvider>
              {/* Mobile container with device frame on desktop, native on mobile */}
              <div className="relative w-full h-full max-w-[500px] bg-background overflow-hidden md:shadow-2xl">
                {/* Desktop-only device frame */}
                <div className="hidden md:block absolute inset-0 rounded-[32px] border-[12px] border-gray-900 pointer-events-none z-10">
                  {/* Device notch - desktop only */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex justify-center items-center">
                    <div className="w-36 h-4 bg-gray-900 rounded-b-xl"></div>
                  </div>
                </div>

                {/* App content - add padding only on desktop */}
                <div className="h-screen w-full md:pt-6">
                  <ClientMobileLayout>{children}</ClientMobileLayout>
                </div>
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
