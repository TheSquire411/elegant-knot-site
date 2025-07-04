import { Calendar, DollarSign, MessageCircle, Palette, Globe } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';

export default function Dashboard() {
  const dashboardItems = [
    {
      to: '/planning',
      title: 'Planning',
      description: 'Organize your wedding timeline and coordinate with vendors',
      icon: <Calendar className="h-8 w-8" />,
      variant: 'gradient' as const,
      delay: 0
    },
    {
      to: '/budget',
      title: 'Budget',
      description: 'Track expenses and manage your wedding budget effectively',
      icon: <DollarSign className="h-8 w-8" />,
      variant: 'glass' as const,
      delay: 100
    },
    {
      to: '/chat',
      title: 'AI Assistant',
      description: 'Get personalized wedding planning advice and recommendations',
      icon: <MessageCircle className="h-8 w-8" />,
      variant: 'default' as const,
      delay: 200
    },
    {
      to: '/vision-board',
      title: 'Vision Board',
      description: 'Create and visualize your dream wedding aesthetic',
      icon: <Palette className="h-8 w-8" />,
      variant: 'gradient' as const,
      delay: 300
    },
    {
      to: '/website',
      title: 'Wedding Website',
      description: 'Build a beautiful website to share with your guests',
      icon: <Globe className="h-8 w-8" />,
      variant: 'glass' as const,
      delay: 400
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-primary-50/30 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header with subtle animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-serif font-bold text-primary-700 mb-4 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 bg-clip-text text-transparent">
            Wedding Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to plan your perfect wedding, organized and accessible in one beautiful space
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-primary-500 to-primary-300 mx-auto rounded-full"></div>
        </div>

        {/* Enhanced Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={item.to}
              to={item.to}
              title={item.title}
              description={item.description}
              icon={item.icon}
              variant={item.variant}
              animationDelay={item.delay}
              className={`
                ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                ${index === dashboardItems.length - 1 && dashboardItems.length % 3 === 0 ? 'lg:col-start-2' : ''}
              `}
            />
          ))}
        </div>

        {/* Quick Stats or Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
            <div className="text-gray-600">Planning Tools</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <div className="text-3xl font-bold text-primary-600 mb-2">∞</div>
            <div className="text-gray-600">Possibilities</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <div className="text-3xl font-bold text-primary-600 mb-2">1</div>
            <div className="text-gray-600">Perfect Day</div>
          </div>
        </div>
      </div>
    </div>
  );
}