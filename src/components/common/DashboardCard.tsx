import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface DashboardCardProps {
  to: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export default function DashboardCard({ 
  to, 
  title, 
  description, 
  icon, 
  className = '' 
}: DashboardCardProps) {
  return (
    <Link 
      to={to} 
      className={`bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-6 hover:shadow-2xl hover:border-primary transition-all ${className}`}
    >
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold text-primary-700 mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}