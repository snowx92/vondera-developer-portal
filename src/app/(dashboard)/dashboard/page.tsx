'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { appsService } from '@/lib/services';
import type { App } from '@/lib/types/api.types';
import { AppCard } from '@/components/dashboard/AppCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only load apps if we have a token
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    console.log('📊 Dashboard: Checking token before loading apps. Token:', token ? 'exists' : 'missing');
    if (token) {
      loadApps();
    } else {
      setLoading(false);
    }
  }, []);

  const loadApps = async () => {
    try {
      console.log('📊 Dashboard: Loading apps...');
      setLoading(true);
      setError(null);
      const data = await appsService.getApps();
      console.log('📊 Dashboard: Apps loaded successfully:', data.length, 'apps');
      setApps(data);
    } catch (err) {
      console.error('📊 Dashboard: Error loading apps:', err);
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const publishedApps = apps.filter(app => app.status === 'PUBLISHED');
  const draftApps = apps.filter(app => app.status === 'DRAFT');
  const pendingApps = apps.filter(app => app.status === 'PENDING');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Manage your Vondera apps and integrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Apps"
          value={apps.length.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
          trend={apps.length > 0 ? '+12% from last month' : undefined}
          color="purple"
        />
        <StatsCard
          title="Published"
          value={publishedApps.length.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatsCard
          title="In Review"
          value={pendingApps.length.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
        />
        <StatsCard
          title="Drafts"
          value={draftApps.length.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          color="gray"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/apps/new"
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-vondera-purple hover:bg-purple-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-vondera-purple transition-colors">
              <svg className="w-6 h-6 text-vondera-purple group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create New App</h3>
              <p className="text-sm text-gray-500">Start building your integration</p>
            </div>
          </Link>

          <Link
            href="/dashboard/docs"
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-vondera-purple hover:bg-purple-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View Documentation</h3>
              <p className="text-sm text-gray-500">Learn how to build apps</p>
            </div>
          </Link>

          <Link
            href="/dashboard/api-reference"
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-vondera-purple hover:bg-purple-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">API Reference</h3>
              <p className="text-sm text-gray-500">Explore available APIs</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Apps List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Apps</h2>
          <Link
            href="/dashboard/apps"
            className="text-sm font-medium text-vondera-purple hover:text-vondera-purple-dark"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadApps}
              className="text-sm font-medium text-vondera-purple hover:text-vondera-purple-dark"
            >
              Try again
            </button>
          </div>
        ) : apps.length === 0 ? (
          <EmptyState
            title="No apps yet"
            description="Create your first app to start building integrations for Vondera platform"
            actionLabel="Create App"
            actionHref="/dashboard/apps/new"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.slice(0, 6).map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
