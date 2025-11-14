'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientsPage() {
  const clients = [
    {
      id: '1',
      name: 'Acme Corporation',
      contactName: 'Jane Smith',
      email: 'jane@acme.com',
      phone: '+1 234 567 8900',
    },
    {
      id: '2',
      name: 'Beta Industries',
      contactName: 'Bob Johnson',
      email: 'bob@beta.com',
      phone: '+1 234 567 8901',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage client organizations
            </p>
          </div>
          <Button>Add New Client</Button>
        </div>

        <Card>
          <Table headers={['Name', 'Contact Name', 'Email', 'Phone', 'Actions']}>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.contactName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                    View
                  </Link>
                  <Link href={`/clients/${client.id}/edit`} className="text-gray-600 hover:text-gray-900">
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
