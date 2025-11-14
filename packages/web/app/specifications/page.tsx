'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SpecificationsPage() {
  const specifications = [
    {
      id: '1',
      code: 'SPEC-TVC',
      name: 'TVC Standard',
      target: 10,
      min: null,
      max: 100,
      unit: 'CFU/g',
    },
    {
      id: '2',
      code: 'SPEC-LEAD',
      name: 'Lead Limit',
      target: null,
      min: null,
      max: 2,
      unit: 'ppm',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Specifications</h1>
            <p className="mt-2 text-sm text-gray-600">
              Acceptance criteria and limits
            </p>
          </div>
          <Button>Add New Specification</Button>
        </div>

        <Card>
          <Table headers={['Code', 'Name', 'Target', 'Min', 'Max', 'Unit', 'Actions']}>
            {specifications.map((spec) => (
              <tr key={spec.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {spec.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {spec.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {spec.target || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {spec.min || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {spec.max || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {spec.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/specifications/${spec.id}/edit`} className="text-blue-600 hover:text-blue-900">
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
