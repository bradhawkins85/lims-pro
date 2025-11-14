'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SamplesPage() {
  const samples = [
    {
      id: '1',
      sampleCode: 'SAMPLE-001',
      jobNumber: 'JOB-2024-001',
      client: 'Acme Corporation',
      dateReceived: '2024-11-01',
      status: 'In Progress',
      urgent: true,
      released: false,
    },
    {
      id: '2',
      sampleCode: 'SAMPLE-002',
      jobNumber: 'JOB-2024-001',
      client: 'Acme Corporation',
      dateReceived: '2024-11-05',
      status: 'Released',
      urgent: false,
      released: true,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Samples</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage laboratory samples and testing
            </p>
          </div>
          <Link href="/samples/new">
            <Button>Register New Sample</Button>
          </Link>
        </div>

        <Card>
          <Table
            headers={[
              'Sample Code',
              'Job Number',
              'Client',
              'Date Received',
              'Status',
              'Flags',
              'Actions',
            ]}
          >
            {samples.map((sample) => (
              <tr key={sample.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/samples/${sample.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {sample.sampleCode}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link href={`/jobs/${sample.id}`} className="text-blue-600 hover:text-blue-800">
                    {sample.jobNumber}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sample.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(sample.dateReceived).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={sample.released ? 'success' : 'info'}>
                    {sample.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.urgent && (
                    <Badge variant="danger" className="mr-1">Urgent</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/samples/${sample.id}`} className="text-blue-600 hover:text-blue-900">
                    View
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
