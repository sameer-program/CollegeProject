import 'next-auth';
import { UserRole } from '@/lib/db/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      division: string;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    division: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    division: string;
  }
}

