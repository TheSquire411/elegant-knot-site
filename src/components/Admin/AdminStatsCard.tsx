import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export default function AdminStatsCard({ title, value, subtitle, icon: Icon, trend = 'neutral' }: AdminStatsCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-sage-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-primary-100">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        {TrendIcon && (
          <TrendIcon className={`h-5 w-5 ${
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          }`} />
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-sage-600">{title}</h3>
        <p className="text-2xl font-bold text-sage-800">{value}</p>
        <p className="text-sm text-sage-500">{subtitle}</p>
      </div>
    </div>
  );
}