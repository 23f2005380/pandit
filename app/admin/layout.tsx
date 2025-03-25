"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/admin/login")
    } else {
      setLoading(false)
    }
  }, [pathname, router])

  if (loading && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    )
  }

  return <>{children}</>
}

