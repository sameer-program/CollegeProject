import "@/lib/auth/env-init";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to appropriate dashboard based on role
    if (path === "/dashboard" && token) {
      const role = (token as any).role;
      const roleDashboards: Record<string, string> = {
        consultant: "/dashboard/consultant",
        validator: "/dashboard/validator",
        governance: "/dashboard/governance",
        executive: "/dashboard/executive",
        controller: "/dashboard/controller",
        staff: "/dashboard/staff",
      };

      const dashboardPath = roleDashboards[role] || "/dashboard";
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        if (path.startsWith("/login") || path.startsWith("/register")) {
          return !token; // Redirect if already logged in
        }

        // Protected routes
        if (
          path.startsWith("/dashboard") ||
          path.startsWith("/knowledge") ||
          path.startsWith("/api")
        ) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/knowledge/:path*",
    "/api/:path*",
    "/login",
    "/register",
  ],
};
