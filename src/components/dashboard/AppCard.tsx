import Link from 'next/link';
import Image from 'next/image';
import type { App } from '@/lib/types/api.types';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PUBLISHED: {
    label: 'Published',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  APPROVED: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
  },
  DRAFT: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
  },
  PENDING: {
    label: 'In Review',
    color: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
};

const appTypeConfig: Record<string, { label: string; color: string }> = {
  FREE: { label: 'Free', color: 'bg-blue-100 text-blue-700' },
  PREMIUM: { label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  PAID: { label: 'Paid', color: 'bg-amber-100 text-amber-700' },
};

interface AppCardProps {
  app: App;
}

// Helper to get price display for PAID apps
function getPriceDisplay(app: App): string | null {
  if (app.app_type !== 'PAID') return null;
  // Get the first pricing entry
  const pricing = app.pricing;
  if (!pricing) return null;
  const firstCountry = Object.keys(pricing)[0];
  if (!firstCountry) return null;
  const priceData = pricing[firstCountry];
  return `${priceData.currency} ${priceData.price.toFixed(2)}`;
}

// Format install count
function formatInstalls(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function AppCard({ app }: AppCardProps) {
  const status = statusConfig[app.status] || statusConfig.DRAFT;
  const appType = appTypeConfig[app.app_type] || appTypeConfig.FREE;
  const priceDisplay = getPriceDisplay(app);
  const installsCount = app.installsCount || 0;

  return (
    <Link
      href={`/dashboard/apps/${app.id}`}
      className="block bg-white border border-gray-200 rounded-xl hover:border-vondera-purple hover:shadow-lg transition-all group"
    >
      <div className="p-6">
        {/* App Icon & Name */}
        <div className="flex items-start gap-4 mb-4">
          {app.icon ? (
            <Image
              src={app.icon}
              alt={app.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-vondera-purple to-vondera-purple-dark rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {app.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-vondera-purple transition-colors truncate">
              {app.name}
            </h3>
            <p className="text-sm text-gray-500">v{app.version}</p>
          </div>
        </div>

        {/* App Type Badge & Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${appType.color}`}>
            {appType.label}
          </span>
          {priceDisplay && (
            <span className="text-sm font-semibold text-gray-900">
              {priceDisplay}
            </span>
          )}
        </div>

        {/* Description */}
        <div
          className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]"
          dangerouslySetInnerHTML={{
            __html: app.description || 'No description provided'
          }}
        />

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm font-medium">{formatInstalls(installsCount)}</span>
            <span className="text-xs text-gray-400">installs</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Status */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
            {status.label}
          </span>

          {/* Category */}
          <span className="text-xs text-gray-500 capitalize">
            {app.category?.replace(/-/g, ' ')}
          </span>
        </div>
      </div>
    </Link>
  );
}
