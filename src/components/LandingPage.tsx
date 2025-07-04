import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthStatus from './Auth/AuthStatus';

export default function LandingPage() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex flex-col">
      {/* Header with Auth Status */}
      <header className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-serif font-bold text-primary-700">Wedly</h2>
        <AuthStatus />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-serif font-bold text-primary-700 mb-6">
            Your Perfect Wedding Planner
          </h1>
          <p className="text-lg text-sage-700 mb-8">
            Turning dreams into reality with AI-powered planning tools
          </p>
          
          {state.user ? (
            <Link 
              to="/dashboard" 
              className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="border border-primary-500 text-primary-700 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}