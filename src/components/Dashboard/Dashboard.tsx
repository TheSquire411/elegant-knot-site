import { Calendar, DollarSign, MessageCircle, Palette, Globe, Gift } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DashboardCard from '../common/DashboardCard';
import PaymentVerification from './PaymentVerification';
import AuthStatus from '../Auth/AuthStatus';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  
  // Check if we're handling payment verification
  const paymentStatus = searchParams.get('payment');
  if (paymentStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <PaymentVerification />
        </div>
      </div>
    );
  }
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
    },
    {
      to: '/registry',
      title: 'Gift Registry',
      description: 'Create and manage your wedding gift registry for guests',
      icon: <Gift className="h-8 w-8" />,
      variant: 'default' as const,
      delay: 500
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
      {/* Header with AuthStatus */}
      <div className="max-w-6xl mx-auto pt-4 pb-4">
        <div className="flex justify-end">
          <AuthStatus />
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8">
        {/* Header with subtle animation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="subheading-accent text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Your Wedding Journey
          </motion.div>
          <motion.h1 
            className="section-heading text-primary-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            Wedding Dashboard
          </motion.h1>
          <motion.p 
            className="elegant-text max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            Everything you need to plan your perfect wedding, organized and accessible in one beautiful space
          </motion.p>
          <motion.div 
            className="mt-6 h-1 w-24 mx-auto rounded-full"
            style={{ 
              background: 'linear-gradient(90deg, hsl(var(--primary-500)), hsl(var(--primary-300)))' 
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          ></motion.div>
        </motion.div>

        {/* Enhanced Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
        >
          {dashboardItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.2 + (index * 0.1), 
                duration: 0.6, 
                ease: "easeOut" 
              }}
              className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
            >
              <DashboardCard
                to={item.to}
                title={item.title}
                description={item.description}
                icon={item.icon}
                variant={item.variant}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats or Additional Info */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
        >
          {[
            { number: "6", label: "Planning Tools" },
            { number: "∞", label: "Possibilities" },
            { number: "1", label: "Perfect Day" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 2.0 + (index * 0.1), 
                duration: 0.5, 
                ease: "easeOut" 
              }}
              whileHover={{ 
                scale: 1.05, 
                transition: { type: "spring", stiffness: 300, damping: 20 } 
              }}
            >
              <motion.div 
                className="text-3xl font-bold text-primary-600 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 2.2 + (index * 0.1), 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}