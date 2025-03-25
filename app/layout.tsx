import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " पंडित विनय शास्त्री जी - Traditional Hindu Ceremonies",
  description:
    "Authentic Hindu rituals and ceremonies performed by experienced Pandit Ji with over 25 years of experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          {children}
          <footer className="bg-muted py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pandit Ram Sharma Ji</h3>
                  <p className="text-muted-foreground">
                    Bringing peace and prosperity through sacred rituals and ceremonies.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <p className="text-muted-foreground">Email: panditvinayshastri777@gmail.com</p>
                  <p className="text-muted-foreground">Phone: +91 7666318514</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/#services" className="text-muted-foreground hover:text-primary">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="/#gallery" className="text-muted-foreground hover:text-primary">
                        Gallery
                      </a>
                    </li>
                    <li>
                      <a href="/booking" className="text-muted-foreground hover:text-primary">
                        Book Now
                      </a>
                    </li>
                    <li>
                      <a href="/contact" className="text-muted-foreground hover:text-primary">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Pandit Vinay Shashtri Ji. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'