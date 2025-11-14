'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import Link from 'next/link';

export default function TestsPage() {
  const tests = [
    {
      id: '1',
      sampleCode: 'SAMPLE-001',
      testName: 'Total Viable Count',
      section: 'Microbiology',
      analyst: 'John Brown',
      status: 'COMPLETED',
      result: '< 10 CFU/g',
      dueDate: '2024-11-15',
      oos: false,
    },
    {
      id: '2',
      sampleCode: 'SAMPLE-001',
      testName: 'Heavy Metals - Lead',
      section: 'Chemistry',
      analyst: 'Sarah Miller',
      status: 'IN_PROGRESS',
      result: '',
      dueDate: '2024-11-16',
      oos: false,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage test assignments and results
          </p>
        </div>

        <Card>
          <Table
            headers={[
              'Sample',
              'Test Name',
              'Section',
              'Analyst',
              'Status',
              'Due Date',
              'Result',
              'OOS',
              'Actions',
            ]}
          >
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/samples/${test.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {test.sampleCode}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.testName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.section}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.analyst}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={test.status === 'COMPLETED' ? 'success' : 'info'}>{test.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(test.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{test.result || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {test.oos ? <Badge variant="danger">Yes</Badge> : <Badge variant="success">No</Badge>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/tests/${test.id}`} className="text-blue-600 hover:text-blue-900">
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
