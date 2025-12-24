'use client';

import type { AppStepsResponse } from '@/lib/types/api.types';
import type { ReactElement } from 'react';

interface AppStepsProgressProps {
  steps: AppStepsResponse;
  onStepClick: (stepId: string) => void;
}

const stepIcons: Record<string, ReactElement> = {
  listing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  general: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  endpoints: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  scopes: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  webhooks: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  pricing: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  countries: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'setup-form': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const stepLabels: Record<string, string> = {
  listing: 'Store Listing',
  general: 'General Settings',
  endpoints: 'Endpoints',
  scopes: 'Permissions',
  webhooks: 'Webhooks',
  pricing: 'Pricing',
  countries: 'Countries',
  'setup-form': 'Setup Form',
};

export function AppStepsProgress({ steps, onStepClick }: AppStepsProgressProps) {
  const percentage = steps.totalSteps > 0
    ? Math.round((steps.completedSteps / steps.totalSteps) * 100)
    : 0;

  // Group steps by category
  const groupedSteps = steps.steps.reduce((acc, step) => {
    if (!acc[step.step]) {
      acc[step.step] = [];
    }
    acc[step.step].push(step);
    return {};
  }, {} as Record<string, typeof steps.steps>);

  // Get unique step categories
  const stepCategories = Array.from(new Set(steps.steps.map(s => s.step)));

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Complete your app setup</h3>
            <p className="text-sm text-gray-600 mt-1">
              {steps.completedSteps} of {steps.totalSteps} steps completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-vondera-purple">{percentage}%</div>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-vondera-purple to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stepCategories.map((category) => {
            const categorySteps = steps.steps.filter(s => s.step === category);
            const allCompleted = categorySteps.every(s => s.completed);
            const someCompleted = categorySteps.some(s => s.completed);
            const allOptional = categorySteps.every(s => s.optional);

            return (
              <button
                key={category}
                onClick={() => onStepClick(category)}
                className={`group relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  allCompleted
                    ? 'border-green-500 bg-green-50 hover:bg-green-100'
                    : someCompleted
                    ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                    : 'border-gray-200 bg-white hover:border-vondera-purple hover:bg-purple-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${
                    allCompleted
                      ? 'text-green-600'
                      : someCompleted
                      ? 'text-yellow-600'
                      : 'text-gray-400 group-hover:text-vondera-purple'
                  }`}>
                    {stepIcons[category] || stepIcons.general}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-medium truncate ${
                        allCompleted
                          ? 'text-green-900'
                          : someCompleted
                          ? 'text-yellow-900'
                          : 'text-gray-900'
                      }`}>
                        {stepLabels[category] || category}
                      </h4>
                      {allOptional && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {categorySteps.filter(s => s.completed).length}/{categorySteps.length} completed
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {allCompleted ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 group-hover:text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ready to Publish Notice */}
        {steps.readyForPublish && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-900">Ready to publish!</h4>
                <p className="text-sm text-green-700 mt-0.5">
                  Your app is ready to be submitted for review. Go to Reviews & Publish to submit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
