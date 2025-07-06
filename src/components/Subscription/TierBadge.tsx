import { Crown, Sparkles, Zap, Star } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface TierBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'banner' | 'icon';
  className?: string;
}

export default function TierBadge({ size = 'md', variant = 'badge', className = '' }: TierBadgeProps) {
  const { subscriptionTier, loading } = useSubscription();

  if (loading || !subscriptionTier) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 w-16 bg-muted rounded"></div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'free':
        return {
          label: 'Free',
          icon: Star,
          colors: 'bg-muted text-muted-foreground',
          gradientColors: 'from-gray-400 to-gray-500'
        };
      case 'basic':
        return {
          label: 'Plus',
          icon: Zap,
          colors: 'bg-blue-500 text-white',
          gradientColors: 'from-blue-400 to-blue-600'
        };
      case 'premium':
        return {
          label: 'Pro',
          icon: Crown,
          colors: 'bg-gradient-to-r from-primary to-primary-glow text-white',
          gradientColors: 'from-primary to-primary-glow'
        };
      case 'enterprise':
        return {
          label: 'Enterprise',
          icon: Sparkles,
          colors: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
          gradientColors: 'from-purple-500 to-pink-500'
        };
      default:
        return {
          label: 'Free',
          icon: Star,
          colors: 'bg-muted text-muted-foreground',
          gradientColors: 'from-gray-400 to-gray-500'
        };
    }
  };

  const config = getTierConfig(subscriptionTier.tier);
  const IconComponent = config.icon;

  if (variant === 'icon') {
    return (
      <IconComponent className={`${iconSizes[size]} ${className}`} />
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`${config.colors} rounded-lg ${sizeClasses[size]} font-semibold flex items-center space-x-1 ${className}`}>
        <IconComponent className={iconSizes[size]} />
        <span>{config.label}</span>
      </div>
    );
  }

  return (
    <span className={`${config.colors} rounded-full ${sizeClasses[size]} font-semibold inline-flex items-center space-x-1 ${className}`}>
      <IconComponent className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
}