'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthService } from '@/lib/services/auth.service';
import { SessionManager } from '@/lib/utils/session';
import { notificationsService } from '@/lib/services';
import type { Notification, DeveloperProfile } from '@/lib/types/api.types';

export function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const profileData = await AuthService.getProfile();
        if (profileData) {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, []);

  const loadNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoadingNotifications(true);
      const data = await notificationsService.getNotifications(page, 12);
      if (data) {
        setNotifications(prev => append ? [...prev, ...data.items] : data.items);
        setNewCount(data.newNotifications);
        setCurrentPage(data.currentPage);
        setIsLastPage(data.isLastPage);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Load notification count on mount
  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  const handleNotificationsToggle = () => {
    if (!isNotificationsOpen) {
      loadNotifications(1);
    }
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsDropdownOpen(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.readAllNotifications();
      setNewCount(0);
      setNotifications(prev =>
        prev.map(n => ({ ...n, isNew: false }))
      );
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleLoadMore = () => {
    if (!isLastPage && !loadingNotifications) {
      loadNotifications(currentPage + 1, true);
    }
  };

  const formatDate = (date: { _seconds: number }) => {
    const d = new Date(date._seconds * 1000);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLogout = async () => {
    await AuthService.logout();
    SessionManager.getInstance().clearSession();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Empty left side - search removed */}
      <div className="flex-1"></div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotificationsToggle}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {newCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {newCount > 99 ? '99+' : newCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {newCount > 0 && (
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {newCount} new
                      </span>
                    )}
                  </div>
                  {newCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-medium text-vondera-purple hover:text-vondera-purple-dark"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 && !loadingNotifications ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            notification.isNew ? 'bg-purple-50/40' : ''
                          }`}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {notification.icon ? (
                              <Image
                                src={notification.icon}
                                alt=""
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.content.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                              {notification.content.body}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {formatDate(notification.date)}
                            </p>
                          </div>

                          {/* New indicator */}
                          {notification.isNew && (
                            <div className="flex-shrink-0 mt-2">
                              <div className="w-2 h-2 bg-vondera-purple rounded-full"></div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Load More */}
                      {!isLastPage && (
                        <div className="px-4 py-3">
                          <button
                            onClick={handleLoadMore}
                            disabled={loadingNotifications}
                            className="w-full text-center text-sm font-medium text-vondera-purple hover:text-vondera-purple-dark py-2 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                          >
                            {loadingNotifications ? 'Loading...' : 'Load more'}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {loadingNotifications && notifications.length === 0 && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vondera-purple"></div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsNotificationsOpen(false); }}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-vondera-purple text-white rounded-full flex items-center justify-center text-sm font-medium overflow-hidden">
              {loadingProfile ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : profile?.profilePic ? (
                <Image
                  src={profile.profilePic}
                  alt={profile.name || 'User'}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{profile?.name?.charAt(0).toUpperCase() || 'D'}</span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {loadingProfile ? 'Loading...' : profile?.name || 'Developer'}
              </p>
              <p className="text-xs text-gray-500">
                {loadingProfile ? '...' : profile?.email || 'developer@vondera.com'}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Profile
                </a>
                <a
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
