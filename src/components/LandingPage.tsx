import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthStatus from './Auth/AuthStatus';
import heroImage from '../assets/wedding-hero-bg.jpg';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { state } = useApp();

  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        className="relative h-screen flex items-center justify-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Background Image with dark overlay for text readability */}
        <div className="absolute inset-0 bg-foreground/40 z-10"></div>
        <motion.img 
          src={heroImage} 
          alt="Elegant wedding ceremony setup"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Header with Auth Status - positioned over hero */}
        <motion.header 
          className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-30"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="brand-text text-white">Wedly</h2>
          <div className="text-white">
            <AuthStatus />
          </div>
        </motion.header>
        
        {/* Centered Hero Content */}
        <motion.div 
          className="relative z-20 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="subheading-accent text-white/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          >
            Premium Wedding Planning
          </motion.div>
          <motion.h1 
            className="hero-heading mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
          >
            Your Dream Wedding, Perfectly Planned.
          </motion.h1>
          <motion.p 
            className="hero-subtext max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          >
            From your vision board to your final vows, we bring all your planning tools together in one beautiful place.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
          >
            {state.user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all inline-block"
                >
                  Go to Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link 
                  to="/signup" 
                  className="bg-gradient-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full text-lg transition-all inline-block"
                >
                  Start Planning for Free
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}