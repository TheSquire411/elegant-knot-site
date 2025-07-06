import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface AdminUserStats {
  total_users: number;
  new_this_month: number;
  paid_users: number;
  admin_users: number;
}

export interface AdminSubscriptionStats {
  subscription_tier: string;
  user_count: number;
  percentage: number;
}

export interface AdminFeatureUsageStats {
  feature_type: string;
  total_usage: number;
  unique_users: number;
  avg_per_user: number;
}

export interface AdminContentStats {
  total_websites: number;
  total_budgets: number;
  total_guests: number;
  total_registries: number;
}

export interface AdminUser {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'expired' | 'trialing';
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
}

export function useAdmin() {
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null);
  const [subscriptionStats, setSubscriptionStats] = useState<AdminSubscriptionStats[]>([]);
  const [featureUsageStats, setFeatureUsageStats] = useState<AdminFeatureUsageStats[]>([]);
  const [contentStats, setContentStats] = useState<AdminContentStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [userStatsRes, subscriptionStatsRes, featureStatsRes, contentStatsRes] = await Promise.all([
        supabase.from('admin_user_stats').select('*').single(),
        supabase.from('admin_subscription_stats').select('*'),
        supabase.from('admin_feature_usage_stats').select('*'),
        supabase.from('admin_content_stats').select('*').single()
      ]);

      if (userStatsRes.error) throw userStatsRes.error;
      if (subscriptionStatsRes.error) throw subscriptionStatsRes.error;
      if (featureStatsRes.error) throw featureStatsRes.error;
      if (contentStatsRes.error) throw contentStatsRes.error;

      setUserStats({
        total_users: userStatsRes.data?.total_users || 0,
        new_this_month: userStatsRes.data?.new_this_month || 0,
        paid_users: userStatsRes.data?.paid_users || 0,
        admin_users: userStatsRes.data?.admin_users || 0
      });
      
      setSubscriptionStats((subscriptionStatsRes.data || []).map(stat => ({
        subscription_tier: stat.subscription_tier || 'free',
        user_count: stat.user_count || 0,
        percentage: stat.percentage || 0
      })));
      
      setFeatureUsageStats((featureStatsRes.data || []).map(stat => ({
        feature_type: stat.feature_type || 'unknown',
        total_usage: stat.total_usage || 0,
        unique_users: stat.unique_users || 0,
        avg_per_user: stat.avg_per_user || 0
      })));
      
      setContentStats({
        total_websites: contentStatsRes.data?.total_websites || 0,
        total_budgets: contentStatsRes.data?.total_budgets || 0,
        total_guests: contentStatsRes.data?.total_guests || 0,
        total_registries: contentStatsRes.data?.total_registries || 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (search?: string, limit = 50, offset = 0) => {
    try {
      setUsersLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('admin_get_users', {
        p_search: search || undefined,
        p_limit: limit,
        p_offset: offset
      });

      if (error) throw error;
      setUsers((data || []).map(user => ({
        ...user,
        full_name: user.full_name || null,
        username: user.username || null,
        avatar_url: user.avatar_url || null,
        role: user.role || null,
        last_sign_in_at: user.last_sign_in_at || null
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('admin_update_user_role', {
        p_user_id: userId,
        p_new_role: newRole
      });

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      return false;
    }
  };

  const updateUserSubscription = async (userId: string, newTier: 'free' | 'basic' | 'premium' | 'enterprise') => {
    try {
      const { error } = await supabase.rpc('admin_update_user_subscription', {
        p_user_id: userId,
        p_new_tier: newTier
      });

      if (error) throw error;
      
      // Refresh users list and stats
      await Promise.all([fetchUsers(), fetchStats()]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user subscription');
      return false;
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  return {
    userStats,
    subscriptionStats,
    featureUsageStats,
    contentStats,
    users,
    loading,
    usersLoading,
    error,
    fetchStats,
    fetchUsers,
    updateUserRole,
    updateUserSubscription,
    refetch: () => {
      fetchStats();
      fetchUsers();
    }
  };
}