'use client';

import { useState, useEffect } from 'react';
import { settingsService } from '@/lib/services';
import type { CountrySettings } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EG, US, SA, AE, KW, QA, BH, OM, JO, LB, IQ, YE, PS, MA, TN, DZ, LY, SD } from 'country-flag-icons/react/3x2';

interface CountriesTabProps {
  appId: string;
  onUpdate: () => void;
}

const AVAILABLE_COUNTRIES = [
  { code: 'EG', name: 'Egypt', Flag: EG },
  { code: 'US', name: 'United States', Flag: US },
  { code: 'SA', name: 'Saudi Arabia', Flag: SA },
  { code: 'AE', name: 'United Arab Emirates', Flag: AE },
  { code: 'KW', name: 'Kuwait', Flag: KW },
  { code: 'QA', name: 'Qatar', Flag: QA },
  { code: 'BH', name: 'Bahrain', Flag: BH },
  { code: 'OM', name: 'Oman', Flag: OM },
  { code: 'JO', name: 'Jordan', Flag: JO },
  { code: 'LB', name: 'Lebanon', Flag: LB },
  { code: 'IQ', name: 'Iraq', Flag: IQ },
  { code: 'YE', name: 'Yemen', Flag: YE },
  { code: 'PS', name: 'Palestine', Flag: PS },
  { code: 'MA', name: 'Morocco', Flag: MA },
  { code: 'TN', name: 'Tunisia', Flag: TN },
  { code: 'DZ', name: 'Algeria', Flag: DZ },
  { code: 'LY', name: 'Libya', Flag: LY },
  { code: 'SD', name: 'Sudan', Flag: SD },
];

export function CountriesTab({ appId, onUpdate }: CountriesTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [originalCountries, setOriginalCountries] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [appId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getCountrySettings(appId);
      if (data) {
        setSelectedCountries(data.supported_countries || []);
        setOriginalCountries(data.supported_countries || []);
      }
    } catch (error) {
      console.error('Failed to load country settings:', error);
      setErrors({ load: 'Failed to load country settings' });
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges = JSON.stringify(selectedCountries.sort()) !== JSON.stringify(originalCountries.sort());

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const selectAll = () => {
    setSelectedCountries(AVAILABLE_COUNTRIES.map(c => c.code));
  };

  const deselectAll = () => {
    setSelectedCountries([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (selectedCountries.length === 0) {
      newErrors.countries = 'Please select at least one country';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      await settingsService.updateCountrySettings(appId, {
        supported_countries: selectedCountries,
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Countries</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select which countries your app will be available in
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select/Deselect All */}
        <div className="flex items-center justify-between">
          <Label>Countries ({selectedCountries.length} selected)</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-sm text-vondera-purple hover:text-vondera-purple-dark font-medium"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_COUNTRIES.map((country) => {
            const isSelected = selectedCountries.includes(country.code);
            return (
              <label
                key={country.code}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-vondera-purple bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCountry(country.code)}
                  className="w-4 h-4 text-vondera-purple border-gray-300 rounded focus:ring-vondera-purple"
                />
                <country.Flag className="w-8 h-6 rounded" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{country.name}</p>
                  <p className="text-xs text-gray-500">{country.code}</p>
                </div>
              </label>
            );
          })}
        </div>

        {errors.countries && (
          <p className="text-sm text-red-600 mt-2">{errors.countries}</p>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Availability</h4>
              <p className="text-sm text-blue-700">
                Your app will only be visible and installable to merchants in the selected countries.
                You can always change this later.
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
              <p className="text-sm text-green-700">Countries saved successfully</p>
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
              'Save Countries'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
