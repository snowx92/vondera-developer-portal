'use client';

interface WebhooksTabProps {
  appId: string;
  onUpdate: () => void;
}

export function WebhooksTab({ appId, onUpdate }: WebhooksTabProps) {
  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
      <p className="text-sm text-gray-600 mb-6">
        Subscribe to events and receive real-time notifications
      </p>
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Webhooks settings UI coming soon</p>
      </div>
    </div>
  );
}
