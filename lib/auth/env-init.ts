// Initialize environment variables before any NextAuth code runs
// This must be imported first in any file that uses NextAuth

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    "your-super-secret-nextauth-key-change-in-production-2024-hardcoded-demo";
}

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

// Export to ensure this module is executed
export {};
