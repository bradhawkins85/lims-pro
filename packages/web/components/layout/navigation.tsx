'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  name: string;
  href: string;
  icon?: string;
  requiredRoles?: string[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Samples', href: '/samples' },
  { name: 'Tests', href: '/tests' },
  { name: 'Clients', href: '/clients' },
  { name: 'Methods', href: '/methods' },
  { name: 'Specifications', href: '/specifications' },
  { name: 'Packs', href: '/packs' },
  { name: 'Reports', href: '/reports' },
  { name: 'Audit', href: '/audit', requiredRoles: ['ADMIN', 'LAB_MANAGER'] },
  { name: 'Settings', href: '/settings', requiredRoles: ['ADMIN', 'LAB_MANAGER'] },
];

interface NavigationProps {
  userRole?: string;
}

export function Navigation({ userRole = 'ADMIN' }: NavigationProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(userRole);
  });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Laboratory LIMS Pro
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  U
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
