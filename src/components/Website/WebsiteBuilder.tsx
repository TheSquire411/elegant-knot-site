import { useState } from 'react';
import { Palette, Image, Calendar, Save, Edit3 } from 'lucide-react';
import ThemeSection from './sections/ThemeSection';
import ContentSection from './sections/ContentSection';
import PhotosSection from './sections/PhotosSection';
import DetailsSection from './sections/DetailsSection';

interface WebsiteBuilderProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
  isGenerating: boolean;
}

export default function WebsiteBuilder({ websiteData, onUpdate, isGenerating }: WebsiteBuilderProps) {
  const [activeSection, setActiveSection] = useState<'theme' | 'content' | 'photos' | 'details'>('theme');

  return (
    <div className="space-y-8">
      {/* Section Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'theme', label: 'Theme & Style', icon: Palette },
          { key: 'content', label: 'Content', icon: Edit3 },
          { key: 'photos', label: 'Photos', icon: Image },
          { key: 'details', label: 'Event Details', icon: Calendar }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeSection === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Render active section */}
      {activeSection === 'theme' && (
        <ThemeSection websiteData={websiteData} onUpdate={onUpdate} />
      )}

      {activeSection === 'content' && (
        <ContentSection 
          websiteData={websiteData} 
          onUpdate={onUpdate} 
          isGenerating={isGenerating}
        />
      )}

      {activeSection === 'photos' && (
        <PhotosSection websiteData={websiteData} onUpdate={onUpdate} />
      )}

      {activeSection === 'details' && (
        <DetailsSection websiteData={websiteData} onUpdate={onUpdate} />
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={() => onUpdate({})}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}