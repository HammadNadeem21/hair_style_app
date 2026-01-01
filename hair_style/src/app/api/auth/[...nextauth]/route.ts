import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb-adapter"
import dbConnect from "@/lib/mongodb"
import User from "../../../../../model/user"
import bcrypt from "bcryptjs"

console.log("NextAuth Environment Check:", {
    HAS_GOOGLE_ID: !!process.env.GOOGLE_CLIENT_ID,
    HAS_GOOGLE_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
});

const handler = NextAuth({
    debug: true,
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("Authorize callback initiated for:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing email or password");
                    return null
                }

                await dbConnect()

                const user = await User.findOne({ email: credentials.email })
                console.log("User found in DB:", !!user);

                if (!user) {
                    console.log("No user found with this email");
                    return null
                }

                const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)
                console.log("Password match:", isPasswordMatch);

                if (!isPasswordMatch) {
                    console.log("Password mismatch");
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
        async jwt({ token, user, account }) {
            console.log("JWT Callback - Provider:", account?.provider);
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                console.log("JWT Callback - User data captured:", { id: user.id, email: user.email });
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session Callback - Token Email:", token.email);
            if (session.user) {
                await dbConnect();

                const userData = await User.findOne({ email: token.email });
                console.log("Session Callback - User in DB found:", !!userData);

                if (userData) {
                    session.user.name = userData.name;
                    session.user.email = userData.email;
                    session.user.id = userData._id.toString();
                    session.user.credits = userData.credits;
                } else {
                    // Fallback for new Google users if they aren't in our User model yet
                    // though MongoDBAdapter should have created them.
                    session.user.id = token.id as string;
                }
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }
