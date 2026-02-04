'use client';

import { useState, useEffect } from 'react';
import { settingsService } from '@/lib/services';
import type { PricingSettingsResponse, PricingSettings, CountryPricing, AppType } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PricingTabProps {
  appId: string;
  onUpdate: () => void;
}

const AVAILABLE_COUNTRIES = [
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'US', name: 'United States', currency: 'USD' },
];

export function PricingTab({ appId, onUpdate }: PricingTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [appType, setAppType] = useState<AppType>('FREE');
  const [pricing, setPricing] = useState<PricingSettings>({});
  const [originalAppType, setOriginalAppType] = useState<AppType>('FREE');
  const [originalPricing, setOriginalPricing] = useState<PricingSettings>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [appId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getPricingSettings(appId);
      if (data) {
        setAppType(data.app_type);
        setPricing(data.pricing || {});
        setOriginalAppType(data.app_type);
        setOriginalPricing(data.pricing || {});
      }
    } catch (error) {
      console.error('Failed to load pricing settings:', error);
      setErrors({ load: 'Failed to load pricing settings' });
    } finally {
      setLoading(false);
    }
  };

  // Check if form has changes
  const hasChanges =
    appType !== originalAppType ||
    JSON.stringify(pricing) !== JSON.stringify(originalPricing);

  const addCountry = (countryCode: string) => {
    const country = AVAILABLE_COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setPricing({
        ...pricing,
        [countryCode]: {
          price: 0,
          currency: country.currency,
        },
      });
    }
  };

  const removeCountry = (countryCode: string) => {
    const newPricing = { ...pricing };
    delete newPricing[countryCode];
    setPricing(newPricing);
  };

  const updateCountryPrice = (countryCode: string, price: number) => {
    setPricing({
      ...pricing,
      [countryCode]: {
        ...pricing[countryCode],
        price,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (appType === 'PAID' && Object.keys(pricing).length === 0) {
      newErrors.pricing = 'Please add at least one country pricing for paid apps';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      await settingsService.updatePricingSettings(appId, {
        app_type: appType,
        pricing: appType === 'FREE' ? {} : pricing,
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

  const availableCountriesToAdd = AVAILABLE_COUNTRIES.filter(
    country => !pricing[country.code]
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Monetization</h3>
      <p className="text-sm text-gray-600 mb-6">
        Configure how you want to monetize your app
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* App Type */}
        <div>
          <Label htmlFor="app_type">App Type *</Label>
          <select
            id="app_type"
            value={appType}
            onChange={(e) => {
              setAppType(e.target.value as AppType);
              if (e.target.value === 'FREE') {
                setPricing({});
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
          >
            <option value="FREE">Free</option>
            <option value="PREMIUM">Premium (only available to merchants on pro plan)</option>
            <option value="PAID">Paid (one-time payment)</option>
            <option value="SUBSCRIPTION">Subscription (recurring payment)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {appType === 'FREE' && 'Your app will be available for free to all merchants'}
            {appType === 'PREMIUM' && 'Your app is free to install with optional premium features. Only available to merchants on pro plan.'}
            {appType === 'PAID' && 'Merchants must pay a one-time fee to use your app'}
            {appType === 'SUBSCRIPTION' && 'Merchants pay a recurring fee to use your app'}
          </p>
        </div>

        {/* Pricing Configuration (only for PAID and SUBSCRIPTION apps) */}
        {(appType === 'PAID' || appType === 'SUBSCRIPTION') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Country Pricing</Label>
              {availableCountriesToAdd.length > 0 && (
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addCountry(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vondera-purple"
                >
                  <option value="">+ Add Country</option>
                  {availableCountriesToAdd.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Pricing List */}
            {Object.keys(pricing).length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 text-sm">No country pricing configured yet</p>
                <p className="text-gray-400 text-xs mt-1">Add countries using the dropdown above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(pricing).map(([countryCode, countryPricing]) => {
                  const country = AVAILABLE_COUNTRIES.find(c => c.code === countryCode);
                  return (
                    <div key={countryCode} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{country?.name || countryCode}</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={countryPricing.price}
                            onChange={(e) => updateCountryPrice(countryCode, parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-32"
                          />
                          <span className="text-sm text-gray-600">{countryPricing.currency}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCountry(countryCode)}
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove country"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {errors.pricing && (
              <p className="text-sm text-red-600 mt-2">{errors.pricing}</p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Pricing Note</h4>
              <p className="text-sm text-blue-700">
                {appType === 'FREE' && 'Free apps don\'t require any pricing configuration.'}
                {appType === 'PREMIUM' && 'Premium apps are free to install and only available to merchants on pro plan. You can implement your own in-app purchase logic.'}
                {appType === 'PAID' && 'Merchants will be charged the specified amount when they install your app. Vondera will handle the payment collection and transfer funds to you.'}
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
              <p className="text-sm text-green-700">Pricing settings saved successfully</p>
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
              'Save Pricing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
