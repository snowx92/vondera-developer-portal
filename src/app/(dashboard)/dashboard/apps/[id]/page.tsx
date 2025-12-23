'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { appsService, settingsService } from '@/lib/services';
import type { App, GeneralSettings } from '@/lib/types/api.types';
import { AppSettingsTabs } from '@/components/dashboard/AppSettingsTabs';

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.id as string;

  const [app, setApp] = useState<App | null>(null);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [appData, settingsData] = await Promise.all([
        appsService.getAppById(appId),
        settingsService.getGeneralSettings(appId),
      ]);

      setApp(appData);
      setGeneralSettings(settingsData);
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AppSettingsTabs app={app} generalSettings={generalSettings} onUpdate={loadAppData} />
    </div>
  );
}
