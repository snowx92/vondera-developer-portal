interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'purple' | 'green' | 'yellow' | 'gray' | 'blue';
}

const colorConfig = {
  purple: 'bg-purple-100 text-vondera-purple',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-600',
};

export function StatsCard({ title, value, icon, trend, color = 'purple' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorConfig[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      {trend && (
        <p className="text-xs text-green-600 font-medium">{trend}</p>
      )}
    </div>
  );
}
