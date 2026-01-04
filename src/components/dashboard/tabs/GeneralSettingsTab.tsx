'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { settingsService, appsService } from '@/lib/services';
import type { GeneralSettings, AppCategory, App } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GeneralSettingsTabProps {
  appId: string;
  settings: GeneralSettings | null;
  app?: App | null;
  onUpdate: () => void;
}

export function GeneralSettingsTab({ appId, settings, app, onUpdate }: GeneralSettingsTabProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const [formData, setFormData] = useState({
    name: settings?.name || '',
    category: settings?.category || '',
    app_url: settings?.app_url || '',
    slug: settings?.slug || '',
  });
  const [originalData, setOriginalData] = useState({
    name: settings?.name || '',
    category: settings?.category || '',
    app_url: settings?.app_url || '',
    slug: settings?.slug || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (settings) {
      const data = {
        name: settings.name,
        category: settings.category,
        app_url: settings.app_url,
        slug: settings.slug,
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [settings]);

  // Check if form has changes
  const hasChanges =
    formData.name !== originalData.name ||
    formData.category !== originalData.category ||
    formData.app_url !== originalData.app_url ||
    formData.slug !== originalData.slug;

  const loadCategories = async () => {
    try {
      const data = await appsService.getAppCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validate app_url
    const newErrors: Record<string, string> = {};

    if (!formData.app_url.trim()) {
      newErrors.app_url = 'App URL is required';
    } else {
      try {
        new URL(formData.app_url);
      } catch {
        newErrors.app_url = 'Please enter a valid URL';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await settingsService.updateGeneralSettings(appId, formData);
      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to update settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async () => {
    if (deleteConfirmText !== formData.slug) {
      return;
    }

    try {
      setDeleting(true);
      await appsService.deleteApp(appId);
      // Redirect to apps list after successful deletion
      router.push('/dashboard/apps');
    } catch (error) {
      setErrors({
        delete: error instanceof Error ? error.message : 'Failed to delete app',
      });
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
        <p className="text-sm text-gray-600 mb-6">
          Basic information about your app
        </p>
      </div>

      {/* App Name */}
      <div>
        <Label htmlFor="name">App Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My Awesome App"
        />
        <p className="text-sm text-gray-500 mt-1">
          The display name for your app
        </p>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {formData.category && (
          <p className="text-sm text-gray-500 mt-1">
            {categories.find((c) => c.key === formData.category)?.description}
          </p>
        )}
      </div>

      {/* App URL */}
      <div>
        <Label htmlFor="app_url">App URL *</Label>
        <Input
          id="app_url"
          type="url"
          value={formData.app_url}
          onChange={(e) => setFormData({ ...formData, app_url: e.target.value })}
          placeholder="https://myapp.example.com"
        />
        <p className="text-sm text-gray-500 mt-1">
          The URL where your app is hosted
        </p>
        {errors.app_url && (
          <p className="text-sm text-red-600 mt-1">{errors.app_url}</p>
        )}
      </div>

      {/* App Slug */}
      <div>
        <Label htmlFor="slug">App Slug *</Label>
        <Input
          id="slug"
          type="text"
          value={formData.slug}
          onChange={(e) => {
            // Convert to lowercase and replace spaces with hyphens
            const slug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            setFormData({ ...formData, slug });
          }}
          placeholder="my-awesome-app"
        />
        <p className="text-sm text-gray-500 mt-1">
          URL-friendly identifier for your app (lowercase, hyphens only)
        </p>
        {errors.slug && (
          <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
        )}
      </div>

      {/* API Credentials - Highlighted Section */}
      {app?.client_id && app?.client_secret && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gradient-to-br from-vondera-purple/5 to-vondera-purple-dark/5 border-2 border-vondera-purple/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h4 className="font-semibold text-gray-900">API Credentials</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Use these credentials to authenticate your app with the Vondera API. Keep them secure and never share them publicly.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">App ID</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-white border-2 border-vondera-purple/30 rounded-lg text-sm font-mono text-gray-900 break-all">
                    {app.id}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(app.id);
                    }}
                    className="px-3 py-3 bg-white border-2 border-vondera-purple/30 text-vondera-purple hover:bg-vondera-purple hover:text-white rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Client ID</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-white border-2 border-vondera-purple/30 rounded-lg text-sm font-mono text-gray-900 break-all">
                    {app.client_id}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(app.client_id);
                      // Could add a toast notification here
                    }}
                    className="px-3 py-3 bg-white border-2 border-vondera-purple/30 text-vondera-purple hover:bg-vondera-purple hover:text-white rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Client Secret</Label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-white border-2 border-vondera-purple/30 rounded-lg text-sm font-mono text-gray-900 break-all">
                    {app.client_secret}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(app.client_secret);
                      // Could add a toast notification here
                    }}
                    className="px-3 py-3 bg-white border-2 border-vondera-purple/30 text-vondera-purple hover:bg-vondera-purple hover:text-white rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-800">
                <strong>Security Warning:</strong> Keep these credentials secret. Do not commit them to version control or expose them in client-side code.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Read-only fields */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">App Details</h4>
        <div className="space-y-4">
          <div>
            <Label>Version</Label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              {settings?.version || '-'}
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 capitalize">
              {settings?.status?.toLowerCase() || '-'}
            </div>
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
            <p className="text-sm text-green-700">Settings updated successfully!</p>
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
          disabled={loading || !hasChanges}
          className={hasChanges ? 'bg-vondera-purple hover:bg-vondera-purple-dark ring-2 ring-vondera-purple ring-offset-2' : ''}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-gray-200 pt-6 mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your app, there is no going back. This will permanently remove your app from the store and revoke all access tokens.
          </p>
          <Button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete App
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete App</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                This will permanently delete <span className="font-semibold">{formData.name}</span> and remove it from the Vondera App Store. All access tokens will be revoked.
              </p>

              <div>
                <Label htmlFor="delete-confirm">Type <span className="font-mono font-semibold">{formData.slug}</span> to confirm</Label>
                <Input
                  id="delete-confirm"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={formData.slug}
                  className="mt-2"
                />
              </div>

              {errors.delete && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{errors.delete}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDeleteConfirmText('');
                    setErrors({});
                  }}
                  disabled={deleting}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteApp}
                  disabled={deleteConfirmText !== formData.slug || deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete App'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
