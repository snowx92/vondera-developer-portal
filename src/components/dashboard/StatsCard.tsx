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
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-vondera-purple/30 transition-all hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorConfig[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-0.5">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 font-medium mt-0.5">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
}
