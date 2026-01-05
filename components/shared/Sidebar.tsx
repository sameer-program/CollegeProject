'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const navigation = [
    { name: 'Dashboard', href: `/dashboard/${role}`, icon: '📊' },
    { name: 'Knowledge', href: '/knowledge', icon: '📚' },
    { name: 'Create Knowledge', href: '/knowledge/create', icon: '➕' },
  ];

  // Add role-specific navigation
  if (role === 'controller') {
    navigation.push(
      { name: 'Users', href: '/dashboard/controller/users', icon: '👥' },
      { name: 'AI Modules', href: '/dashboard/controller/ai', icon: '🤖' }
    );
  }

  return (
    <aside className="w-64 bg-gray-50 min-h-screen p-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

