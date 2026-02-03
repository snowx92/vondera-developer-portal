'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { settingsService } from '@/lib/services';
import type { ListingSettings } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface ListingTabProps {
  appId: string;
  onUpdate: () => void;
}

export function ListingTab({ appId, onUpdate }: ListingTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ListingSettings>({
    name: '',
    description: '',
    short_description: '',
    category: '',
    icon: '',
    images: [],
  });
  const [originalSettings, setOriginalSettings] = useState<ListingSettings>({
    name: '',
    description: '',
    short_description: '',
    category: '',
    icon: '',
    images: [],
  });
  const [iconPreview, setIconPreview] = useState<string>('');
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [appId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const settingsData = await settingsService.getListingSettings(appId);

      if (settingsData) {
        setSettings(settingsData);
        setOriginalSettings(settingsData);
        if (settingsData.icon) {
          setIconPreview(settingsData.icon);
        }
        if (settingsData.images && settingsData.images.length > 0) {
          setImagesPreviews(settingsData.images);
        }
      }
    } catch (error) {
      console.error('Failed to load listing settings:', error);
      setErrors({ load: 'Failed to load listing settings' });
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges =
    settings.description !== originalSettings.description ||
    settings.short_description !== originalSettings.short_description ||
    settings.icon !== originalSettings.icon ||
    JSON.stringify(settings.images) !== JSON.stringify(originalSettings.images);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, icon: 'Please upload an image file' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, icon: 'Icon must be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSettings({ ...settings, icon: base64String });
      setIconPreview(base64String);
      setErrors({ ...errors, icon: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    const newPreviews: string[] = [];
    let hasError = false;

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, images: 'All files must be images' });
        hasError = true;
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, images: 'Each image must be less than 2MB' });
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newImages.push(base64String);
        newPreviews.push(base64String);

        if (newImages.length === files.length) {
          setSettings({ ...settings, images: [...settings.images, ...newImages] });
          setImagesPreviews([...imagesPreviews, ...newPreviews]);
          setErrors({ ...errors, images: '' });
        }
      };
      reader.readAsDataURL(file);
    });

    if (hasError) {
      return;
    }
  };

  const removeImage = (index: number) => {
    const newImages = settings.images.filter((_, i) => i !== index);
    const newPreviews = imagesPreviews.filter((_, i) => i !== index);
    setSettings({ ...settings, images: newImages });
    setImagesPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate short_description
    const newErrors: Record<string, string> = {};

    if (!settings.short_description || settings.short_description.trim().length === 0) {
      newErrors.short_description = 'Short description is required';
    } else if (settings.short_description.trim().length < 10) {
      newErrors.short_description = 'Short description must be at least 10 characters';
    } else if (settings.short_description.length > 80) {
      newErrors.short_description = 'Short description must not exceed 80 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      setErrors({});
      // Only send description, short_description, icon, and images - name and category are handled in General Settings
      await settingsService.updateListingSettings(appId, {
        description: settings.description,
        short_description: settings.short_description,
        icon: settings.icon,
        images: settings.images,
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Listing</h3>
      <p className="text-sm text-gray-600 mb-6">
        Manage how your app appears in the Vondera App Store
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Note</h4>
              <p className="text-sm text-blue-700">
                App name and category are managed in the General Settings tab. Here you can update the app description, icon, and screenshots.
              </p>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <Label htmlFor="short_description">
            Short Description <span className="text-red-500">*</span>
          </Label>
          <Input
            id="short_description"
            type="text"
            value={settings.short_description}
            onChange={(e) => {
              const value = e.target.value.slice(0, 80); // Limit to 80 chars
              setSettings({ ...settings, short_description: value });
              // Clear error when user types
              if (errors.short_description) {
                setErrors({ ...errors, short_description: '' });
              }
            }}
            placeholder="Brief one-liner about your app (10-80 characters)"
            maxLength={80}
            className={errors.short_description ? 'border-red-500' : ''}
          />
          <p className={`text-sm mt-1 ${
            settings.short_description.length < 10
              ? 'text-orange-600'
              : settings.short_description.length > 80
              ? 'text-red-600'
              : 'text-gray-500'
          }`}>
            {settings.short_description.length}/80 characters (minimum 10) - Shown in app cards and search results
          </p>
          {errors.short_description && (
            <p className="text-sm text-red-600 mt-1">{errors.short_description}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Full Description</Label>
          <div className="mt-2">
            <RichTextEditor
              value={settings.description}
              onChange={(value) => setSettings({ ...settings, description: value })}
              placeholder="Describe what your app does in detail..."
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Detailed description shown on the app&apos;s store page. You can use rich text formatting.
          </p>
        </div>

        {/* Installation Instructions */}
        <div>
          <Label htmlFor="instructions">Installation & Setup Instructions</Label>
          <div className="mt-2">
            <RichTextEditor
              value={settings.instructions || ''}
              onChange={(value) => setSettings({ ...settings, instructions: value })}
              placeholder="Provide step-by-step instructions on how to install and configure your app..."
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Help users get started with your app. Include setup steps, configuration details, and any prerequisites.
          </p>
        </div>

        {/* App Icon */}
        <div>
          <Label htmlFor="icon">App Icon</Label>
          <div className="mt-2">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {iconPreview ? (
                  <Image
                    src={iconPreview}
                    alt="App icon"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="icon-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Icon
                </label>
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, or GIF. Max 2MB. Recommended: 512x512px
                </p>
              </div>
            </div>
          </div>
          {errors.icon && (
            <p className="text-sm text-red-600 mt-2">{errors.icon}</p>
          )}
        </div>

        {/* App Images/Screenshots */}
        <div>
          <Label htmlFor="images">App Screenshots</Label>
          <div className="mt-2">
            <label
              htmlFor="images-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Add Screenshots
            </label>
            <input
              id="images-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload multiple images. Max 2MB per image.
            </p>
          </div>

          {/* Images Preview Grid */}
          {imagesPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Screenshot ${index + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.images && (
            <p className="text-sm text-red-600 mt-2">{errors.images}</p>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">Settings saved successfully</p>
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
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
