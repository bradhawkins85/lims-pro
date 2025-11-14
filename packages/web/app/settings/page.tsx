'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/display';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/form';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            System configuration and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings */}
          <Card title="System Settings">
            <div className="space-y-4">
              <Input
                label="Laboratory Name"
                value="Laboratory LIMS Pro"
                placeholder="Enter laboratory name"
              />
              <Input
                label="Laboratory Address"
                value="123 Lab Street, Science City"
                placeholder="Enter address"
              />
              <Input
                type="email"
                label="Contact Email"
                value="info@lab.com"
                placeholder="contact@laboratory.com"
              />
              <Input
                type="tel"
                label="Contact Phone"
                value="+1 234 567 8900"
                placeholder="+1 234 567 8900"
              />
            </div>
          </Card>

          {/* Default Settings */}
          <Card title="Default Settings">
            <div className="space-y-4">
              <Input
                type="number"
                label="Default Sample Due Days"
                value="14"
                placeholder="14"
              />
              <Select
                label="Default Currency"
                value="AUD"
                options={[
                  { value: 'AUD', label: 'AUD - Australian Dollar' },
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                ]}
              />
              <Select
                label="Temperature Unit"
                value="C"
                options={[
                  { value: 'C', label: 'Celsius (°C)' },
                  { value: 'F', label: 'Fahrenheit (°F)' },
                ]}
              />
            </div>
          </Card>

          {/* User Management */}
          <Card title="User Management" actions={
            <Button size="sm">Add User</Button>
          }>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Manage user accounts and roles
              </p>
              <Button variant="secondary" className="w-full">
                View All Users
              </Button>
              <Button variant="secondary" className="w-full">
                Manage Roles & Permissions
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card title="Notification Settings">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Test Completion Alerts</p>
                  <p className="text-xs text-gray-500">Notify when tests are completed</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">OOS Alerts</p>
                  <p className="text-xs text-gray-500">Notify on out-of-spec results</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
}
