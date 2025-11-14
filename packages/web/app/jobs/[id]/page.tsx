'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Badge } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/form';
import Link from 'next/link';
import { useState } from 'react';

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock job data
  const job = {
    id: params.id,
    jobNumber: 'JOB-2024-001',
    clientId: 'client-1',
    client: { id: 'client-1', name: 'Acme Corporation' },
    needByDate: '2024-12-01',
    mcdDate: '2024-11-25',
    status: 'ACTIVE',
    quoteNumber: 'Q-2024-001',
    poNumber: 'PO-12345',
    soNumber: 'SO-67890',
    amountExTax: 5000.00,
    invoiced: false,
  };

  const samples = [
    { id: '1', sampleCode: 'SAMPLE-001', description: 'Raw Material A', status: 'In Progress' },
    { id: '2', sampleCode: 'SAMPLE-002', description: 'Raw Material B', status: 'Released' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{job.jobNumber}</h1>
              <Badge variant="info">{job.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Client: {job.client.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/jobs">
              <Button variant="secondary">Back to Jobs</Button>
            </Link>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save Changes' : 'Edit Job'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Job Information">
            <div className="space-y-4">
              <Input label="Job Number" value={job.jobNumber} disabled={!isEditing} />
              <Select
                label="Client"
                value={job.clientId}
                disabled={!isEditing}
                options={[
                  { value: 'client-1', label: 'Acme Corporation' },
                  { value: 'client-2', label: 'Beta Industries' },
                ]}
              />
            </div>
          </Card>
          <Card title="Samples">
            <div className="space-y-3">
              {samples.map((sample) => (
                <Link key={sample.id} href={`/samples/${sample.id}`} className="block p-3 rounded-md hover:bg-gray-50 border">
                  <p className="text-sm font-medium">{sample.sampleCode}</p>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
