'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { appsService, settingsService, reviewsService } from '@/lib/services';
import type { App, GeneralSettings, AppStepsResponse, ReviewRequest } from '@/lib/types/api.types';
import { AnalyticsTab } from '@/components/dashboard/tabs/AnalyticsTab';
import { GeneralSettingsTab } from '@/components/dashboard/tabs/GeneralSettingsTab';
import { ListingTab } from '@/components/dashboard/tabs/ListingTab';
import { EndpointsTab } from '@/components/dashboard/tabs/EndpointsTab';
import { ScopesTab } from '@/components/dashboard/tabs/ScopesTab';
import { WebhooksTab } from '@/components/dashboard/tabs/WebhooksTab';
import { PricingTab } from '@/components/dashboard/tabs/PricingTab';
import { CountriesTab } from '@/components/dashboard/tabs/CountriesTab';
import { SetupFormTab } from '@/components/dashboard/tabs/SetupFormTab';
import { ReviewsTab } from '@/components/dashboard/tabs/ReviewsTab';
import { AppStepsProgress } from '@/components/dashboard/AppStepsProgress';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  APPROVED: { label: 'Approved', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
  PENDING: { label: 'In Review', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const appTypeConfig: Record<string, { label: string; color: string }> = {
  FREE: { label: 'Free', color: 'bg-blue-100 text-blue-700' },
  PREMIUM: { label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Paid', color: 'bg-amber-100 text-amber-700' },
};

// Sidebar menu items - Analytics first, then settings
const menuItems = [
  {
    id: 'analytics',
    label: 'Analytics', 
    section: 'overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'general',
    label: 'General', 
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'listing',
    label: 'Store listing', 
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    id: 'endpoints',
    label: 'Endpoints', 
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  {
    id: 'scopes',
    label: 'Permissions', 
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    id: 'webhooks',
    label: 'Webhooks', 
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  {
    id: 'pricing',
    label: 'Pricing',
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'countries',
    label: 'Countries',
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'setup',
    label: 'Setup form',
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: 'reviews',
    label: 'Reviews & Publish',
    section: 'settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
];

// Format install count
function formatInstalls(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
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

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [appSteps, setAppSteps] = useState<AppStepsResponse | null>(null);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const loadAppData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [appData, settingsData, stepsData, requestsData] = await Promise.all([
        appsService.getAppById(appId),
        settingsService.getGeneralSettings(appId),
        appsService.getAppSteps(appId),
        reviewsService.getReviewRequests(appId),
      ]);

      setApp(appData);
      setGeneralSettings(settingsData);
      setAppSteps(stepsData);
      setReviewRequests(requestsData || []);

      // Set initial tab based on app status
      if (appData?.status === 'PUBLISHED' || appData?.status === 'APPROVED') {
        setActiveTab('analytics');
      } else {
        setActiveTab('general');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app');
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 mb-4">{error || 'App not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[app.status] || statusConfig.DRAFT;
  const appType = appTypeConfig[app.app_type] || appTypeConfig.FREE;
  const isPublished = app.status === 'PUBLISHED' || app.status === 'APPROVED';
  const hasPendingRequest = reviewRequests.some(r => r.status === 'PENDING');
  const isEditingBlocked = hasPendingRequest && activeTab !== 'reviews' && activeTab !== 'analytics';

  // Static revenue data for demo
  const totalRevenue = app.totalRevenue || 24580;
  const currentBalance = 8320;

  const handleStepClick = (stepId: string) => {
    setActiveTab(stepId === 'setup-form' ? 'setup' : stepId);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* App Header in Sidebar */}
          <div className="p-4 border-b border-gray-200">
          <Link
            href="/dashboard/apps"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to apps
          </Link>
          <div className="flex items-center gap-3">
            {app.icon ? (
              <Image
                src={app.icon}
                alt={app.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-vondera-purple to-vondera-purple-dark rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-gray-900 truncate">{app.name}</h1>
              <p className="text-xs text-gray-500">v{generalSettings?.version || app.version}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${appType.color}`}>
              {appType.label}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Installs</span>
            <span className="text-sm font-semibold text-gray-900">{formatInstalls(app.installsCount || 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Revenue</span>
            <span className="text-sm font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Balance</span>
            <span className="text-sm font-semibold text-gray-900">{formatCurrency(currentBalance)}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {/* Overview Section - Only show for published apps */}
          {isPublished && (
            <>
              <div className="px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</p>
              </div>
              {menuItems.filter(item => item.section === 'overview').map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-vondera-purple/10 text-vondera-purple border-r-2 border-vondera-purple'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-vondera-purple' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </>
          )}

          {/* Settings Section */}
          <div className={`px-3 py-2 ${isPublished ? 'mt-4' : ''}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {isPublished ? 'Settings' : 'Setup Steps'}
            </p>
          </div>
          {menuItems.filter(item => item.section === 'settings').map((item) => {
            // Find step completion status
            const stepKey = item.id === 'setup' ? 'setup-form' : item.id;
            const stepData = appSteps?.steps.find(s => s.step === stepKey);
            const categorySteps = appSteps?.steps.filter(s => s.step === stepKey) || [];
            const isStepCompleted = categorySteps.length > 0 && categorySteps.every(s => s.completed);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-vondera-purple/10 text-vondera-purple border-r-2 border-vondera-purple'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={activeTab === item.id ? 'text-vondera-purple' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {!isPublished && isStepCompleted && (
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Progress Bar - Only show for non-published apps */}
          {!isPublished && appSteps && (
            <AppStepsProgress steps={appSteps} onStepClick={handleStepClick} />
          )}

          <div className="flex-1 overflow-y-auto p-6">
            {/* Content Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
              {activeTab === 'analytics' && (
                <AnalyticsTab app={app} />
              )}
              {activeTab === 'general' && (
                <GeneralSettingsTab appId={app.id} settings={generalSettings} onUpdate={loadAppData} />
              )}
              {activeTab === 'listing' && (
                <ListingTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'endpoints' && (
                <EndpointsTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'scopes' && (
                <ScopesTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'webhooks' && (
                <WebhooksTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'pricing' && (
                <PricingTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'countries' && (
                <CountriesTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'setup' && (
                <SetupFormTab appId={app.id} onUpdate={loadAppData} />
              )}
              {activeTab === 'reviews' && (
                <ReviewsTab appId={app.id} app={app} appSteps={appSteps} onUpdate={loadAppData} />
              )}

              {/* Blur Overlay for Pending Review */}
              {isEditingBlocked && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/80 rounded-xl flex items-center justify-center z-10">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 max-w-md mx-4 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      App Under Review
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your app is currently being reviewed. You cannot make changes until the review is complete. Please check the Reviews & Publish tab for updates.
                    </p>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-vondera-purple text-white rounded-lg hover:bg-vondera-purple-dark transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Go to Reviews
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
