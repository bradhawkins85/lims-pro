'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Job, JobStatus } from '@/lib/types';

function getStatusBadge(status: JobStatus) {
  const variants = {
    DRAFT: 'default',
    ACTIVE: 'info',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  } as const;
  return <Badge variant={variants[status]}>{status}</Badge>;
}

export default function JobsPage() {
  // In a real implementation, this would be fetched from the API
  const jobs: Job[] = [
    {
      id: '1',
      jobNumber: 'JOB-2024-001',
      clientId: 'client-1',
      client: { id: 'client-1', name: 'Acme Corporation', createdAt: '', updatedAt: '' },
      needByDate: '2024-12-01',
      mcdDate: '2024-11-25',
      status: 'ACTIVE',
      quoteNumber: 'Q-2024-001',
      poNumber: 'PO-12345',
      soNumber: 'SO-67890',
      amountExTax: 5000.00,
      invoiced: false,
      createdAt: '2024-11-01T00:00:00Z',
      updatedAt: '2024-11-10T00:00:00Z',
    },
    {
      id: '2',
      jobNumber: 'JOB-2024-002',
      clientId: 'client-2',
      client: { id: 'client-2', name: 'Beta Industries', createdAt: '', updatedAt: '' },
      needByDate: '2024-11-30',
      status: 'COMPLETED',
      quoteNumber: 'Q-2024-002',
      amountExTax: 3500.00,
      invoiced: true,
      createdAt: '2024-10-15T00:00:00Z',
      updatedAt: '2024-11-05T00:00:00Z',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage work orders and projects
            </p>
          </div>
          <Link href="/jobs/new">
            <Button>Create New Job</Button>
          </Link>
        </div>

        <Card>
          <Table
            headers={[
              'Job Number',
              'Client',
              'Status',
              'Need By',
              'Amount',
              'Invoiced',
              'Actions',
            ]}
          >
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {job.jobNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {job.client?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(job.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {job.needByDate ? new Date(job.needByDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${job.amountExTax?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={job.invoiced ? 'success' : 'warning'}>
                    {job.invoiced ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                  <Link href={`/jobs/${job.id}/edit`} className="text-gray-600 hover:text-gray-900">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
