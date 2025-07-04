import { Calendar, DollarSign, MessageCircle, Palette, Globe } from 'lucide-react';
import DashboardCard from '../common/DashboardCard';

export default function Dashboard() {
  const dashboardItems = [
    {
      to: '/planning',
      title: 'Planning',
      description: 'Organize your wedding timeline',
      icon: <Calendar className="h-8 w-8 text-primary-500" />
    },
    {
      to: '/budget',
      title: 'Budget',
      description: 'Track your wedding expenses',
      icon: <DollarSign className="h-8 w-8 text-green-500" />
    },
    {
      to: '/chat',
      title: 'AI Assistant',
      description: 'Get wedding planning advice',
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />
    },
    {
      to: '/vision-board',
      title: 'Vision Board',
      description: 'Visualize your dream wedding',
      icon: <Palette className="h-8 w-8 text-purple-500" />
    },
    {
      to: '/website',
      title: 'Wedding Website',
      description: 'Create your wedding website',
      icon: <Globe className="h-8 w-8 text-pink-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-4xl font-serif font-bold text-primary-700 mb-8 text-center">
          Wedding Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard
              key={item.to}
              to={item.to}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}