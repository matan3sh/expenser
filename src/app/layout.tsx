import { ThemeProvider } from '@/components/theme/theme-provider'
import { SettingsProvider } from '@/contexts/SettingsContext'
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
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <SettingsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SettingsProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
