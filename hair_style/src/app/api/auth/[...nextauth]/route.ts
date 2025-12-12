import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb-adapter"
import dbConnect from "@/lib/mongodb"
import User from "../../../../../model/user"
import bcrypt from "bcryptjs"

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                await dbConnect()

                const user = await User.findOne({ email: credentials.email })

                if (!user) {
                    return null
                }

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordMatch) {
                    return null
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign_in",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }
