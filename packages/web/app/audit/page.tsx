'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, Table, Badge } from '@/components/ui/display';
import { Input, Select } from '@/components/ui/form';
import { useState } from 'react';

export default function AuditPage() {
  const [filters, setFilters] = useState({
    table: '',
    action: '',
    actorEmail: '',
    fromDate: '',
    toDate: '',
  });

  const auditLogs = [
    {
      id: '1',
      action: 'UPDATE',
      table: 'Sample',
      recordId: 'sample-1',
      actorEmail: 'john@lab.com',
      changes: {
        field: 'status',
        oldValue: 'DRAFT',
        newValue: 'IN_PROGRESS',
      },
      at: '2024-11-14T10:30:00Z',
      txId: 'tx-123',
    },
    {
      id: '2',
      action: 'CREATE',
      table: 'TestAssignment',
      recordId: 'test-5',
      actorEmail: 'sarah@lab.com',
      changes: null,
      at: '2024-11-14T09:15:00Z',
      txId: 'tx-124',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="mt-2 text-sm text-gray-600">
            Complete audit trail of system changes
          </p>
        </div>

        {/* Filters */}
        <Card title="Filters">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select
              label="Table"
              value={filters.table}
              onChange={(e) => setFilters({ ...filters, table: e.target.value })}
              options={[
                { value: '', label: 'All Tables' },
                { value: 'Sample', label: 'Sample' },
                { value: 'TestAssignment', label: 'Test Assignment' },
                { value: 'Job', label: 'Job' },
                { value: 'COAReport', label: 'COA Report' },
              ]}
            />
            <Select
              label="Action"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              options={[
                { value: '', label: 'All Actions' },
                { value: 'CREATE', label: 'Create' },
                { value: 'UPDATE', label: 'Update' },
                { value: 'DELETE', label: 'Delete' },
              ]}
            />
            <Input
              type="text"
              label="User Email"
              value={filters.actorEmail}
              onChange={(e) => setFilters({ ...filters, actorEmail: e.target.value })}
              placeholder="user@example.com"
            />
            <Input
              type="date"
              label="From Date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
            <Input
              type="date"
              label="To Date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <Table
            headers={[
              'Timestamp',
              'Action',
              'Table',
              'Record ID',
              'User',
              'Changes',
              'Transaction ID',
            ]}
          >
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      log.action === 'CREATE'
                        ? 'success'
                        : log.action === 'UPDATE'
                        ? 'info'
                        : 'danger'
                    }
                  >
                    {log.action}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.table}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {log.recordId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.actorEmail}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.changes ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.changes.field}:</span>
                        <span className="text-red-600 line-through">{log.changes.oldValue}</span>
                        <span>→</span>
                        <span className="text-green-600">{log.changes.newValue}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">New record</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {log.txId}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}
