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

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const status = statusConfig[app.status] || statusConfig.DRAFT;

  return (
    <Link
      href={`/dashboard/apps/${app.id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:border-vondera-purple hover:shadow-md transition-all group"
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
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-vondera-purple to-vondera-purple-dark rounded-lg flex items-center justify-center">
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

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {app.description || 'No description provided'}
        </p>

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
