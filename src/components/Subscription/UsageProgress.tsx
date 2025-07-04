import { useSubscription } from '../../hooks/useSubscription';

interface UsageProgressProps {
  featureType: 'ai_conversations' | 'vision_boards' | 'budget_trackers' | 'photo_uploads';
  label: string;
  className?: string;
}

export default function UsageProgress({ featureType, label, className = '' }: UsageProgressProps) {
  const { subscriptionTier, featureUsage, loading, getUsagePercentage, isFeatureLimited } = useSubscription();

  if (loading || !subscriptionTier) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-muted rounded"></div>
      </div>
    );
  }

  const limit = subscriptionTier[`${featureType}_limit`];
  const usage = featureUsage[featureType];
  const percentage = getUsagePercentage(featureType);
  const isUnlimited = !isFeatureLimited(featureType);

  if (isUnlimited) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-primary font-medium">Unlimited</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  }

  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-medium ${isAtLimit ? 'text-destructive' : isNearLimit ? 'text-orange-500' : 'text-foreground'}`}>
          {usage} / {limit}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit 
              ? 'bg-destructive' 
              : isNearLimit 
                ? 'bg-orange-500' 
                : 'bg-gradient-to-r from-primary to-primary-glow'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="text-xs text-destructive">
          You've reached your limit for this feature
        </p>
      )}
    </div>
  );
}