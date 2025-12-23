'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { appsService } from '@/lib/services';
import type { App } from '@/lib/types/api.types';
import { AppCard } from '@/components/dashboard/AppCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';

export default function AllAppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appsService.getApps();
      setApps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const filterApps = useCallback(() => {
    let filtered = apps;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.category?.toLowerCase().includes(query)
      );
    }

    setFilteredApps(filtered);
  }, [apps, statusFilter, searchQuery]);

  useEffect(() => {
    loadApps();
  }, []);

  useEffect(() => {
    filterApps();
  }, [filterApps]);

  const statusTabs = [
    { value: 'all', label: 'All Apps', count: apps.length },
    { value: 'PUBLISHED', label: 'Published', count: apps.filter(a => a.status === 'PUBLISHED').length },
    { value: 'DRAFT', label: 'Drafts', count: apps.filter(a => a.status === 'DRAFT').length },
    { value: 'PENDING', label: 'In Review', count: apps.filter(a => a.status === 'PENDING').length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Apps</h1>
          <p className="text-gray-600">Manage all your Vondera integrations</p>
        </div>
        <Link href="/dashboard/apps/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create App
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search apps by name, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-vondera-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              <span className={`ml-2 ${statusFilter === tab.value ? 'text-purple-200' : 'text-gray-500'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadApps} variant="outline">
              Try again
            </Button>
          </div>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          {apps.length === 0 ? (
            <EmptyState
              title="No apps yet"
              description="Create your first app to start building integrations for Vondera platform"
              actionLabel="Create App"
              actionHref="/dashboard/apps/new"
            />
          ) : (
            <EmptyState
              title="No apps found"
              description={`No apps match your current filters. Try adjusting your search or filters.`}
              icon={
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
