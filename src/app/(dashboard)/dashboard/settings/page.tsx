'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { appsService, AuthService } from '@/lib/services';
import type { App, DeveloperProfile } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<DeveloperProfile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhoneCountryCode, setEditPhoneCountryCode] = useState('+20');

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load apps for featured app dropdown (kept for reference but not shown in UI)
      const appsData = await appsService.getApps();
      setApps(appsData);

      // Load developer profile from API
      const profileData = await AuthService.getProfile();
      if (profileData) {
        setProfile(profileData);
        setOriginalProfile(profileData);
        setEditName(profileData.name || '');
        setEditEmail(profileData.email || '');
        setEditPhone(profileData.phone || '');
        setEditPhoneCountryCode(profileData.phoneCountryCode || '+20');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setErrors({ load: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = profile
    ? (editName !== profile.name ||
        editEmail !== profile.email ||
        editPhone !== profile.phone ||
        editPhoneCountryCode !== profile.phoneCountryCode)
    : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!editName.trim()) newErrors.name = 'Developer name is required';
    if (!editEmail.trim()) newErrors.email = 'Email is required';
    if (editEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      newErrors.email = 'Invalid email format';
    }
    if (editPhone && !/^\+?[0-9]{10,15}$/.test(editPhone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = await AuthService.updateProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        phoneCountryCode: editPhoneCountryCode,
        image: profile?.profilePic || '',
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        setSuccess(true);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};
    if (!oldPassword) newErrors.oldPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const result = await AuthService.changePassword(oldPassword, newPassword);

      if (result.success) {
        setSuccess(true);
        setSuccessMessage('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to change password',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{errors.load || 'Failed to load profile'}</p>
          <button
            onClick={loadData}
            className="mt-2 text-vondera-purple hover:underline"
          >
            Try again
          </button>
        </div>
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

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile.profilePic ? (
              <Image
                src={profile.profilePic}
                alt={profile.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            {profile.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                profile.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                profile.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {profile.status}
              </span>
              {profile.isBanned && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Banned
                </span>
              )}
            </div>
          </div>
          <div className="ml-auto flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.counters.appsCount}</p>
              <p className="text-sm text-gray-500">Apps</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.counters.totalInstalls}</p>
              <p className="text-sm text-gray-500">Installs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">EGP {profile.counters.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Developer Name *</Label>
              <Input
                id="name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
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
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
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
              <div className="flex gap-2">
                <select
                  value={editPhoneCountryCode}
                  onChange={(e) => setEditPhoneCountryCode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent bg-white"
                >
                  <option value="+20">+20 (Egypt)</option>
                  <option value="+1">+1 (US/Canada)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+966">+966 (Saudi Arabia)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+973">+973 (Bahrain)</option>
                  <option value="+974">+974 (Qatar)</option>
                  <option value="+965">+965 (Kuwait)</option>
                  <option value="+968">+968 (Oman)</option>
                </select>
                <Input
                  id="phone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Phone number"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Visible to users for support
              </p>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

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
      </form>

      {/* Password Change Section */}
      <div className="border-t border-gray-200 pt-8 mt-8">
        {!showPasswordForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Password</h2>
                <p className="text-sm text-gray-500">Change your account password</p>
              </div>
              <Button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              <Button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setErrors({});
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Current Password *</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                {errors.oldPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.oldPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-vondera-purple hover:bg-vondera-purple-dark"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

