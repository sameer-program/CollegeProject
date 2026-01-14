// Import env init first to set environment variables
import "./env-init";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await user.matchPassword(credentials.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Update last login
        user.last_login_at = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.role,
          division: user.division,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.division = (user as any).division;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).division = token.division;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    "your-super-secret-nextauth-key-change-in-production-2024-hardcoded-demo",
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
};
