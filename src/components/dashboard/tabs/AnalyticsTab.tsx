'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { App, PerformanceOverview } from '@/lib/types/api.types';
import { appsService } from '@/lib/services';

interface AnalyticsTabProps {
  app: App;
}

// Format currency
function formatCurrency(value: number, currency: string = 'EGP'): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Custom tooltip for charts
function CustomTooltip({
  active,
  payload,
  label,
  valueFormatter = (v: number) => v.toLocaleString(),
  valueLabel = 'Value'
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  valueFormatter?: (value: number) => string;
  valueLabel?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        <p className="text-lg font-bold text-vondera-purple">
          {valueFormatter(payload[0].value)}
        </p>
        <p className="text-xs text-gray-500">{valueLabel}</p>
      </div>
    );
  }
  return null;
}

// Stats Card for Analytics
function AnalyticsStat({
  title,
  value,
  icon,
  color = 'purple',
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'gray' | 'red';
  subtitle?: string;
}) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function AnalyticsTab({ app }: AnalyticsTabProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPerformanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appsService.getPerformanceOverview(app.id);
      if (data) {
        setPerformanceData(data);
      } else {
        setError('No analytics data available');
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [app.id]);

  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  if (error || !performanceData) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 mb-4">{error || 'Failed to load analytics'}</p>
        <button
          onClick={loadPerformanceData}
          className="text-sm font-medium text-vondera-purple hover:text-vondera-purple-dark"
        >
          Try again
        </button>
      </div>
    );
  }

  // Prepare chart data with formatted dates
  const installsChartData = performanceData.installsChart.map(item => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  const revenueChartData = performanceData.revenueChart.map(item => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  const uninstallsChartData = performanceData.uninstallsChart.map(item => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <p className="text-sm text-gray-500">
            {formatDate(performanceData.from)} to {formatDate(performanceData.to)}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <AnalyticsStat
          title="Total Installs"
          value={performanceData.totalInstalls.toLocaleString()}
          subtitle={`${performanceData.lifetimeInstalls} lifetime`}
          color="blue"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Avg. Daily Installs"
          value={performanceData.avgDailyInstalls.toFixed(1)}
          color="purple"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Total Revenue"
          value={formatCurrency(performanceData.totalRevenue, performanceData.currency)}
          color="green"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Avg. Daily Revenue"
          value={formatCurrency(performanceData.avgDailyRevenue, performanceData.currency)}
          color="amber"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Total Uninstalls"
          value={performanceData.totalUninstalls.toLocaleString()}
          color="red"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          }
        />
      </div>

      {/* Charts Row - 3 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-500">Daily revenue generated</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip valueLabel="Revenue" valueFormatter={(v) => formatCurrency(v, performanceData.currency)} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-green-600">{formatCurrency(performanceData.totalRevenue, performanceData.currency)}</p>
            <p className="text-xs text-gray-500">Total revenue</p>
          </div>
        </div>

        {/* Installs Chart */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Installations</h3>
            <p className="text-xs text-gray-500">Daily installation count</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={installsChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="installGradient-app" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip valueLabel="Installs" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#installGradient-app)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-gray-900">{performanceData.totalInstalls.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total installs</p>
          </div>
        </div>

        {/* Uninstalls Chart */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Uninstalls</h3>
            <p className="text-xs text-gray-500">Daily uninstallation count</p>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={uninstallsChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="uninstallGradient-app" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip valueLabel="Uninstalls" />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#uninstallGradient-app)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3">
            <p className="text-lg font-bold text-red-600">{performanceData.totalUninstalls.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total uninstalls</p>
          </div>
        </div>
      </div>

      {/* Date Range Info */}
      <div className="text-center text-xs text-gray-400">
        Showing data from {formatDate(performanceData.from)} to {formatDate(performanceData.to)} • Currency: {performanceData.currency}
      </div>
    </div>
  );
}
