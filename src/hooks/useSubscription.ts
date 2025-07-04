import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useApp } from '../context/AppContext';

export interface SubscriptionTier {
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  name: string;
  ai_conversations_limit: number | null;
  vision_boards_limit: number | null;
  budget_trackers_limit: number | null;
  photo_uploads_limit: number | null;
  custom_domain: boolean;
  advanced_analytics: boolean;
  collaboration_tools: boolean;
  priority_support: boolean;
}

export interface FeatureUsage {
  ai_conversations: number;
  vision_boards: number;
  budget_trackers: number;
  photo_uploads: number;
}

export function useSubscription() {
  const { state } = useApp();
  const user = state.user;
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage>({
    ai_conversations: 0,
    vision_boards: 0,
    budget_trackers: 0,
    photo_uploads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
      fetchFeatureUsage();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      // Get user's subscription tier from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        // Get tier details
        const { data: tierData } = await supabase
          .from('subscription_tiers')
          .select('*')
          .eq('tier', profile.subscription_tier)
          .single();

        if (tierData) {
          setSubscriptionTier(tierData);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const fetchFeatureUsage = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('feature_usage')
        .select('feature_type, usage_count')
        .eq('user_id', user.id)
        .gte('reset_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (data) {
        const usage: FeatureUsage = {
          ai_conversations: 0,
          vision_boards: 0,
          budget_trackers: 0,
          photo_uploads: 0,
        };

        data.forEach((item) => {
          if (item.feature_type in usage) {
            usage[item.feature_type as keyof FeatureUsage] = item.usage_count;
          }
        });

        setFeatureUsage(usage);
      }
    } catch (error) {
      console.error('Error fetching feature usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const canUseFeature = async (featureType: keyof FeatureUsage): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data } = await supabase.rpc('can_use_feature', {
        p_user_id: user.id,
        p_feature_type: featureType,
      });

      return data || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const incrementUsage = async (featureType: keyof FeatureUsage): Promise<void> => {
    if (!user) return;

    try {
      await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature_type: featureType,
      });

      // Refresh usage data
      await fetchFeatureUsage();
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const getUsagePercentage = (featureType: keyof FeatureUsage): number => {
    if (!subscriptionTier) return 0;

    const limit = subscriptionTier[`${featureType}_limit`];
    if (limit === null) return 0; // Unlimited

    const usage = featureUsage[featureType];
    return Math.min((usage / limit) * 100, 100);
  };

  const isFeatureLimited = (featureType: keyof FeatureUsage): boolean => {
    if (!subscriptionTier) return true;
    return subscriptionTier[`${featureType}_limit`] !== null;
  };

  return {
    subscriptionTier,
    featureUsage,
    loading,
    canUseFeature,
    incrementUsage,
    getUsagePercentage,
    isFeatureLimited,
    refreshData: () => {
      fetchSubscriptionData();
      fetchFeatureUsage();
    },
  };
}