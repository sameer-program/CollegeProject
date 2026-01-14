// Initialize environment variables before any NextAuth code runs
// This must be imported first in any file that uses NextAuth

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    "your-super-secret-nextauth-key-change-in-production-2024-hardcoded-demo";
}

if (!process.env.NEXTAUTH_URL) {
  // Detect production URL from Vercel or use localhost for development
  const vercelUrl = process.env.VERCEL_URL;
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL;

  if (isProduction && vercelUrl) {
    // Vercel provides VERCEL_URL without protocol (e.g., "sameerrai-nine.vercel.app")
    // Always use https in production
    process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
  } else if (isProduction) {
    // Fallback: use the known production URL
    process.env.NEXTAUTH_URL = "https://sameerrai-nine.vercel.app";
  } else {
    // Development
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}

// Export to ensure this module is executed
export {};
