'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { appsService } from '@/lib/services';
import type { App } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeveloperProfile {
  image: string;
  name: string;
  email: string;
  phone: string;
  banner: string;
  featuredAppId: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile>({
    image: '',
    name: '',
    email: '',
    phone: '',
    banner: '',
    featuredAppId: '',
  });
  const [originalProfile, setOriginalProfile] = useState<DeveloperProfile>({
    image: '',
    name: '',
    email: '',
    phone: '',
    banner: '',
    featuredAppId: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load apps for featured app dropdown
      const appsData = await appsService.getApps();
      setApps(appsData);

      // TODO: Load developer profile from API when available
      // For now, load from localStorage as placeholder
      const savedProfile = localStorage.getItem('developer_profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setOriginalProfile(parsedProfile);
        if (parsedProfile.image) setImagePreview(parsedProfile.image);
        if (parsedProfile.banner) setBannerPreview(parsedProfile.banner);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setErrors({ load: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    profile.image !== originalProfile.image ||
    profile.name !== originalProfile.name ||
    profile.email !== originalProfile.email ||
    profile.phone !== originalProfile.phone ||
    profile.banner !== originalProfile.banner ||
    profile.featuredAppId !== originalProfile.featuredAppId;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, [type]: 'Image size must be less than 2MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, [type]: 'Please upload a valid image file' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'image') {
          setImagePreview(result);
          setProfile({ ...profile, image: result });
        } else {
          setBannerPreview(result);
          setProfile({ ...profile, banner: result });
        }
        setErrors({ ...errors, [type]: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!profile.name.trim()) newErrors.name = 'Developer name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // TODO: Save to API when available
      // For now, save to localStorage
      localStorage.setItem('developer_profile', JSON.stringify(profile));
      setOriginalProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    try {
      setDeleting(true);
      // TODO: Call API to delete developer account and all apps
      // This will also sign out the user
      localStorage.removeItem('auth_token');
      localStorage.removeItem('developer_profile');
      router.push('/login');
    } catch (error) {
      setErrors({
        delete: error instanceof Error ? error.message : 'Failed to delete account',
      });
      setDeleting(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Developer Profile</h1>
        <p className="text-gray-600">Manage your public developer profile settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Developer Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h2>
          <div className="flex items-start gap-6">
            <div className="relative">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Developer profile"
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="image">Upload Profile Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'image')}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Recommended: Square image, at least 512x512px. Max size 2MB.
              </p>
              {errors.image && (
                <p className="text-sm text-red-600 mt-1">{errors.image}</p>
              )}
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Image</h2>
          <div className="space-y-4">
            {bannerPreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={bannerPreview}
                  alt="Developer banner"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <Label htmlFor="banner">Upload Banner Image</Label>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'banner')}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Recommended: 1920x400px or wider. Max size 2MB.
              </p>
              {errors.banner && (
                <p className="text-sm text-red-600 mt-1">{errors.banner}</p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Developer Name *</Label>
              <Input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your Name or Company Name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="developer@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                This email will be visible to users for support inquiries
              </p>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional. Visible to users for support.
              </p>
            </div>
          </div>
        </div>

        {/* Featured App */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured App</h2>
          <div>
            <Label htmlFor="featuredApp">Select App to Feature</Label>
            <select
              id="featuredApp"
              value={profile.featuredAppId}
              onChange={(e) => setProfile({ ...profile, featuredAppId: e.target.value })}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
            >
              <option value="">None</option>
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} {app.status === 'PUBLISHED' ? '(Published)' : `(${app.status})`}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              This app will be prominently displayed on your developer profile
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
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
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              Deleting your developer account will permanently remove all your apps from the Vondera App Store. This action cannot be undone. All app installations will be revoked and user data will be permanently deleted.
            </p>
            <Button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Developer Account
            </Button>
          </div>
        </div>
      </form>

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
                <h3 className="text-lg font-semibold text-gray-900">Delete Developer Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">This will permanently delete:</p>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>All {apps.length} of your apps</li>
                  <li>All app installations and user data</li>
                  <li>Your developer profile and settings</li>
                  <li>All access tokens and credentials</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="delete-confirm">Type <span className="font-mono font-semibold">DELETE</span> to confirm</Label>
                <Input
                  id="delete-confirm"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
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
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
