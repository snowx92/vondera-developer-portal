'use client';

interface ListingTabProps {
  appId: string;
  onUpdate: () => void;
}

export function ListingTab({ appId, onUpdate }: ListingTabProps) {
  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Listing</h3>
      <p className="text-sm text-gray-600 mb-6">
        Manage how your app appears in the Vondera App Store
      </p>
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">Listing settings UI coming soon</p>
      </div>
    </div>
  );
}
