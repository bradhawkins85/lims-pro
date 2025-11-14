'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PacksPage() {
  const packs = [
    {
      id: '1',
      name: 'Basic 6 Micro Tests',
      testCount: 6,
      description: 'Standard microbiology panel',
    },
    {
      id: '2',
      name: 'Heavy Metals Suite',
      testCount: 4,
      description: 'Lead, Cadmium, Mercury, Arsenic',
    },
    {
      id: '3',
      name: 'Liquid Physical Tests',
      testCount: 4,
      description: 'pH, Density, Viscosity, Appearance',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Packs</h1>
            <p className="mt-2 text-sm text-gray-600">
              Pre-configured test bundles
            </p>
          </div>
          <Button>Create New Pack</Button>
        </div>

        <Card>
          <Table headers={['Name', 'Tests', 'Description', 'Actions']}>
            {packs.map((pack) => (
              <tr key={pack.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {pack.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="info">{pack.testCount} tests</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {pack.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/packs/${pack.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                  <Link href={`/packs/${pack.id}/edit`} className="text-gray-600 hover:text-gray-900">
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
