import { Link } from 'react-router-dom';
import { ReactNode, useState } from 'react';

interface DashboardCardProps {
  to: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  animationDelay?: number;
}

export default function DashboardCard({ 
  to, 
  title, 
  description, 
  icon, 
  className = '',
  variant = 'default',
  animationDelay = 0
}: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-glass backdrop-blur-glass border border-white/20 shadow-glass hover:shadow-glass-lg hover:bg-white/30';
      case 'gradient':
        return 'shadow-lg hover:shadow-xl border hover:border-primary/30';
      default:
        return 'shadow-lg hover:shadow-xl border hover:border-primary/50';
    }
  };

  const iconVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-sm border border-white/30';
      case 'gradient':
        return 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200';
      default:
        return 'bg-primary-50 border border-primary-100';
    }
  };

  return (
    <Link 
      to={to} 
      className={`
        group relative overflow-hidden rounded-xl p-6
        transform transition-all duration-500 ease-out
        hover:-translate-y-2 hover:scale-[1.02]
        animate-card-entrance
        ${getVariantClasses()}
        ${className}
      `}
      style={{ 
        animationDelay: `${animationDelay}ms`,
        backgroundColor: variant === 'gradient' ? 'hsl(var(--background))' : variant === 'default' ? 'hsl(var(--background))' : undefined,
        borderColor: 'hsl(var(--border))'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass shimmer effect */}
      {variant === 'glass' && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-start space-x-4">
        {/* Icon Container */}
        {icon && (
          <div className={`
            flex-shrink-0 p-3 rounded-xl transition-all duration-300
            ${iconVariantClasses()}
            ${isHovered ? 'scale-110 rotate-3' : ''}
          `}>
            <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
              {icon}
            </div>
          </div>
        )}

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h2 
            className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-primary-800"
            style={{ 
              color: variant === 'glass' ? 'hsl(var(--foreground))' : 'hsl(var(--primary-700))'
            }}
          >
            {title}
          </h2>
          <p 
            className="text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            {description}
          </p>
        </div>

        {/* Hover Arrow */}
        <div className={`
          flex-shrink-0 text-primary-400 transform transition-all duration-300
          ${isHovered ? 'translate-x-1 text-primary-600' : 'translate-x-0'}
        `}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Gradient Overlay for Depth */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      )}
    </Link>
  );
}