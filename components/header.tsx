"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "About", href: "/#about" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Reviews", href: "/#reviews" },
  { name: "FAQs", href: "/#faqs" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault()

    // If it's a hash link (section on the same page)
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "")
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        // Close mobile menu if open
        setIsOpen(false)
      }
    } else {
      // For other pages, use router
      window.location.href = href
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">विधि~विधान</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground",
              )}
            >
              {item.name}
            </a>
          ))}
          <Button asChild>
            <Link href="/booking">Book Now</Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium py-2 transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground",
                )}
                onClick={(e) => handleScroll(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <Button asChild className="w-full">
              <Link href="/booking" onClick={() => setIsOpen(false)}>
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

