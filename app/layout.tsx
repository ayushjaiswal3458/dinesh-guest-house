import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import CartProvider from '@/components/providers/cart-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'Dinesh Restaurant & Guest House',
  description: 'Welcome to Dinesh Restaurant & Guest House - Authentic cuisine and comfortable stays',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-dinesh-background dark:bg-dinesh-text">
              <header className="sticky top-0 z-50 w-full border-b border-dinesh-secondary bg-dinesh-background/95 backdrop-blur supports-[backdrop-filter]:bg-dinesh-background/60 dark:bg-dinesh-text/95 dark:border-dinesh-secondary">
                <div className="container flex h-16 items-center">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-dinesh-primary dark:text-dinesh-accent">
                      Dinesh Restaurant & Guest House
                    </span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-6 ml-6">
                    <Link 
                      href="/restaurant" 
                      className="text-sm font-medium text-dinesh-text transition-colors hover:text-dinesh-primary dark:text-dinesh-background dark:hover:text-dinesh-accent"
                    >
                      Restaurant
                    </Link>
                    <Link 
                      href="/guesthouse" 
                      className="text-sm font-medium text-dinesh-text transition-colors hover:text-dinesh-primary dark:text-dinesh-background dark:hover:text-dinesh-accent"
                    >
                      Guest House
                    </Link>
                    <Link 
                      href="/about" 
                      className="text-sm font-medium text-dinesh-text transition-colors hover:text-dinesh-primary dark:text-dinesh-background dark:hover:text-dinesh-accent"
                    >
                      About
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-sm font-medium text-dinesh-text transition-colors hover:text-dinesh-primary dark:text-dinesh-background dark:hover:text-dinesh-accent"
                    >
                      Contact
                    </Link>
                  </nav>
                  <div className="ml-auto flex items-center space-x-4">
                    <Link href="/cart">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="relative border-dinesh-secondary bg-dinesh-background text-dinesh-text hover:bg-dinesh-accent/10 hover:text-dinesh-primary dark:border-dinesh-secondary dark:bg-dinesh-text dark:text-dinesh-background dark:hover:bg-dinesh-accent/10 dark:hover:text-dinesh-accent"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Cart</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-dinesh-secondary bg-dinesh-background dark:bg-dinesh-text dark:border-dinesh-secondary">
                <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                  <div className="text-center text-sm leading-loose text-dinesh-secondary dark:text-dinesh-accent md:text-left">
                    Built with ❤️ by Dinesh Restaurant & Guest House. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

