'use client';

import { Navigation } from './navigation';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

export function AppLayout({ children, userRole }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={userRole} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
