'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MethodsPage() {
  const methods = [
    {
      id: '1',
      code: 'MICRO-001',
      name: 'Total Viable Count',
      description: 'Enumeration of aerobic bacteria',
      unit: 'CFU/g',
    },
    {
      id: '2',
      code: 'CHEM-001',
      name: 'Heavy Metals - Lead',
      description: 'ICP-MS analysis for lead',
      unit: 'ppm',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Methods</h1>
            <p className="mt-2 text-sm text-gray-600">
              Testing methods and procedures
            </p>
          </div>
          <Button>Add New Method</Button>
        </div>

        <Card>
          <Table headers={['Code', 'Name', 'Description', 'Unit', 'Actions']}>
            {methods.map((method) => (
              <tr key={method.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {method.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {method.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {method.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {method.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/methods/${method.id}/edit`} className="text-blue-600 hover:text-blue-900">
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
