import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthStatus from './Auth/AuthStatus';
import heroImage from '../assets/wedding-hero-bg.jpg';

export default function LandingPage() {
  const { state } = useApp();

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center text-center">
        {/* Background Image with dark overlay for text readability */}
        <div className="absolute inset-0 bg-foreground/40 z-10"></div>
        <img 
          src={heroImage} 
          alt="Elegant wedding ceremony setup"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Header with Auth Status - positioned over hero */}
        <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-30">
          <h2 className="brand-text text-white">Wedly</h2>
          <div className="text-white">
            <AuthStatus />
          </div>
        </header>
        
        {/* Centered Hero Content */}
        <div className="relative z-20 px-4 animate-fade-in">
          <div className="subheading-accent text-white/80 mb-4">Premium Wedding Planning</div>
          <h1 className="hero-heading mb-6">
            Your Dream Wedding, Perfectly Planned.
          </h1>
          <p className="hero-subtext max-w-2xl mx-auto mb-8">
            From your vision board to your final vows, we bring all your planning tools together in one beautiful place.
          </p>
          
          {state.user ? (
            <Link 
              to="/dashboard" 
              className="bg-gradient-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              to="/signup" 
              className="bg-gradient-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 inline-block"
            >
              Start Planning for Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}