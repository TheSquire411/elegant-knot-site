import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
}

export default function NotificationCenter() {
  const { state, removeNotification } = useApp();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-sage-500" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'info': return 'border-l-blue-500';
      default: return 'border-l-sage-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {state.notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`bg-white border-l-4 ${getBorderColor(notification.type)} rounded-lg shadow-lg p-4 relative`}
          >
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 text-sage-400 hover:text-sage-600"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start space-x-3 pr-6">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-medium text-sage-800">{notification.title}</h4>
                <p className="text-sm text-sage-600 mt-1">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}