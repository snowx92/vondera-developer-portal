'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { appsService, reviewsService } from '@/lib/services';
import type { App, ReviewRequest, Timestamp } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';

interface AppWithRequests {
  app: App;
  requests: ReviewRequest[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  PENDING: { label: 'Pending review', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  APPROVED: { label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  REJECTED: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  CANCELLED: { label: 'Cancelled', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
};

const requestTypeConfig: Record<string, { label: string; shortLabel: string; icon: React.ReactElement; color: string }> = {
  PUBLISH: {
    label: 'Publish Request',
    shortLabel: 'Publish',
    color: 'text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  UPDATE: {
    label: 'Update Request',
    shortLabel: 'Update',
    color: 'text-purple-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
};

export default function ReviewsPage() {
  const [appsWithRequests, setAppsWithRequests] = useState<AppWithRequests[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AppWithRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const loadReviewRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const apps = await appsService.getApps();
      const appsWithRequestsData = await Promise.all(
        apps.map(async (app) => {
          try {
            const requests = await reviewsService.getReviewRequests(app.id);
            return { app, requests: requests || [] };
          } catch (err) {
            console.error(`Failed to load requests for app ${app.id}:`, err);
            return { app, requests: [] };
          }
        })
      );

      const filteredData = appsWithRequestsData.filter(item => item.requests.length > 0);
      setAppsWithRequests(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load review requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = useCallback(() => {
    let filtered = appsWithRequests.map(item => ({
      ...item,
      requests: item.requests.filter(request => {
        if (statusFilter !== 'all' && request.status !== statusFilter) {
          return false;
        }
        if (typeFilter !== 'all' && request.request_type !== typeFilter) {
          return false;
        }
        return true;
      }),
    })).filter(item => item.requests.length > 0);

    setFilteredRequests(filtered);
  }, [appsWithRequests, statusFilter, typeFilter]);

  useEffect(() => {
    loadReviewRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [filterRequests]);

  const formatDate = (date: string | Timestamp | undefined) => {
    if (!date) return 'N/A';

    try {
      let dateObj: Date;

      // Handle Firestore Timestamp format
      if (typeof date === 'object' && '_seconds' in date) {
        dateObj = new Date((date as Timestamp)._seconds * 1000);
      } else {
        dateObj = new Date(date as string);
      }

      if (isNaN(dateObj.getTime())) return 'N/A';

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch {
      return 'N/A';
    }
  };

  const totalRequests = appsWithRequests.reduce((sum, item) => sum + item.requests.length, 0);
  const pendingRequests = appsWithRequests.reduce(
    (sum, item) => sum + item.requests.filter(r => r.status === 'PENDING').length,
    0
  );
  const approvedRequests = appsWithRequests.reduce(
    (sum, item) => sum + item.requests.filter(r => r.status === 'APPROVED').length,
    0
  );
  const rejectedRequests = appsWithRequests.reduce(
    (sum, item) => sum + item.requests.filter(r => r.status === 'REJECTED').length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-vondera-purple to-purple-700 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">Review requests</h1>
          </div>
          <p className="text-gray-600 ml-13">Monitor and track submission status across all your apps</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">All requests</span>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{totalRequests}</p>
          </div>

          <div className="bg-white rounded-lg border border-amber-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-700">Pending review</span>
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-amber-700">{pendingRequests}</p>
          </div>

          <div className="bg-white rounded-lg border border-green-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Approved</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-green-700">{approvedRequests}</p>
          </div>

          <div className="bg-white rounded-lg border border-red-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700">Rejected</span>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-semibold text-red-700">{rejectedRequests}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Status</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All', count: totalRequests },
                  { value: 'PENDING', label: 'Pending', count: pendingRequests },
                  { value: 'APPROVED', label: 'Approved', count: approvedRequests },
                  { value: 'REJECTED', label: 'Rejected', count: rejectedRequests },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      statusFilter === filter.value
                        ? 'bg-vondera-purple text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label} <span className="ml-1 opacity-75">({filter.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">Request type</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All types' },
                  { value: 'PUBLISH', label: 'Publish' },
                  { value: 'UPDATE', label: 'Update' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTypeFilter(filter.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      typeFilter === filter.value
                        ? 'bg-vondera-purple text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple mx-auto mb-4"></div>
            <p className="text-gray-500">Loading review requests...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg border border-red-200 p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button onClick={loadReviewRequests} variant="outline">
              Try again
            </Button>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium text-lg mb-2">No review requests found</p>
            <p className="text-gray-500">
              {totalRequests === 0
                ? 'Submit your apps for review to track them here'
                : 'No requests match your current filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map(({ app, requests }) => {
              const isExpanded = expandedApp === app.id;

              return (
                <div key={app.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* App Header - Accordion Toggle */}
                  <div
                    onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                    className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 hover:from-gray-100 hover:to-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* App Icon */}
                        {app.icon ? (
                          <Image
                            src={app.icon}
                            alt={app.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vondera-purple to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {app.name.charAt(0)}
                          </div>
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 text-lg">{app.name}</h3>
                          <p className="text-sm text-gray-500">
                            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link href={`/dashboard/apps/${app.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm">
                            View app
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </Link>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Requests - Accordion Content */}
                  {isExpanded && (
                    <div className="divide-y divide-gray-100">
                      {requests.map((request) => {
                        const status = statusConfig[request.status] || statusConfig.PENDING;
                        const type = requestTypeConfig[request.request_type] || requestTypeConfig.PUBLISH;
                        const isRequestExpanded = selectedRequest === request.id;

                        return (
                          <div
                            key={request.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <button
                              onClick={() => setSelectedRequest(isRequestExpanded ? null : request.id)}
                              className="w-full px-6 py-5 text-left"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  <div className={`mt-1 ${type.color}`}>
                                    {type.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h5 className="font-medium text-gray-900">{type.label}</h5>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${status.bgColor} ${status.color} ${status.borderColor}`}>
                                        {status.label}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{request.changes_summary}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        v{request.current_version} → v{request.requested_version}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Created {formatDate(request.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <svg
                                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${isRequestExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Expanded Request Details */}
                            {isRequestExpanded && (
                              <div className="px-6 pb-6 space-y-4 bg-gray-50 border-t border-gray-100">
                                {/* Dates */}
                                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-500">Created:</span>
                                    <span className="text-gray-900 font-medium">{formatDate(request.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-gray-500">Updated:</span>
                                    <span className="text-gray-900 font-medium">{formatDate(request.updatedAt)}</span>
                                  </div>
                                </div>

                                {/* Reviewer Notes */}
                                {request.reviewer_notes && (
                                  <div>
                                    <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Reviewer notes</h6>
                                    <div className="bg-white rounded-md border border-gray-200 p-3">
                                      <p className="text-sm text-gray-700">{request.reviewer_notes}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Rejection Reason */}
                                {request.rejection_reason && (
                                  <div>
                                    <h6 className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wider">Rejection reason</h6>
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                      <p className="text-sm text-red-700">{request.rejection_reason}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Changes Diff */}
                                {request.changes_diff && Object.keys(request.changes_diff).length > 0 && (
                                  <div>
                                    <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">Changes</h6>
                                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                      {Object.entries(request.changes_diff).map(([key, diff], index) => (
                                        <div key={key} className={index > 0 ? 'border-t border-gray-100' : ''}>
                                          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                                            <span className="text-xs font-medium text-gray-700">{key}</span>
                                          </div>
                                          <div className="p-3 space-y-2 text-sm font-mono">
                                            <div className="flex gap-2">
                                              <span className="text-red-600 font-medium">-</span>
                                              <span className="text-red-600 break-all">
                                                {diff.old === null ? 'null' : JSON.stringify(diff.old)}
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <span className="text-green-600 font-medium">+</span>
                                              <span className="text-green-600 break-all">
                                                {diff.new === null ? 'null' : JSON.stringify(diff.new)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Review Info */}
                                {request.reviewed_at && (
                                  <div className="pt-2 flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-500">Reviewed on</span>
                                    <span className="text-gray-900 font-medium">{formatDate(request.reviewed_at)}</span>
                                    {request.reviewed_by && <span className="text-gray-500">by reviewer</span>}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
