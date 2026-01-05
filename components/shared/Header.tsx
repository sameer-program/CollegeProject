'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              DKN Platform
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session && (
              <>
                <span className="text-sm text-gray-700">
                  {session.user?.name} ({session.user?.role})
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

