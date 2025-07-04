import { ReactNode, useState, useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import UpgradeModal from '../common/UpgradeModal';

interface FeatureGateProps {
  children: ReactNode;
  featureType: 'ai_conversations' | 'vision_boards' | 'budget_trackers' | 'photo_uploads';
  featureName: string;
  description?: string;
  fallback?: ReactNode;
}

export default function FeatureGate({ 
  children, 
  featureType, 
  featureName, 
  description,
  fallback 
}: FeatureGateProps) {
  const { canUseFeature, loading, subscriptionTier } = useSubscription();
  const [canAccess, setCanAccess] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading && subscriptionTier) {
        const hasAccess = await canUseFeature(featureType);
        setCanAccess(hasAccess);
        setCheckingAccess(false);
      }
    };

    checkAccess();
  }, [featureType, canUseFeature, loading, subscriptionTier]);

  if (loading || checkingAccess) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!canAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upgrade Required
            </h3>
            <p className="text-muted-foreground mb-4">
              This feature requires a higher subscription tier
            </p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
        
        <UpgradeModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          featureName={featureName}
          description={description}
        />
      </div>
    );
  }

  return <>{children}</>;
}