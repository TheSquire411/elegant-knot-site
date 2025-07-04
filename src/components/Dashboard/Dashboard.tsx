import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-4xl font-serif font-bold text-primary-700 mb-8 text-center">
          Wedding Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/planning" className="!bg-white !rounded-lg !shadow-2xl !border-2 !border-gray-300 p-6 hover:!shadow-2xl hover:!border-primary transition-all">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Planning</h2>
            <p className="text-muted-foreground">Organize your wedding timeline</p>
          </Link>
          <Link to="/budget" className="!bg-white !rounded-lg !shadow-2xl !border-2 !border-gray-300 p-6 hover:!shadow-2xl hover:!border-primary transition-all">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Budget</h2>
            <p className="text-muted-foreground">Track your wedding expenses</p>
          </Link>
          <Link to="/chat" className="!bg-white !rounded-lg !shadow-2xl !border-2 !border-gray-300 p-6 hover:!shadow-2xl hover:!border-primary transition-all">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">AI Assistant</h2>
            <p className="text-muted-foreground">Get wedding planning advice</p>
          </Link>
          <Link to="/vision-board" className="!bg-white !rounded-lg !shadow-2xl !border-2 !border-gray-300 p-6 hover:!shadow-2xl hover:!border-primary transition-all">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Vision Board</h2>
            <p className="text-muted-foreground">Visualize your dream wedding</p>
          </Link>
          <Link to="/website" className="!bg-white !rounded-lg !shadow-2xl !border-2 !border-gray-300 p-6 hover:!shadow-2xl hover:!border-primary transition-all">
            <h2 className="text-xl font-semibold text-primary-700 mb-2">Wedding Website</h2>
            <p className="text-muted-foreground">Create your wedding website</p>
          </Link>
        </div>
      </div>
    </div>
  );
}