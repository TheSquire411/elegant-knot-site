import { useApp } from '../../context/AppContext';
import { User, LogOut } from 'lucide-react';

export default function AuthStatus() {
  const { state, signOut } = useApp();

  if (state.isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="flex items-center space-x-3">
        <a
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Sign Up
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          {state.profile?.avatar_url ? (
            <img
              src={state.profile.avatar_url}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-primary-600" />
          )}
        </div>
        <div className="text-sm">
          <p className="text-gray-900 font-medium">
            {state.profile?.full_name || state.profile?.username || state.user.email}
          </p>
          {state.profile?.role && (
            <p className="text-gray-500 text-xs capitalize">{state.profile.role}</p>
          )}
        </div>
      </div>
      <button
        onClick={signOut}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">Sign out</span>
      </button>
    </div>
  );
}