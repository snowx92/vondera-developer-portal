'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppsService } from '@/lib/services/apps.service';
import type { TestStore } from '@/lib/types/api.types';

export default function TestingStoresPage() {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<TestStore[]>([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [storeToRemove, setStoreToRemove] = useState<TestStore | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const appsService = useMemo(() => new AppsService(), []);

  const loadStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appsService.getTestFlightStores();
      if (response) {
        setStores(response.stores);
      }
    } catch (error) {
      console.error('Failed to load stores:', error);
      setErrors({
        load: error instanceof Error ? error.message : 'Failed to load stores',
      });
    } finally {
      setLoading(false);
    }
  }, [appsService]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleRemoveStore = async () => {
    if (!storeToRemove) return;

    try {
      setLoading(true);
      await appsService.removeTestFlightStore(storeToRemove.store_id);

      const updatedStores = stores.filter((s) => s.store_id !== storeToRemove.store_id);
      setStores(updatedStores);

      setShowRemoveDialog(false);
      setStoreToRemove(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to remove store',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.store_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatBoundAt = (boundAt: { _seconds: number; _nanoseconds: number }) => {
    const date = new Date(boundAt._seconds * 1000 + boundAt._nanoseconds / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Testing Stores</h1>
        <p className="text-gray-600">
          Manage stores that can test your unpublished apps
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Operation completed successfully!
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            placeholder="Search stores by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Connected Stores</h2>
        </div>

        {loading && stores.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading stores...</div>
        ) : errors.load ? (
          <div className="px-6 py-12 text-center text-red-500">
            {errors.load}
            <button
              onClick={loadStores}
              className="mt-2 text-vondera-purple hover:underline block"
            >
              Try again
            </button>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Stores can connect to you using your developer email'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connected At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStores.map((store) => (
                  <tr key={store.store_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {store.logo ? (
                            <Image
                              src={store.logo}
                              alt={store.store_name}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{store.store_name}</div>
                          <div className="text-sm text-gray-500">{store.store_email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {store.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.merchant_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatBoundAt(store.bound_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setStoreToRemove(store);
                          setShowRemoveDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Remove Store Dialog */}
      {showRemoveDialog && storeToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Remove Test Store</h3>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove <strong>{storeToRemove.store_name}</strong>? This store will no longer be able to test your unpublished apps.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowRemoveDialog(false);
                  setStoreToRemove(null);
                }}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemoveStore}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove Store'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

