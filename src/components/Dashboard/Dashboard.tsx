import { Calendar, DollarSign, MessageCircle, Palette, Globe } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';

export default function Dashboard() {
  // Debug CSS variables
  console.log('Dashboard component loaded');
  console.log('CSS Variables check:', {
    background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
    primary: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
    secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary'),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent')
  });

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
    <div 
      className="min-h-screen p-4"
      style={{ 
        background: 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)), hsl(var(--primary-50)))',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header with subtle animation */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 
            className="text-5xl font-serif font-bold mb-4"
            style={{ color: 'hsl(var(--primary-700))' }}
          >
            Wedding Dashboard
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            Everything you need to plan your perfect wedding, organized and accessible in one beautiful space
          </p>
          <div 
            className="mt-6 h-1 w-24 mx-auto rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, hsl(var(--primary-500)), hsl(var(--primary-300)))' 
            }}
          ></div>
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
            <div className="text-muted-foreground">Planning Tools</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <div className="text-3xl font-bold text-primary-600 mb-2">∞</div>
            <div className="text-muted-foreground">Possibilities</div>
          </div>
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <div className="text-3xl font-bold text-primary-600 mb-2">1</div>
            <div className="text-muted-foreground">Perfect Day</div>
          </div>
        </div>
      </div>
    </div>
  );
}