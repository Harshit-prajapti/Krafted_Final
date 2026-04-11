import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

const googleAuthEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
)

const providers = [
    ...(googleAuthEnabled
        ? [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
        ]
        : []),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials.password) return null

            const normalizedEmail = credentials.email.trim().toLowerCase()

            const user = await prisma.user.findFirst({
                where: {
                    email: {
                        equals: normalizedEmail,
                        mode: "insensitive",
                    },
                },
            })

            if (!user || !user.password) return null

            const isValid = await bcrypt.compare(
                credentials.password,
                user.password
            )

            if (!isValid) return null

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        },
    }),
]

/* =======================
   Module Augmentation
======================= */
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            role: UserRole
        }
    }

    interface User {
        role: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: UserRole
    }
}

/* =======================
   Auth Options
======================= */
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt", // Changed to JWT to support credentials provider
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    providers,

    /* =======================
       Callbacks
    ======================= */
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },

        async signIn({ user, account }) {
            // Only allow Google sign-in if email exists
            if (account?.provider === "google" && !user.email) {
                return false
            }
            return true
        },

        async redirect({ url, baseUrl }) {
            // After successful login, redirect to success page
            if (url.startsWith(baseUrl + "/api/auth/callback")) {
                return `${baseUrl}/auth/success`
            }
            // Allow callback URLs
            if (url.startsWith(baseUrl)) {
                return url
            }
            // Default to base URL
            return baseUrl
        },
    },

    /* =======================
       Pages
    ======================= */
    pages: {
        signIn: "/user/login",
        error: "/auth/error",
        verifyRequest: "/user/verify-email",
    },

    debug: process.env.NODE_ENV === "development",
}
