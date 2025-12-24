'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { App } from '@/lib/types/api.types';

interface AnalyticsTabProps {
  app: App;
}

// Generate random install data for a date range
function generateInstallData(startDate: Date, endDate: Date): { date: string; installs: number; displayDate: string }[] {
  const data: { date: string; installs: number; displayDate: string }[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      displayDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      installs: Math.floor(Math.random() * 150) + 20,
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

// Generate random revenue data for a date range
function generateRevenueData(startDate: Date, endDate: Date): { date: string; revenue: number; displayDate: string }[] {
  const data: { date: string; revenue: number; displayDate: string }[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      displayDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 800) + 100,
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

// Format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date from timestamp
function formatTimestamp(timestamp: { _seconds: number; _nanoseconds: number } | undefined): string {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
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
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'gray';
  subtitle?: string;
}) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    gray: 'bg-gray-100 text-gray-600',
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

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PUBLISHED: {
    label: 'Published',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
  },
  PENDING: {
    label: 'In Review',
    color: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
};

// Info Row Component
function InfoRow({ label, value, icon, isStatus = false }: { label: string; value: string; icon?: React.ReactNode; isStatus?: boolean }) {
  let content = <span className="text-sm font-medium text-gray-900">{value}</span>;

  if (isStatus) {
    const status = statusConfig[value] || statusConfig.DRAFT;
    content = (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
        {status.label}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-gray-500">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-sm">{label}</span>
      </div>
      {content}
    </div>
  );
}

export function AnalyticsTab({ app }: AnalyticsTabProps) {
  // Default date range: last 30 days
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

  // Generate data based on date range
  const installData = useMemo(() => {
    return generateInstallData(new Date(startDate), new Date(endDate));
  }, [startDate, endDate]);

  const revenueData = useMemo(() => {
    return generateRevenueData(new Date(startDate), new Date(endDate));
  }, [startDate, endDate]);

  // Calculate totals
  const totalInstalls = installData.reduce((sum, d) => sum + d.installs, 0);
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgInstallsPerDay = Math.round(totalInstalls / installData.length) || 0;
  const avgRevenuePerDay = Math.round(totalRevenue / revenueData.length) || 0;

  // Get app data
  const supportedCountries = (app as unknown as { supported_countries?: string[] }).supported_countries || [];
  const webhookEvents = app.webhook_events || [];
  const scopes = app.scopes || [];
  const createdAt = app.createdAt;
  const updatedAt = app.updatedAt;

  // Mock data for ratings
  const ratings = {
    average: 4.6,
    total: 1247,
    distribution: [
      { stars: 5, count: 892, percentage: 72 },
      { stars: 4, count: 224, percentage: 18 },
      { stars: 3, count: 75, percentage: 6 },
      { stars: 2, count: 31, percentage: 2 },
      { stars: 1, count: 25, percentage: 2 },
    ]
  };

  // Mock recent activities
  const recentActivities = [
    { type: 'install', count: 45, time: '2 hours ago', icon: '📥' },
    { type: 'uninstall', count: 3, time: '4 hours ago', icon: '📤' },
    { type: 'review', count: 12, time: '6 hours ago', icon: '⭐' },
    { type: 'update', count: 28, time: '1 day ago', icon: '🔄' },
  ];

  // Mock crash data
  const crashData = {
    total: 8,
    affectedUsers: 5,
    crashFreeRate: 99.8,
  };

  return (
    <div className="space-y-8">
      {/* Header with Date Range Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <p className="text-sm text-gray-500">Track your app performance and revenue</p>
        </div>
        
        {/* Date Range Picker */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2.5">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vondera-purple focus:border-vondera-purple bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={today.toISOString().split('T')[0]}
              className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-vondera-purple focus:border-vondera-purple bg-white"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <AnalyticsStat
          title="Total Installs"
          value={totalInstalls.toLocaleString()}
          subtitle={`${app.installsCount || 0} lifetime`}
          color="blue"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Avg. Daily Installs"
          value={avgInstallsPerDay.toLocaleString()}
          color="purple"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          color="green"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <AnalyticsStat
          title="Avg. Daily Revenue"
          value={formatCurrency(avgRevenuePerDay)}
          color="amber"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Installs Chart */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Installations</h3>
            <p className="text-xs text-gray-500">Daily installation count</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={installData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="installGradient" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="installs"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#installGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-50 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Revenue</h3>
            <p className="text-xs text-gray-500">Daily revenue generated</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip valueLabel="Revenue" valueFormatter={formatCurrency} />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* App Details Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* App Information */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">App Information</h3>
          <div className="space-y-0">
            <InfoRow 
              label="Created" 
              value={formatTimestamp(createdAt)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <InfoRow 
              label="Last Updated" 
              value={formatTimestamp(updatedAt)}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            />
            <InfoRow 
              label="Version" 
              value={app.version}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
            />
            <InfoRow 
              label="Category" 
              value={app.category?.replace(/-/g, ' ') || 'N/A'}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <InfoRow 
              label="App Type" 
              value={app.app_type}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* App Configuration */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Configuration</h3>
          <div className="space-y-0">
            <InfoRow 
              label="Supported Countries" 
              value={`${supportedCountries.length} countries`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <InfoRow 
              label="Webhook Events" 
              value={`${webhookEvents.length} events`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />
            <InfoRow 
              label="Permissions" 
              value={`${scopes.length} scopes`}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <InfoRow 
              label="Status" 
              value={app.status}
              isStatus={true}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <InfoRow 
              label="Lifetime Installs" 
              value={(app.installsCount || 0).toLocaleString()}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Supported Countries */}
      {supportedCountries.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Supported Countries</h3>
          <div className="flex flex-wrap gap-2">
            {supportedCountries.map((country: string) => (
              <span 
                key={country} 
                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ratings & Quality Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Ratings */}
        <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">User Ratings</h3>
            <button className="text-xs text-vondera-purple hover:text-vondera-purple-dark font-medium">
              View all reviews →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <div className="text-5xl font-bold text-gray-900 mb-2">{ratings.average}</div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.floor(ratings.average) ? 'text-amber-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-500">{ratings.total.toLocaleString()} ratings</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratings.distribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-8">{rating.stars} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* App Quality */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">App Quality</h3>
          <div className="space-y-4">
            {/* Crash-free rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Crash-free rate</span>
                <span className="text-lg font-bold text-green-600">{crashData.crashFreeRate}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: `${crashData.crashFreeRate}%` }}
                />
              </div>
            </div>

            {/* Crash Stats */}
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Crashes</p>
                    <p className="text-sm font-semibold text-gray-900">{crashData.total}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Affected Users</p>
                    <p className="text-sm font-semibold text-gray-900">{crashData.affectedUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full text-xs text-vondera-purple hover:text-vondera-purple-dark font-medium py-2 border-t border-gray-200">
              View crash reports →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          <span className="text-xs text-gray-500">Last 24 hours</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                  <p className="text-xl font-bold text-gray-900">{activity.count}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage & Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Calls */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">API Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Total API Calls</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">12.4K</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Success Rate</p>
                  <p className="text-xs text-gray-500">2xx responses</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">99.2%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Avg Response Time</p>
                  <p className="text-xs text-gray-500">P95 latency</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">142ms</span>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Webhook Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Events Sent</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900">3.2K</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Delivery Rate</p>
                  <p className="text-xs text-gray-500">Successful deliveries</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">98.7%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Failed Events</p>
                  <p className="text-xs text-gray-500">Needs attention</p>
                </div>
              </div>
              <span className="text-lg font-bold text-red-600">42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Info */}
      <div className="text-center text-xs text-gray-400">
        Showing data from {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({installData.length} days)
      </div>
    </div>
  );
}
