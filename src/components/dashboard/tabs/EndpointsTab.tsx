'use client';

interface EndpointsTabProps {
  appId: string;
  onUpdate: () => void;
}

export function EndpointsTab({ appId, onUpdate }: EndpointsTabProps) {
  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">App Endpoints</h3>
      <p className="text-sm text-gray-600 mb-6">
        Configure OAuth and webhook endpoints for your app
      </p>
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Endpoints settings UI coming soon</p>
      </div>
    </div>
  );
}
