import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { hasRole } from '../../utils/security';

function AdminProtectedRoute() {
  const { state } = useApp();
  const location = useLocation();

  // Show loading while checking auth state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If the user is not logged in or is not an admin, redirect them.
  if (!state.user || !state.profile || !hasRole(state.profile, 'admin')) {
    // Redirect non-admins to the main dashboard.
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // If the user is an admin, render the child route's element.
  return <Outlet />;
}

export default AdminProtectedRoute;