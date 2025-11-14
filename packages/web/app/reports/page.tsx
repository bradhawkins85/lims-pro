'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import Link from 'next/link';

export default function ReportsPage() {
  const reports = [
    {
      id: '1',
      sampleCode: 'SAMPLE-001',
      version: 2,
      status: 'FINAL',
      createdAt: '2024-11-10T10:00:00Z',
      createdBy: 'Sarah Miller',
      approvedBy: 'Lab Manager',
    },
    {
      id: '2',
      sampleCode: 'SAMPLE-002',
      version: 1,
      status: 'DRAFT',
      createdAt: '2024-11-11T14:30:00Z',
      createdBy: 'John Brown',
      approvedBy: null,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">COA Reports</h1>
          <p className="mt-2 text-sm text-gray-600">
            Certificates of Analysis
          </p>
        </div>

        <Card>
          <Table
            headers={[
              'Sample',
              'Version',
              'Status',
              'Created Date',
              'Created By',
              'Approved By',
              'Actions',
            ]}
          >
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/samples/${report.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {report.sampleCode}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  v{report.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={report.status === 'FINAL' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.approvedBy || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/reports/${report.id}/preview`} className="text-blue-600 hover:text-blue-900">
                    Preview
                  </Link>
                  <Link href={`/reports/${report.id}/download`} className="text-gray-600 hover:text-gray-900">
                    Download
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
