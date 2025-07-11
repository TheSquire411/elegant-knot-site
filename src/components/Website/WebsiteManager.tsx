import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useWebsiteManager } from '../../hooks/useWebsiteManager';
import WebsiteManagerHeader from './WebsiteManagerHeader';
import WebsiteManagerTabs, { ActiveTab } from './WebsiteManagerTabs';
import WebsiteManagerContent from './WebsiteManagerContent';
import { ErrorBoundary } from '../common/ErrorBoundary';

export default function WebsiteManager() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('templates');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const {
    website,
    loading,
    saving,
    generating,
    lastSaved,
    saveWebsite,
    handleWebsiteUpdate,
    handleTemplateSelect,
    createDefaultWebsite
  } = useWebsiteManager();

  const handleTemplateSelectAndSwitch = async (template: any) => {
    const result = await handleTemplateSelect(template);
    if (result?.shouldSwitchToBuilder) {
      setActiveTab('builder');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sage-700">Loading your wedding website...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 text-sage-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sage-800 mb-2">No Website Found</h2>
          <p className="text-sage-600 mb-6">Let's create your beautiful wedding website</p>
          <button
            onClick={createDefaultWebsite}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Create Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50">
      <WebsiteManagerHeader 
        website={website}
        lastSaved={lastSaved}
        saving={saving}
        onSave={() => saveWebsite()}
        onWebsiteUpdate={handleWebsiteUpdate}
      />

      <WebsiteManagerTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <WebsiteManagerContent
            activeTab={activeTab}
            website={website}
            generating={generating}
            saving={saving}
            previewMode={previewMode}
            onTemplateSelect={handleTemplateSelectAndSwitch}
            onWebsiteUpdate={handleWebsiteUpdate}
            onPreviewModeChange={setPreviewMode}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}