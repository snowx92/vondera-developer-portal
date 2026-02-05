'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/lib/services';
import type { WebhookSettings, WebhookEvent } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebhooksTabProps {
  appId: string;
  onUpdate: () => void;
}

const AVAILABLE_EVENTS = [
  { value: 'orders.created', label: 'Order Created' },
  { value: 'orders.updated', label: 'Order Updated' },
  { value: 'orders.deleted', label: 'Order Deleted' },
  { value: 'products.created', label: 'Product Created' },
  { value: 'products.updated', label: 'Product Updated' },
  { value: 'products.deleted', label: 'Product Deleted' },
  { value: 'customers.created', label: 'Customer Created' },
  { value: 'customers.updated', label: 'Customer Updated' },
];

export function WebhooksTab({ appId, onUpdate }: WebhooksTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WebhookSettings>({
    webhook_events: [],
  });
  const [originalSettings, setOriginalSettings] = useState<WebhookSettings>({
    webhook_events: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getWebhookSettings(appId);
      if (data) {
        setSettings(data);
        setOriginalSettings(data);
      }
    } catch (error) {
      console.error('Failed to load webhook settings:', error);
      setErrors({ load: 'Failed to load webhook settings' });
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check if form has changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const addWebhook = () => {
    setSettings({
      ...settings,
      webhook_events: [...settings.webhook_events, { event: '', url: '', reason: '' }],
    });
  };

  const removeWebhook = (index: number) => {
    setSettings({
      ...settings,
      webhook_events: settings.webhook_events.filter((_, i) => i !== index),
    });
  };

  const updateWebhook = (index: number, field: keyof WebhookEvent, value: string) => {
    const updatedWebhooks = [...settings.webhook_events];
    updatedWebhooks[index] = { ...updatedWebhooks[index], [field]: value };
    setSettings({ ...settings, webhook_events: updatedWebhooks });
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
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

    settings.webhook_events.forEach((webhook, index) => {
      if (!webhook.event) {
        newErrors[`event_${index}`] = 'Event is required';
      }
      if (!webhook.url) {
        newErrors[`url_${index}`] = 'URL is required';
      } else if (!validateUrl(webhook.url)) {
        newErrors[`url_${index}`] = 'Please enter a valid URL';
      }
      if (!webhook.reason || webhook.reason.trim().length === 0) {
        newErrors[`reason_${index}`] = 'Reason is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      await settingsService.updateWebhookSettings(appId, settings);
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
      <p className="text-sm text-gray-600 mb-6">
        Subscribe to events and receive real-time notifications
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Webhooks List */}
        <div className="space-y-4">
          {settings.webhook_events.map((webhook, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  {/* Event Selection */}
                  <div>
                    <Label htmlFor={`event_${index}`}>Event</Label>
                    <select
                      id={`event_${index}`}
                      value={webhook.event}
                      onChange={(e) => updateWebhook(index, 'event', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent ${
                        errors[`event_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select an event</option>
                      {AVAILABLE_EVENTS.map((event) => (
                        <option key={event.value} value={event.value}>
                          {event.label}
                        </option>
                      ))}
                    </select>
                    {errors[`event_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`event_${index}`]}</p>
                    )}
                  </div>

                  {/* Webhook URL */}
                  <div>
                    <Label htmlFor={`url_${index}`}>Webhook URL</Label>
                    <Input
                      id={`url_${index}`}
                      type="url"
                      value={webhook.url}
                      onChange={(e) => updateWebhook(index, 'url', e.target.value)}
                      placeholder="https://your-app.com/webhook"
                      className={errors[`url_${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`url_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`url_${index}`]}</p>
                    )}
                  </div>

                  {/* Reason */}
                  <div>
                    <Label htmlFor={`reason_${index}`}>
                      Reason (Why do you need this webhook?) <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id={`reason_${index}`}
                      value={webhook.reason}
                      onChange={(e) => updateWebhook(index, 'reason', e.target.value)}
                      placeholder="Explain why your app needs to subscribe to this event..."
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent resize-none ${
                        errors[`reason_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`reason_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`reason_${index}`]}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      This helps reviewers understand your app&apos;s functionality
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeWebhook(index)}
                  className="mt-8 text-red-600 hover:text-red-700 p-2"
                  title="Remove webhook"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Add Webhook Button */}
          <button
            type="button"
            onClick={addWebhook}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-vondera-purple hover:text-vondera-purple transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Webhook
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Webhook Payload</h4>
              <p className="text-sm text-blue-700">
                Webhooks will be sent as POST requests with a JSON payload containing the event data.
                Make sure your endpoint can handle these requests.
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
              <p className="text-sm text-green-700">Webhooks saved successfully</p>
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
              'Save Webhooks'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
