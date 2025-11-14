'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Badge, Table } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import { Input, TextArea, Checkbox } from '@/components/ui/form';
import Link from 'next/link';
import { useState } from 'react';

export default function SampleDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock sample data
  const sample = {
    id: params.id,
    sampleCode: 'SAMPLE-001',
    jobId: '1',
    jobNumber: 'JOB-2024-001',
    clientId: '1',
    clientName: 'Acme Corporation',
    dateReceived: '2024-11-01',
    dateDue: '2024-11-15',
    rmSupplier: 'Supplier XYZ',
    sampleDescription: 'Raw Material Sample for Testing',
    uinCode: 'UIN-123456',
    sampleBatch: 'BATCH-2024-001',
    temperatureOnReceiptC: 25.0,
    storageConditions: 'Store at room temperature',
    comments: 'Sample received in good condition',
    // Status flags
    expiredRawMaterial: false,
    postIrradiatedRawMaterial: false,
    stabilityStudy: true,
    urgent: true,
    allMicroTestsAssigned: true,
    allChemistryTestsAssigned: false,
    released: false,
    retest: false,
    releaseDate: null,
    // Dates
    needByDate: '2024-11-20',
    mcdDate: '2024-11-18',
    // Accounting
    quoteNumber: 'Q-2024-001',
    poNumber: 'PO-12345',
    soNumber: 'SO-67890',
    amountExGST: 5000.00,
    invoiced: false,
  };

  const tests = [
    {
      id: '1',
      testName: 'Total Viable Count',
      section: 'Microbiology',
      analyst: 'John Brown',
      status: 'COMPLETED',
      result: '< 10 CFU/g',
      specification: '< 100 CFU/g',
      oos: false,
    },
    {
      id: '2',
      testName: 'Heavy Metals - Lead',
      section: 'Chemistry',
      analyst: 'Sarah Miller',
      status: 'IN_PROGRESS',
      result: '',
      specification: '< 2 ppm',
      oos: false,
    },
  ];

  const coaVersions = [
    {
      id: '1',
      version: 2,
      status: 'FINAL',
      createdBy: 'Sarah Miller',
      approvedBy: 'Lab Manager',
      createdAt: '2024-11-10T10:00:00Z',
    },
    {
      id: '2',
      version: 1,
      status: 'SUPERSEDED',
      createdBy: 'John Brown',
      approvedBy: null,
      createdAt: '2024-11-08T14:30:00Z',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{sample.sampleCode}</h1>
              {sample.urgent && <Badge variant="danger">Urgent</Badge>}
              {sample.released && <Badge variant="success">Released</Badge>}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Job: <Link href={`/jobs/${sample.jobId}`} className="text-blue-600">{sample.jobNumber}</Link> • 
              Client: {sample.clientName}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/samples">
              <Button variant="secondary">Back to Samples</Button>
            </Link>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Save Changes' : 'Edit Sample'}
            </Button>
          </div>
        </div>

        {/* Sample Information */}
        <Card title="Sample Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Job Number" value={sample.jobNumber} disabled />
            <Input type="date" label="Date Received" value={sample.dateReceived} disabled={!isEditing} />
            <Input type="date" label="Date Due" value={sample.dateDue} disabled={!isEditing} />
            <Input label="Client" value={sample.clientName} disabled />
            <Input label="Sample Code" value={sample.sampleCode} disabled={!isEditing} />
            <Input label="RM Supplier" value={sample.rmSupplier} disabled={!isEditing} />
            <div className="md:col-span-2">
              <Input label="Sample Description" value={sample.sampleDescription} disabled={!isEditing} />
            </div>
            <Input label="UIN Code" value={sample.uinCode} disabled={!isEditing} />
            <Input label="Sample Batch" value={sample.sampleBatch} disabled={!isEditing} />
            <Input type="number" label="Temperature on Receipt (°C)" value={sample.temperatureOnReceiptC} disabled={!isEditing} />
            <Input label="Storage Conditions" value={sample.storageConditions} disabled={!isEditing} />
            <div className="md:col-span-2">
              <TextArea label="Comments" value={sample.comments} disabled={!isEditing} rows={3} />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Flags */}
          <Card title="Status Flags">
            <div className="space-y-3">
              <Checkbox label="Expired Raw Material" checked={sample.expiredRawMaterial} disabled={!isEditing} />
              <Checkbox label="Post-irradiated Raw Material" checked={sample.postIrradiatedRawMaterial} disabled={!isEditing} />
              <Checkbox label="Stability Study" checked={sample.stabilityStudy} disabled={!isEditing} />
              <Checkbox label="Urgent" checked={sample.urgent} disabled={!isEditing} />
              <Checkbox label="All Micro Tests Assigned" checked={sample.allMicroTestsAssigned} disabled={!isEditing} />
              <Checkbox label="All Chemistry Tests Assigned" checked={sample.allChemistryTestsAssigned} disabled={!isEditing} />
              <Checkbox label="Released" checked={sample.released} disabled={!isEditing} />
              <Checkbox label="Retest" checked={sample.retest} disabled={!isEditing} />
              {sample.releaseDate && (
                <Input type="date" label="Release Date" value={sample.releaseDate} disabled />
              )}
            </div>
          </Card>

          {/* Dates */}
          <Card title="Important Dates">
            <div className="space-y-4">
              <Input type="date" label="Need By" value={sample.needByDate} disabled={!isEditing} />
              <Input type="date" label="M.C.D." value={sample.mcdDate} disabled={!isEditing} />
            </div>
          </Card>
        </div>

        {/* Accounting */}
        <Card title="Accounting Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input label="Quote #" value={sample.quoteNumber} disabled={!isEditing} />
            <Input label="PO #" value={sample.poNumber} disabled={!isEditing} />
            <Input label="SO #" value={sample.soNumber} disabled={!isEditing} />
            <Input type="number" label="Amount Ex GST" value={sample.amountExGST} disabled={!isEditing} step="0.01" />
            <Checkbox label="Invoiced" checked={sample.invoiced} disabled={!isEditing} />
          </div>
        </Card>

        {/* Actions */}
        <Card title="Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="secondary" size="sm">Cover Sheet (PDF)</Button>
            <Button variant="secondary" size="sm">Job Sheet (PDF)</Button>
            <Button variant="secondary" size="sm">Micro Worksheets</Button>
            <Button variant="secondary" size="sm">Send SRA</Button>
            <Button variant="secondary" size="sm">Past Deliveries</Button>
            <Button variant="secondary" size="sm">Generate Re-Test</Button>
            <Button variant="secondary" size="sm">Preview COA</Button>
            <Button variant="primary" size="sm">Export COA</Button>
          </div>
        </Card>

        {/* Tests Grid */}
        <Card title="Tests" actions={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">Add TVC & Y&M</Button>
            <Button size="sm" variant="secondary">Add Basic 6 Micro</Button>
            <Button size="sm" variant="secondary">Add 4× Heavy Metals</Button>
            <Button size="sm" variant="secondary">Add 4× Liquid Physical</Button>
          </div>
        }>
          <Table headers={['Test Name', 'Section', 'Analyst', 'Status', 'Result', 'Specification', 'OOS', 'Actions']}>
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{test.testName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.section}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.analyst}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={test.status === 'COMPLETED' ? 'success' : 'info'}>{test.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.result || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.specification}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {test.oos ? <Badge variant="danger">OOS</Badge> : <Badge variant="success">OK</Badge>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/tests/${test.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        {/* COA Versions */}
        <Card title="COA Versions">
          <div className="space-y-3">
            {coaVersions.map((coa) => (
              <div key={coa.id} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Version {coa.version}</span>
                      <Badge variant={coa.status === 'FINAL' ? 'success' : 'default'}>{coa.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Created by {coa.createdBy} on {new Date(coa.createdAt).toLocaleDateString()}
                    </p>
                    {coa.approvedBy && (
                      <p className="text-xs text-gray-500">Approved by {coa.approvedBy}</p>
                    )}
                  </div>
                  <Button size="sm" variant="secondary">Download PDF</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
