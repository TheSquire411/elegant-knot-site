import { Save, Globe } from 'lucide-react';
import BackButton from '../common/BackButton';
import { WeddingWebsite } from '../../types';

interface WebsiteManagerHeaderProps {
  website: WeddingWebsite;
  lastSaved: Date | null;
  saving: boolean;
  onSave: () => void;
}

export default function WebsiteManagerHeader({ 
  website, 
  lastSaved, 
  saving, 
  onSave 
}: WebsiteManagerHeaderProps) {
  return (
    <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BackButton className="mr-4" />
          <div className="flex items-center space-x-4">
            <Globe className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-sage-800">{website.title}</h1>
              <p className="text-sm text-sage-600">Wedding Website Builder</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="text-sm text-sage-600">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}