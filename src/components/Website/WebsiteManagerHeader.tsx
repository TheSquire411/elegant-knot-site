import { useState } from 'react';
import { Save, Globe, ExternalLink } from 'lucide-react';
import BackButton from '../common/BackButton';
import { WeddingWebsite } from '../../types';
import PublishWebsiteModal from './PublishWebsiteModal';

interface WebsiteManagerHeaderProps {
  website: WeddingWebsite;
  lastSaved: Date | null;
  saving: boolean;
  onSave: () => void;
  onWebsiteUpdate: (updates: Partial<WeddingWebsite>) => void;
}

export default function WebsiteManagerHeader({ 
  website, 
  lastSaved, 
  saving, 
  onSave,
  onWebsiteUpdate
}: WebsiteManagerHeaderProps) {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  return (
    <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BackButton className="mr-4" />
          <div className="flex items-center space-x-4">
            <Globe className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-sage-800">{website.title}</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-sage-600">Wedding Website Builder</p>
                {website.status === 'published' && website.slug && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Published
                    </span>
                    <a
                      href={`/wedding/${website.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-600 hover:text-sage-800 transition-colors"
                      title="View public website"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="text-sm text-sage-600">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                website.status === 'published'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{website.status === 'published' ? 'Published' : 'Publish'}</span>
            </button>
            
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
      
      
      <PublishWebsiteModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        website={website}
        onPublished={onWebsiteUpdate}
      />
    </div>
  );
}