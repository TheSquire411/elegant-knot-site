import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Sparkles } from 'lucide-react';
import Modal from './Modal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName, description }: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={
        <>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Maybe Later
          </button>
          <button 
            onClick={handleUpgrade} 
            className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 font-semibold flex items-center space-x-2"
          >
            <Crown className="h-4 w-4" />
            <span>Upgrade to Pro</span>
          </button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Crown className="h-12 w-12 text-primary" />
          <Sparkles className="h-10 w-10 text-accent" />
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Unlock <span className="text-primary">"{featureName}"</span>
        </h3>
        
        <p className="text-lg text-muted-foreground mb-4">
          This premium feature is available exclusively for{' '}
          <span className="font-semibold text-primary">Wedly Pro</span> members.
        </p>
        
        {description && (
          <p className="text-muted-foreground mb-6">{description}</p>
        )}
        
        <div className="bg-gradient-secondary rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Pro Benefits Include:</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Unlimited AI Assistant conversations</li>
            <li>• Custom domain for your wedding website</li>
            <li>• Unlimited vision boards and photo uploads</li>
            <li>• Advanced RSVP management</li>
            <li>• Priority customer support</li>
          </ul>
        </div>
        
        <p className="text-sm text-muted-foreground">
          One-time payment of <span className="font-bold text-primary">$99</span> • Lifetime access
        </p>
      </div>
    </Modal>
  );
}