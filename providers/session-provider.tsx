"use client"

import type React from "react"
import { SessionProvider as NextAuthProvider } from "next-auth/react"

/**
 * Client-side SessionProvider wrapper for NextAuth
 * Enables useSession() hook and authenticated session management
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>
}
