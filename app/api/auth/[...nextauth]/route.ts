// Import env init first to set environment variables
import "@/lib/auth/env-init";

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const dynamic = "force-dynamic";
