'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/lib/services';
import type { EndpointSettings } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EndpointsTabProps {
  appId: string;
  onUpdate: () => void;
}

export function EndpointsTab({ appId, onUpdate }: EndpointsTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<EndpointSettings>({
    install_endpoint: '',
    uninstall_endpoint: '',
    form_update_endpoint: '',
    hasPendingChanges: false,
  });
  const [originalSettings, setOriginalSettings] = useState<EndpointSettings>({
    install_endpoint: '',
    uninstall_endpoint: '',
    form_update_endpoint: '',
    hasPendingChanges: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getEndpointSettings(appId);
      if (data) {
        setSettings(data);
        setOriginalSettings(data);
      }
    } catch (error) {
      console.error('Failed to load endpoint settings:', error);
      setErrors({ load: 'Failed to load endpoint settings' });
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check if form has changes
  const hasChanges =
    settings.install_endpoint !== originalSettings.install_endpoint ||
    settings.uninstall_endpoint !== originalSettings.uninstall_endpoint ||
    settings.form_update_endpoint !== originalSettings.form_update_endpoint;

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is allowed
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (settings.install_endpoint && !validateUrl(settings.install_endpoint)) {
      newErrors.install_endpoint = 'Please enter a valid URL';
    }

    if (settings.uninstall_endpoint && !validateUrl(settings.uninstall_endpoint)) {
      newErrors.uninstall_endpoint = 'Please enter a valid URL';
    }

    if (settings.form_update_endpoint && !validateUrl(settings.form_update_endpoint)) {
      newErrors.form_update_endpoint = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      await settingsService.updateEndpointSettings(appId, {
        install_endpoint: settings.install_endpoint,
        uninstall_endpoint: settings.uninstall_endpoint,
        form_update_endpoint: settings.form_update_endpoint,
      });
      setSuccess(true);
      onUpdate();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">App Endpoints</h3>
      <p className="text-sm text-gray-600 mb-6">
        Configure OAuth and webhook endpoints for your app
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Install Endpoint */}
        <div>
          <Label htmlFor="install_endpoint">Install Endpoint</Label>
          <Input
            id="install_endpoint"
            type="url"
            value={settings.install_endpoint}
            onChange={(e) => setSettings({ ...settings, install_endpoint: e.target.value })}
            placeholder="https://your-app.com/webhook/install"
            className={errors.install_endpoint ? 'border-red-500' : ''}
          />
          {errors.install_endpoint && (
            <p className="text-sm text-red-600 mt-1">{errors.install_endpoint}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            This endpoint will be called when a merchant installs your app
          </p>
        </div>

        {/* Uninstall Endpoint */}
        <div>
          <Label htmlFor="uninstall_endpoint">Uninstall Endpoint</Label>
          <Input
            id="uninstall_endpoint"
            type="url"
            value={settings.uninstall_endpoint}
            onChange={(e) => setSettings({ ...settings, uninstall_endpoint: e.target.value })}
            placeholder="https://your-app.com/webhook/uninstall"
            className={errors.uninstall_endpoint ? 'border-red-500' : ''}
          />
          {errors.uninstall_endpoint && (
            <p className="text-sm text-red-600 mt-1">{errors.uninstall_endpoint}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            This endpoint will be called when a merchant uninstalls your app
          </p>
        </div>

        {/* Form Update Endpoint */}
        <div>
          <Label htmlFor="form_update_endpoint">Form Update Endpoint</Label>
          <Input
            id="form_update_endpoint"
            type="url"
            value={settings.form_update_endpoint}
            onChange={(e) => setSettings({ ...settings, form_update_endpoint: e.target.value })}
            placeholder="https://your-app.com/webhook/setting"
            className={errors.form_update_endpoint ? 'border-red-500' : ''}
          />
          {errors.form_update_endpoint && (
            <p className="text-sm text-red-600 mt-1">{errors.form_update_endpoint}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            This endpoint will be called when a merchant updates their app settings
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Endpoint Security</h4>
              <p className="text-sm text-blue-700">
                Make sure your endpoints are secured with HTTPS and validate incoming requests
                to prevent unauthorized access.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">Endpoints saved successfully</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={saving || !hasChanges}
            className={hasChanges ? 'bg-vondera-purple hover:bg-vondera-purple-dark ring-2 ring-vondera-purple ring-offset-2' : ''}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Endpoints'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
