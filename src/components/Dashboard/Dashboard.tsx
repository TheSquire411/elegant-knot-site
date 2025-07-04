import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-4xl font-serif font-bold text-primary-700 mb-8 text-center">
          Wedding Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/planning" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Planning</h2>
            <p className="text-sage-600">Organize your wedding timeline</p>
          </Link>
          <Link to="/budget" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Budget</h2>
            <p className="text-sage-600">Track your wedding expenses</p>
          </Link>
          <Link to="/chat" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">AI Assistant</h2>
            <p className="text-sage-600">Get wedding planning advice</p>
          </Link>
          <Link to="/vision-board" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Vision Board</h2>
            <p className="text-sage-600">Visualize your dream wedding</p>
          </Link>
          <Link to="/website" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Wedding Website</h2>
            <p className="text-sage-600">Create your wedding website</p>
          </Link>
        </div>
      </div>
    </div>
  );
}