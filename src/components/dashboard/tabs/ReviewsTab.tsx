'use client';

import { useState, useEffect } from 'react';
import { reviewsService } from '@/lib/services';
import type { ReviewRequest, App, Timestamp, AppStepsResponse } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';

interface ReviewsTabProps {
  appId: string;
  app: App;
  appSteps?: AppStepsResponse | null;
  onUpdate: () => void;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  APPROVED: { label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-100' },
  REJECTED: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
  CANCELLED: { label: 'Cancelled', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

const requestTypeConfig: Record<string, { label: string; icon: React.ReactElement }> = {
  PUBLISH: {
    label: 'Publish Request',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  UPDATE: {
    label: 'Update Request',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
};

export function ReviewsTab({ appId, app, appSteps, onUpdate }: ReviewsTabProps) {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [appId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getReviewRequests(appId);
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      await reviewsService.submitPublishRequest(appId);
      setSuccess('Publish request submitted successfully!');
      setShowPublishDialog(false);
      await loadRequests();
      onUpdate();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit publish request');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    if (!updateNotes.trim()) {
      setError('Please provide notes about the changes');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reviewsService.submitUpdateRequest(appId, { notes: updateNotes });
      setSuccess('Update request submitted successfully!');
      setShowUpdateDialog(false);
      setUpdateNotes('');
      await loadRequests();
      onUpdate();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit update request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue: string | Timestamp | undefined) => {
    if (!dateValue) return 'N/A';

    let date: Date;
    if (typeof dateValue === 'string') {
      date = new Date(dateValue);
    } else {
      // Handle Timestamp object
      date = new Date(dateValue._seconds * 1000);
    }

    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const canPublish = (app.status === 'DRAFT' || app.status === 'PENDING' || app.status === 'REJECTED') && (appSteps?.readyForPublish === true);
  const canUpdate = (app.status === 'PUBLISHED' || app.status === 'APPROVED') && (appSteps?.haveUpdate === true);
  const hasPendingRequest = requests.some(r => r.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Publish</h3>
        <p className="text-sm text-gray-600 mb-6">
          Submit your app for review to publish it on the Vondera App Store, or submit updates to your published app.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowPublishDialog(true)}
          disabled={!canPublish || hasPendingRequest || loading}
          variant={canPublish && !hasPendingRequest ? 'default' : 'outline'}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Submit for Publishing
        </Button>
        <Button
          onClick={() => setShowUpdateDialog(true)}
          disabled={!canUpdate || hasPendingRequest || loading}
          variant="outline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Submit Update
        </Button>
      </div>

      {/* Status Messages */}
      {hasPendingRequest && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-700">You have a pending review request. Please wait for it to be reviewed before submitting a new request.</p>
          </div>
        </div>
      )}

      {!canPublish && !hasPendingRequest && (app.status === 'DRAFT' || app.status === 'PENDING' || app.status === 'REJECTED') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">Complete all required steps to publish</p>
              <p className="text-sm text-yellow-700">
                You need to complete {appSteps ? appSteps.totalSteps - appSteps.completedSteps : 0} more step(s) before you can submit your app for review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Requests List */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-900 mb-4">Review History</h4>

        {loading && requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No review requests yet</p>
            <p className="text-sm text-gray-400 mt-1">Submit your app for review to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const status = statusConfig[request.status] || statusConfig.PENDING;
              const type = requestTypeConfig[request.request_type] || requestTypeConfig.PUBLISH;

              return (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-vondera-purple mt-0.5">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900">{type.label}</h5>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{request.changes_summary}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Version: {request.current_version} → {request.requested_version}</span>
                          <span>Created: {formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${selectedRequest?.id === request.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded Details */}
                  {selectedRequest?.id === request.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Reviewer Notes */}
                      {request.reviewer_notes && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 mb-1">Reviewer Notes</h6>
                          <p className="text-sm text-gray-600">{request.reviewer_notes}</p>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {request.rejection_reason && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                          <h6 className="text-xs font-semibold text-red-700 mb-1">Rejection Reason</h6>
                          <p className="text-sm text-red-600">{request.rejection_reason}</p>
                        </div>
                      )}

                      {/* Pending Changes */}
                      {request.pending_changes && Object.keys(request.pending_changes).length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 mb-2">Pending Changes</h6>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm font-mono">
                            {Object.entries(request.pending_changes).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-gray-500">{key}:</span>
                                <span className="text-gray-900 break-all">{JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Changes Diff */}
                      {request.changes_diff && Object.keys(request.changes_diff).length > 0 && (
                        <div>
                          <h6 className="text-xs font-semibold text-gray-700 mb-2">Changes Summary</h6>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            {Object.entries(request.changes_diff).map(([key, diff]) => (
                              <div key={key} className="text-sm">
                                <div className="font-medium text-gray-700 mb-1">{key}</div>
                                <div className="pl-3 space-y-1">
                                  <div className="flex gap-2">
                                    <span className="text-red-600">- Old:</span>
                                    <span className="text-red-600 font-mono break-all">
                                      {diff.old === null ? 'null' : JSON.stringify(diff.old)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-green-600">+ New:</span>
                                    <span className="text-green-600 font-mono break-all">
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
                        <div className="text-xs text-gray-500">
                          <span>Reviewed: {formatDate(request.reviewed_at)}</span>
                          {request.reviewed_by && <span> by {request.reviewed_by}</span>}
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

      {/* Publish Dialog */}
      {showPublishDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit for Publishing</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to submit this app for review? Once submitted, your app will be reviewed by the Vondera team.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-700">
                  Current version: <span className="font-medium">{app.version}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowPublishDialog(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePublishRequest}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Dialog */}
      {showUpdateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Update Request</h3>
              <p className="text-sm text-gray-600 mb-6">
                Describe the changes you have made to your app. This will help the review team understand what has been updated.
              </p>

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Update Notes *
                </label>
                <textarea
                  id="notes"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Added customer scope and updated description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowUpdateDialog(false);
                    setUpdateNotes('');
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateRequest}
                  className="flex-1"
                  disabled={loading || !updateNotes.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
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
