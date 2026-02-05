'use client';

import { useState, useEffect, useCallback } from 'react';
import { appsService, settingsService } from '@/lib/services';
import type { Scope } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ScopesTabProps {
  appId: string;
  onUpdate: () => void;
}

export function ScopesTab({ appId, onUpdate }: ScopesTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableScopes, setAvailableScopes] = useState<Scope[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [scopeReasons, setScopeReasons] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [scopesData, settingsData] = await Promise.all([
        appsService.getScopes(),
        settingsService.getScopeSettings(appId),
      ]);

      setAvailableScopes(scopesData);
      setSelectedScopes(settingsData?.scopes || []);
      setScopeReasons(settingsData?.scope_reasons || {});
    } catch (err) {
      console.error('Failed to load scopes data:', err);
      setError('Failed to load scopes data');
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScopeToggle = (scopeKey: string) => {
    setSelectedScopes((prev) => {
      const isCurrentlySelected = prev.includes(scopeKey);

      // If deselecting, remove the reason
      if (isCurrentlySelected) {
        setScopeReasons((prevReasons) => {
          const newReasons = { ...prevReasons };
          delete newReasons[scopeKey];
          return newReasons;
        });
        return prev.filter((k) => k !== scopeKey);
      }

      // If selecting, add to the list
      return [...prev, scopeKey];
    });
  };

  const handleSelectCategory = (category: string, scopes: Scope[]) => {
    const categoryScopeKeys = scopes.map((s) => s.key);
    const allSelected = categoryScopeKeys.every((k) => selectedScopes.includes(k));

    if (allSelected) {
      // Deselect all - remove reasons for deselected scopes
      setScopeReasons((prevReasons) => {
        const newReasons = { ...prevReasons };
        categoryScopeKeys.forEach((key) => {
          delete newReasons[key];
        });
        return newReasons;
      });
      setSelectedScopes((prev) => prev.filter((k) => !categoryScopeKeys.includes(k)));
    } else {
      // Select all
      const newSelected = new Set([...selectedScopes, ...categoryScopeKeys]);
      setSelectedScopes(Array.from(newSelected));
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate that each selected scope has a reason
      const missingReasons = selectedScopes.filter(
        scopeKey => !scopeReasons[scopeKey] || scopeReasons[scopeKey].trim().length === 0
      );

      if (missingReasons.length > 0) {
        setError(`Please provide a reason for all selected permissions (${missingReasons.length} missing)`);
        setSaving(false);
        return;
      }

      // Only send reasons for selected scopes (cleanup deselected scopes)
      const filteredReasons: Record<string, string> = {};
      selectedScopes.forEach(scopeKey => {
        if (scopeReasons[scopeKey]) {
          filteredReasons[scopeKey] = scopeReasons[scopeKey];
        }
      });

      await settingsService.updateScopeSettings(appId, {
        scopes: selectedScopes,
        scope_reasons: filteredReasons
      });

      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save scopes:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Group scopes by category
  const groupedScopes = availableScopes.reduce((acc, scope) => {
    if (!acc[scope.category]) {
      acc[scope.category] = [];
    }
    acc[scope.category].push(scope);
    return acc;
  }, {} as Record<string, Scope[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Permissions & Scopes</h3>
          <p className="text-sm text-gray-600">
            Select the permissions your app needs to function
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
          Permissions updated successfully!
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(groupedScopes).map(([category, scopes]) => {
          const isCategorySelected = scopes.every((s) => selectedScopes.includes(s.key));
          const isCategoryIndeterminate = scopes.some((s) => selectedScopes.includes(s.key)) && !isCategorySelected;

          return (
            <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 capitalize">{category}</h4>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {scopes.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectCategory(category, scopes)}
                  className="text-xs h-8"
                >
                  {isCategorySelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="p-4 space-y-4">
                {scopes.map((scope) => (
                  <div key={scope.key} className="space-y-2">
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedScopes.includes(scope.key)
                          ? 'border-vondera-purple bg-purple-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleScopeToggle(scope.key)}
                    >
                      <Checkbox
                        checked={selectedScopes.includes(scope.key)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{scope.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{scope.description}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-1.5">{scope.key}</p>
                      </div>
                    </div>
                    {selectedScopes.includes(scope.key) && (
                      <div className="ml-9 mr-3">
                        <label htmlFor={`reason-${scope.key}`} className="block text-xs font-medium text-gray-700 mb-1">
                          Why do you need this permission? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id={`reason-${scope.key}`}
                          value={scopeReasons[scope.key] || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            setScopeReasons(prev => ({
                              ...prev,
                              [scope.key]: e.target.value
                            }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Explain why your app needs this permission... (required)"
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent resize-none ${
                            !scopeReasons[scope.key] || scopeReasons[scope.key].trim().length === 0
                              ? 'border-orange-300 bg-orange-50/30'
                              : 'border-gray-300'
                          }`}
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                          This helps reviewers understand your app&apos;s functionality
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
