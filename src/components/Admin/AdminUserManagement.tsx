import { useState, useMemo, useCallback } from 'react';
import { Search, UserCog, Crown, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin, AdminUser } from '../../hooks/useAdmin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminUserManagement() {
  const { 
    users, 
    totalUsers, 
    currentPage, 
    pageSize, 
    usersLoading, 
    fetchUsers, 
    updateUserRole, 
    updateUserSubscription 
  } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Debounced search handler
  const handleSearch = useCallback(
    useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        setSearchTerm(value);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          fetchUsers(value, 1, pageSize);
        }, 300);
      };
    }, [fetchUsers, pageSize]),
    [fetchUsers, pageSize]
  );

  const handlePageChange = (page: number) => {
    fetchUsers(searchTerm, page, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    fetchUsers(searchTerm, 1, newSize);
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      setSelectedUser(null);
    }
  };

  const handleSubscriptionUpdate = async (userId: string, newTier: 'free' | 'basic' | 'premium' | 'enterprise') => {
    const success = await updateUserSubscription(userId, newTier);
    if (success) {
      setSelectedUser(null);
    }
  };

  const getRoleIcon = (role: string | null) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-gold-500" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <UserCog className="h-4 w-4 text-sage-500" />;
    }
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-gold-100 text-gold-800 border-gold-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-sage-100 text-sage-800 border-sage-200';
    }
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'basic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-sage-100 text-sage-800 border-sage-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-sage-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sage-800">User Management</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sage-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="p-6">
        {usersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sage-600">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-sage-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">User</th>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">Subscription</th>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-sage-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-sage-100 hover:bg-sage-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                            ) : (
                              <span className="text-primary-600 font-medium">
                                {(user.full_name || user.username || 'U')[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sage-800">
                              {user.full_name || user.username || 'Unnamed User'}
                            </div>
                            <div className="text-sm text-sage-600">{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                            {user.role || 'user'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSubscriptionBadgeColor(user.subscription_tier)}`}>
                          {user.subscription_tier}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-sage-600">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="py-4 px-4 text-sm text-sage-600">
                        {user.last_sign_in_at 
                          ? formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true })
                          : 'Never'
                        }
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalUsers > 0 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-sage-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-3 py-1 border border-sage-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center px-3 py-2 text-sm border border-sage-300 rounded-lg hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, Math.ceil(totalUsers / pageSize)) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > Math.ceil(totalUsers / pageSize)) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg ${
                            pageNum === currentPage
                              ? 'bg-primary-500 text-white'
                              : 'border border-sage-300 hover:bg-sage-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                    className="flex items-center px-3 py-2 text-sm border border-sage-300 rounded-lg hover:bg-sage-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-sage-800 mb-4">
              Manage {selectedUser.full_name || selectedUser.username}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Role</label>
                <select
                  value={selectedUser.role || 'user'}
                  onChange={(e) => handleRoleUpdate(selectedUser.user_id, e.target.value)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">Subscription Tier</label>
                <select
                  value={selectedUser.subscription_tier}
                  onChange={(e) => handleSubscriptionUpdate(selectedUser.user_id, e.target.value as any)}
                  className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-sage-600 hover:text-sage-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}