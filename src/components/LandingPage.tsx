import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-serif font-bold text-primary-700 mb-6">
          Blissful
        </h1>
        <p className="text-lg text-sage-700 mb-8">
          Your perfect wedding planner - turning dreams into reality
        </p>
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
      </div>
    </div>
  );
}