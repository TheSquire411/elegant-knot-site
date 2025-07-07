import { Link } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  to: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}

export default function DashboardCard({ 
  to, 
  title, 
  description, 
  icon, 
  className = '',
  variant = 'default'
}: DashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-glass backdrop-blur-glass border border-white/20 shadow-glass hover:shadow-glass-lg hover:bg-white/30';
      case 'gradient':
        return 'shadow-lg hover:shadow-xl border hover:border-primary/30';
      default:
        return 'shadow-lg hover:shadow-xl border hover:border-primary/50';
    }
  };

  const iconVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-sm border border-white/30';
      case 'gradient':
        return 'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200';
      default:
        return 'bg-primary-50 border border-primary-100';
    }
  };

  return (
    <Link to={to}>
      <motion.div
        className={`
          group relative overflow-hidden rounded-xl p-6 h-full flex flex-col
          ${getVariantClasses()}
          ${className}
        `}
        style={{ 
          backgroundColor: variant === 'gradient' ? 'hsl(var(--background))' : variant === 'default' ? 'hsl(var(--background))' : undefined,
          borderColor: 'hsl(var(--border))'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Glass shimmer effect */}
        {variant === 'glass' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-start space-x-4">
          {/* Icon Container */}
          {icon && (
            <motion.div 
              className={`
                flex-shrink-0 p-3 rounded-xl transition-all duration-300
                ${iconVariantClasses()}
              `}
              whileHover={{ 
                scale: 1.1, 
                rotate: 3,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
                {icon}
              </div>
            </motion.div>
          )}

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <motion.h2 
              className="section-heading text-xl mb-2 transition-colors duration-300 group-hover:text-primary-800"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="elegant-text text-sm transition-colors duration-300 group-hover:text-foreground"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              {description}
            </motion.p>
          </div>

          {/* Hover Arrow */}
          <motion.div 
            className="flex-shrink-0 text-primary-400"
            animate={{ 
              x: isHovered ? 4 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* Gradient Overlay for Depth */}
        {variant === 'gradient' && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent rounded-xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </Link>
  );
}