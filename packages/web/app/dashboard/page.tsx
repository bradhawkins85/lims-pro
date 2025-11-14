'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/display';
import Link from 'next/link';

export default function DashboardPage() {
  // In a real implementation, these would be fetched from the API
  const stats = {
    samplesAwaitingReview: 12,
    oosItems: 3,
    jobsDueSoon: 8,
    activeSamples: 45,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to Laboratory LIMS Pro
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/samples?filter=awaiting-review">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Samples Awaiting Review
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-blue-600">
                    {stats.samplesAwaitingReview}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/samples?filter=oos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Out of Spec Items
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-red-600">
                    {stats.oosItems}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/jobs?filter=due-soon">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Jobs Due Soon
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-yellow-600">
                    {stats.jobsDueSoon}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/samples">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Active Samples
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-green-600">
                    {stats.activeSamples}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card title="Quick Actions">
            <div className="space-y-3">
              <Link href="/jobs/new" className="block p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Create New Job</p>
                    <p className="text-xs text-gray-500">Start a new work order</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <Link href="/samples/new" className="block p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Register Sample</p>
                    <p className="text-xs text-gray-500">Add a new sample for testing</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              <Link href="/tests" className="block p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">View All Tests</p>
                    <p className="text-xs text-gray-500">Manage test assignments</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">JB</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">John Brown</span> completed test for{' '}
                    <span className="font-medium">SAMPLE-001</span>
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs font-medium">SM</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Sarah Miller</span> approved COA for{' '}
                    <span className="font-medium">JOB-2024-001</span>
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 text-xs font-medium">DW</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">David Wilson</span> created new job{' '}
                    <span className="font-medium">JOB-2024-045</span>
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
