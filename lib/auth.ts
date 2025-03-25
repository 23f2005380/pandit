"use client"

// Simple client-side authentication for admin dashboard
import { useState, useEffect } from "react"

// Admin credentials
const ADMIN_USERNAME = "pandit"
const ADMIN_PASSWORD = "vasudev"

// Session storage key
const AUTH_TOKEN_KEY = "pandit_admin_auth"

// Check if credentials are valid
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// Generate a simple token (in a real app, use a proper JWT)
function generateToken(): string {
  return `admin-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

// Login function
export function login(username: string, password: string): boolean {
  if (validateCredentials(username, password)) {
    const token = generateToken()
    sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    return true
  }
  return false
}

// Logout function
export function logout(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!sessionStorage.getItem(AUTH_TOKEN_KEY)
}

// Custom hook for authentication state
export function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false)

  useEffect(() => {
    // Check authentication status on mount
    setIsAuth(isAuthenticated())

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = () => {
      setIsAuth(isAuthenticated())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return {
    isAuthenticated: isAuth,
    login,
    logout,
  }
}

