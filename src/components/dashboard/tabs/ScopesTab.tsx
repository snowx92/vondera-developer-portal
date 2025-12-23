'use client';

interface ScopesTabProps {
  appId: string;
  onUpdate: () => void;
}

export function ScopesTab({ appId, onUpdate }: ScopesTabProps) {
  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions & Scopes</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select the permissions your app needs to access
      </p>
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Scopes settings UI coming soon</p>
      </div>
    </div>
  );
}
