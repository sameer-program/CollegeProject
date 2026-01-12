'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-gray-900">Sign in to DKN Platform</h2>
              <p className="mt-2 text-sm text-gray-600">Digital Knowledge Network</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>

              <div className="text-left">
                <Link
                  href="/register"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Don't have an account? Register
                </Link>
              </div>
            </form>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 text-sm text-gray-800 shadow-inner">
            <p className="font-semibold text-indigo-900 mb-3">
              Quick test credentials (all passwords: <span className="font-mono">password123</span>)
            </p>
            <ul className="space-y-2">
              <li className="flex justify-between gap-2"><span>Controller</span><span className="font-mono">controller@dkn.com</span></li>
              <li className="flex justify-between gap-2"><span>Consultant</span><span className="font-mono">consultant@dkn.com</span></li>
              <li className="flex justify-between gap-2"><span>Validator</span><span className="font-mono">validator@dkn.com</span></li>
              <li className="flex justify-between gap-2"><span>Governance</span><span className="font-mono">governance@dkn.com</span></li>
              <li className="flex justify-between gap-2"><span>Executive</span><span className="font-mono">executive@dkn.com</span></li>
              <li className="flex justify-between gap-2"><span>Staff</span><span className="font-mono">staff@dkn.com</span></li>
            </ul>
            <p className="mt-4 text-xs text-gray-600">
              Run <span className="font-mono">npm run init-db</span> before first login to seed these users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

