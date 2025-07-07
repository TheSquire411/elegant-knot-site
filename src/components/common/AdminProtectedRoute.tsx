import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { hasRole } from '../../utils/security';

function AdminProtectedRoute() {
  const { state } = useApp();
  const location = useLocation();

  // Debug logging
  console.log('AdminProtectedRoute Debug:', {
    isLoading: state.isLoading,
    hasUser: !!state.user,
    hasProfile: !!state.profile,
    profile: state.profile,
    userRole: state.profile?.role,
    hasAdminRole: state.profile ? hasRole(state.profile, 'admin') : false
  });

  // Show loading while checking auth state OR while profile is loading
  if (state.isLoading || (state.user && state.profile === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If the user is not logged in, redirect to dashboard
  if (!state.user) {
    console.log('AdminProtectedRoute: No user - redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Critical fix: Only allow access if user is authenticated AND has admin role
  // This prevents the race condition where profile might be loading
  if (!state.profile || !hasRole(state.profile, 'admin')) {
    console.log('AdminProtectedRoute: User is not admin or profile not loaded - redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If the user is an admin, render the child route's element.
  return <Outlet />;
}

export default AdminProtectedRoute;