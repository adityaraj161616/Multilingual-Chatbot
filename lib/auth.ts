import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { User } from "@/lib/models/user.model"
import { connectToDatabase } from "@/lib/mongodb"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("[v0] ===== AUTHORIZE START =====")
          console.log("[v0] Credentials received:", {
            email: credentials?.email,
            hasPassword: !!credentials?.password,
          })

          if (!credentials?.email || !credentials?.password) {
            console.log("[v0] Missing email or password")
            return null
          }

          console.log("[v0] Connecting to database...")
          await connectToDatabase()
          console.log("[v0] Database connected successfully")

          console.log("[v0] Searching for user with email:", credentials.email)
          const user = await User.findOne({
            email: credentials.email as string,
          }).select("+password")

          if (!user) {
            console.log("[v0] No user found with this email")
            return null
          }

          console.log("[v0] User found:", {
            id: user._id,
            email: user.email,
            provider: user.provider,
            isActive: user.isActive,
            hasPassword: !!user.password,
          })

          if (!user.isActive) {
            console.log("[v0] User account is inactive")
            return null
          }

          if (user.provider !== "credentials") {
            console.log("[v0] User registered with OAuth provider:", user.provider)
            return null
          }

          if (!user.password) {
            console.log("[v0] User has no password set")
            return null
          }

          console.log("[v0] Verifying password...")
          const isPasswordValid = await user.comparePassword(credentials.password as string)
          console.log("[v0] Password verification result:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("[v0] Invalid password provided")
            return null
          }

          const userObject = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
          console.log("[v0] Authentication successful, returning user:", userObject)
          console.log("[v0] ===== AUTHORIZE END =====")
          return userObject
        } catch (error: any) {
          console.error("[v0] ===== AUTHORIZE ERROR =====")
          console.error("[v0] Error details:", error)
          console.error("[v0] Error message:", error.message)
          console.error("[v0] Error stack:", error.stack)
          return null
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("[v0] ===== SIGNIN CALLBACK START =====")
        console.log("[v0] Provider:", account?.provider)
        console.log("[v0] User email:", user?.email)
        console.log("[v0] User name:", user?.name)
        console.log("[v0] Account:", account)

        // For credentials provider, always allow (authorization is done in authorize callback)
        if (account?.provider === "credentials") {
          console.log("[v0] Credentials provider, allowing sign in")
          return true
        }

        // For Google OAuth
        if (account?.provider === "google") {
          console.log("[v0] Processing Google OAuth sign in")

          if (!user.email) {
            console.error("[v0] ERROR: No email provided from Google")
            return false
          }

          console.log("[v0] Connecting to database...")
          await connectToDatabase()
          console.log("[v0] Database connected")

          console.log("[v0] Looking for existing user...")
          const existingUser = await User.findOne({ email: user.email })

          if (existingUser) {
            console.log("[v0] Existing user found with provider:", existingUser.provider)

            // If user exists with credentials, prevent Google login
            if (existingUser.provider === "credentials") {
              console.log("[v0] ERROR: User already exists with email/password")
              return "/login?error=OAuthAccountNotLinked"
            }

            // Update Google user info
            if (existingUser.provider === "google") {
              console.log("[v0] Updating existing Google user")
              existingUser.name = user.name || existingUser.name
              existingUser.image = user.image || existingUser.image
              existingUser.googleId = account.providerAccountId
              await existingUser.save()
              console.log("[v0] Google user updated successfully")

              // Set user id for session
              user.id = existingUser._id.toString()
            }
          } else {
            // Create new Google user
            console.log("[v0] Creating new Google user...")
            const newUser = await User.create({
              email: user.email,
              name: user.name || user.email.split("@")[0],
              image: user.image,
              provider: "google",
              googleId: account.providerAccountId,
              isActive: true,
            })
            console.log("[v0] New Google user created with ID:", newUser._id.toString())

            // Set user id for session
            user.id = newUser._id.toString()
          }

          console.log("[v0] Google OAuth sign in successful")
          console.log("[v0] ===== SIGNIN CALLBACK END =====")
          return true
        }

        // For other providers, allow by default
        console.log("[v0] Unknown provider, allowing by default")
        return true
      } catch (error: any) {
        console.error("[v0] ===== SIGNIN CALLBACK ERROR =====")
        console.error("[v0] Error name:", error.name)
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)
        console.error("[v0] Full error:", JSON.stringify(error, null, 2))

        // The error is logged for debugging
        return true
      }
    },
    async jwt({ token, user, account }) {
      console.log("[v0] JWT callback triggered")
      console.log("[v0] Has user:", !!user)
      console.log("[v0] Token ID:", token.id)
      console.log("[v0] Provider:", account?.provider)

      if (user) {
        if (account?.provider === "google") {
          console.log("[v0] JWT: Processing Google user")
          try {
            await connectToDatabase()
            const dbUser = await User.findOne({ email: user.email })
            if (dbUser) {
              token.id = dbUser._id.toString()
              console.log("[v0] JWT: Set token ID to:", token.id)
            } else {
              console.error("[v0] JWT: Could not find user in database")
            }
          } catch (error) {
            console.error("[v0] JWT: Error fetching user:", error)
          }
        } else {
          token.id = user.id
          console.log("[v0] JWT: Set token ID from user.id:", token.id)
        }
      }
      return token
    },
    async session({ session, token }) {
      console.log("[v0] Session callback - token.id:", token.id)
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "development"
      ? "development-secret-please-change-in-production-min-32-chars"
      : undefined),
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
})
