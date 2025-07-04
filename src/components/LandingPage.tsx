import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthStatus from './Auth/AuthStatus';

export default function LandingPage() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary-50 to-secondary-100 flex flex-col">
      {/* Header with Auth Status */}
      <header className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground">Wedly</h2>
        <AuthStatus />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl animate-fade-in">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6">
            Your Perfect Wedding Planner
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Turning dreams into reality with AI-powered planning tools
          </p>
          
          {state.user ? (
            <Link 
              to="/dashboard" 
              className="bg-gradient-primary text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all hover:scale-105 inline-block font-medium text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all hover:scale-105 font-medium"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-primary text-foreground px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition-all font-medium"
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