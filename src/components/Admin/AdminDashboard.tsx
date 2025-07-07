import { Users, CreditCard, Activity, Globe, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import BackButton from '../common/BackButton';
import AdminStatsCard from './AdminStatsCard';
import AdminUserManagement from './AdminUserManagement';

export default function AdminDashboard() {
  const { userStats, subscriptionStats, featureUsageStats, contentStats, loading, error } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sage-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️ Access Denied</div>
          <p className="text-sage-700">{error}</p>
          <BackButton className="mt-4" />
        </div>
      </div>
    );
  }

  const totalRevenue = subscriptionStats.reduce((acc, stat) => {
    const tierPrices = { free: 0, basic: 29, premium: 79, enterprise: 199 };
    return acc + (stat.user_count * (tierPrices[stat.subscription_tier as keyof typeof tierPrices] || 0));
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-xl font-bold text-sage-800">Admin Dashboard</h1>
                <p className="text-sm text-sage-600">Platform management and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={userStats?.total_users || 0}
            subtitle={`${userStats?.new_this_month || 0} new this month`}
            icon={Users}
            trend="up"
          />
          <AdminStatsCard
            title="Paid Users"
            value={userStats?.paid_users || 0}
            subtitle={`${Math.round(((userStats?.paid_users || 0) / (userStats?.total_users || 1)) * 100)}% conversion`}
            icon={CreditCard}
            trend="up"
          />
          <AdminStatsCard
            title="Monthly Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Estimated MRR"
            icon={Activity}
            trend="up"
          />
          <AdminStatsCard
            title="Wedding Websites"
            value={contentStats?.total_websites || 0}
            subtitle={`${contentStats?.total_budgets || 0} budgets created`}
            icon={Globe}
            trend="up"
          />
        </div>

        {/* Subscription Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-sage-800 mb-4">Subscription Tiers</h3>
            <div className="space-y-4">
              {subscriptionStats.map((stat) => (
                <div key={stat.subscription_tier} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      stat.subscription_tier === 'free' ? 'bg-sage-400' :
                      stat.subscription_tier === 'basic' ? 'bg-blue-400' :
                      stat.subscription_tier === 'premium' ? 'bg-primary-400' :
                      'bg-gold-400'
                    }`} />
                    <span className="font-medium text-sage-700 capitalize">{stat.subscription_tier}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sage-800">{stat.user_count}</div>
                    <div className="text-sm text-sage-600">{stat.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-sage-800 mb-4">Feature Usage (This Month)</h3>
            <div className="space-y-4">
              {featureUsageStats.map((stat) => (
                <div key={stat.feature_type} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sage-700 capitalize">{stat.feature_type.replace('_', ' ')}</div>
                    <div className="text-sm text-sage-600">{stat.unique_users} users</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sage-800">{stat.total_usage.toLocaleString()}</div>
                    <div className="text-sm text-sage-600">avg: {Math.round(stat.avg_per_user)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-sage-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/blog/admin"
              className="flex items-center p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors group"
            >
              <FileText className="h-8 w-8 text-primary-500 group-hover:text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-sage-800">Manage Blog</p>
                <p className="text-sm text-sage-600">Create and edit blog posts</p>
              </div>
            </Link>
          </div>
        </div>

        {/* User Management */}
        <AdminUserManagement />
      </div>
    </div>
  );
}