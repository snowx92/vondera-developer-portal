'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { appsService } from '@/lib/services';
import type { App, PerformanceOverview } from '@/lib/types/api.types';
import { AppCard } from '@/components/dashboard/AppCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceOverview | null>(null);

  // Default date range: last 30 days
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appsService.getApps();
      setApps(data);
    } catch (err) {
      console.error('Error loading apps:', err);
      setError(err instanceof Error ? err.message : 'Failed to load apps');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformanceData = useCallback(async () => {
    try {
      const data = await appsService.getPerformanceOverview('all', startDate, endDate);
      if (data) {
        setPerformanceData(data);
      }
    } catch (err) {
      console.error('Error loading performance data:', err);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      loadApps();
      loadPerformanceData();
    } else {
      setLoading(false);
    }
  }, [startDate, endDate, loadPerformanceData]);

  const publishedApps = apps.filter(app => app.status === 'PUBLISHED');
  const draftApps = apps.filter(app => app.status === 'DRAFT');
  const pendingApps = apps.filter(app => app.status === 'PENDING');

  // Helper functions
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (value: number) => {
    const currency = performanceData?.currency || 'EGP';
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(value);
  };

  // Generate chart data from API response
  const chartData = useMemo(() => {
    if (!performanceData) return { installs: [], revenue: [], uninstalls: [] };

    return {
      installs: performanceData.installsChart.map(item => ({
        date: formatDateLabel(item.date),
        installs: item.value,
      })),
      revenue: performanceData.revenueChart.map(item => ({
        date: formatDateLabel(item.date),
        revenue: item.value,
      })),
      uninstalls: performanceData.uninstallsChart.map(item => ({
        date: formatDateLabel(item.date),
        uninstalls: item.value,
      })),
    };
  }, [performanceData]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Manage your Vondera apps and integrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Apps"
          value={performanceData?.appsCount?.toString() || apps.length.toString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
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
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(performanceData?.totalRevenue || 0)}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <StatsCard
          title="Total Installs"
          value={(performanceData?.lifetimeInstalls || 0).toLocaleString()}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            href="/dashboard/reviews"
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-vondera-purple hover:bg-purple-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Review Requests</h3>
              <p className="text-sm text-gray-500">Track app submissions</p>
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

      {/* Performance Charts */}
      <div className="mb-8">
        {/* Unified Date Range Picker */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-600 font-normal">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
              />
              <label className="text-sm text-gray-600 font-normal">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={today.toISOString().split('T')[0]}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Revenue</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.revenue} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(chartData.revenue.reduce((sum, d) => sum + (d.revenue || 0), 0))}
              </span>
              <span className="text-sm text-gray-500">total</span>
            </div>
          </div>

          {/* Installs Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Installs</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.installs} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="installGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="installs" stroke="#8b5cf6" strokeWidth={2} fill="url(#installGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {chartData.installs.reduce((sum, d) => sum + (d.installs || 0), 0)}
              </span>
              <span className="text-sm text-gray-500">total</span>
            </div>
          </div>

          {/* Uninstalls Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Uninstalls</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.uninstalls} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uninstallGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="uninstalls" stroke="#ef4444" strokeWidth={2} fill="url(#uninstallGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">
                {chartData.uninstalls.reduce((sum, d) => sum + (d.uninstalls || 0), 0)}
              </span>
              <span className="text-sm text-gray-500">total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apps List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
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

