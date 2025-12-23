'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { App, GeneralSettings } from '@/lib/types/api.types';
import { GeneralSettingsTab } from './tabs/GeneralSettingsTab';
import { ListingTab } from './tabs/ListingTab';
import { EndpointsTab } from './tabs/EndpointsTab';
import { ScopesTab } from './tabs/ScopesTab';
import { WebhooksTab } from './tabs/WebhooksTab';

interface AppSettingsTabsProps {
  app: App;
  generalSettings: GeneralSettings | null;
  onUpdate: () => void;
}

const tabs = [
  { id: 'general', label: 'General', icon: '⚙️' },
  { id: 'listing', label: 'Store Listing', icon: '🏪' },
  { id: 'endpoints', label: 'Endpoints', icon: '🔗' },
  { id: 'scopes', label: 'Permissions', icon: '🔐' },
  { id: 'webhooks', label: 'Webhooks', icon: '🪝' },
  { id: 'pricing', label: 'Pricing', icon: '💰' },
  { id: 'setup', label: 'Setup Form', icon: '📋' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700' },
  APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  PENDING: { label: 'In Review', color: 'bg-yellow-100 text-yellow-700' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
};

export function AppSettingsTabs({ app, generalSettings, onUpdate }: AppSettingsTabsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const status = statusConfig[app.status] || statusConfig.DRAFT;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/dashboard/apps"
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{app.name}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-gray-600 ml-8">
          Version {generalSettings?.version || app.version} • {app.category?.replace(/-/g, ' ')}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-vondera-purple text-vondera-purple'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettingsTab appId={app.id} settings={generalSettings} onUpdate={onUpdate} />
          )}
          {activeTab === 'listing' && (
            <ListingTab appId={app.id} onUpdate={onUpdate} />
          )}
          {activeTab === 'endpoints' && (
            <EndpointsTab appId={app.id} onUpdate={onUpdate} />
          )}
          {activeTab === 'scopes' && (
            <ScopesTab appId={app.id} onUpdate={onUpdate} />
          )}
          {activeTab === 'webhooks' && (
            <WebhooksTab appId={app.id} onUpdate={onUpdate} />
          )}
          {activeTab === 'pricing' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Pricing settings coming soon</p>
            </div>
          )}
          {activeTab === 'setup' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Setup form settings coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
