import { WeddingWebsite } from '../../types';
import { ActiveTab } from './WebsiteManagerTabs';
import TemplateGallery from './TemplateGallery';
import WebsiteBuilder from './WebsiteBuilder';
import WebsitePreview from './WebsitePreview';
import SectionBuilder from './SectionBuilder';

interface WebsiteManagerContentProps {
  activeTab: ActiveTab;
  website: WeddingWebsite;
  generating: boolean;
  saving?: boolean;
  previewMode: 'desktop' | 'mobile';
  onTemplateSelect: (template: any) => void;
  onWebsiteUpdate: (updates: Partial<WeddingWebsite>) => void;
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export default function WebsiteManagerContent({
  activeTab,
  website,
  generating,
  saving = false,
  previewMode,
  onTemplateSelect,
  onWebsiteUpdate,
  onPreviewModeChange
}: WebsiteManagerContentProps) {
  if (activeTab === 'templates') {
    return (
      <div className="relative">
        <TemplateGallery 
          onSelectTemplate={onTemplateSelect}
          selectedTemplate={undefined}
        />
        {generating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sage-700 font-medium">Generating personalized content...</p>
              <p className="text-sage-600 text-sm">Creating unique content for your template</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'builder') {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <WebsiteBuilder
            websiteData={website}
            onUpdate={onWebsiteUpdate}
            isGenerating={generating}
            isSaving={saving}
          />
        </div>
        <div className="lg:sticky lg:top-24">
          <WebsitePreview
            websiteData={website}
            previewMode={previewMode}
            onPreviewModeChange={onPreviewModeChange}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'sections') {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionBuilder
            sections={[]}
            onUpdateSections={() => {}}
            inspirationImages={[]}
          />
        </div>
        <div className="lg:sticky lg:top-24">
          <WebsitePreview
            websiteData={website}
            previewMode={previewMode}
            onPreviewModeChange={onPreviewModeChange}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'preview') {
    return (
      <WebsitePreview
        websiteData={website}
        previewMode={previewMode}
        onPreviewModeChange={onPreviewModeChange}
      />
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-sage-800 mb-6">Website Settings</h2>
          
          <div className="space-y-8">
            {/* Publishing Status */}
            <div className="bg-sage-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">Publishing Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sage-700">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    website.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : website.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                  </span>
                </div>
                
                {website.status === 'published' && website.slug && (
                  <div className="flex items-center justify-between">
                    <span className="text-sage-700">Public URL:</span>
                    <a
                      href={`/wedding/${website.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {window.location.origin}/wedding/{website.slug}
                    </a>
                  </div>
                )}
                
                {website.published_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sage-700">Published:</span>
                    <span className="text-sage-600">
                      {new Date(website.published_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Settings */}
            <div>
              <h3 className="text-lg font-semibold text-sage-800 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Website Title
                  </label>
                  <input
                    type="text"
                    value={website.title}
                    onChange={(e) => onWebsiteUpdate({ title: e.target.value })}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {website.slug && (
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Website URL
                    </label>
                    <div className="text-sm text-sage-600 bg-sage-50 px-4 py-3 rounded-lg">
                      {window.location.origin}/wedding/{website.slug}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-sage-800 mb-4">Website Features</h3>
              <div className="space-y-3">
                {Object.entries(website?.settings?.features || { rsvp: true, guestBook: true, photoSharing: true }).map(([feature, enabled]) => (
                  <label key={feature} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={Boolean(enabled)}
                      onChange={(e) => onWebsiteUpdate({
                        settings: {
                          ...website.settings,
                          features: {
                            ...(website?.settings?.features || { rsvp: true, guestBook: true, photoSharing: true }),
                            [feature]: e.target.checked
                          }
                        }
                      })}
                      className="rounded border-sage-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sage-700 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div>
              <h3 className="text-lg font-semibold text-sage-800 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={website?.settings?.seoTitle || ''}
                    onChange={(e) => onWebsiteUpdate({
                      settings: {
                        ...website.settings,
                        seoTitle: e.target.value
                      }
                    })}
                    placeholder="Custom title for search engines"
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={website?.settings?.seoDescription || ''}
                    onChange={(e) => onWebsiteUpdate({
                      settings: {
                        ...website.settings,
                        seoDescription: e.target.value
                      }
                    })}
                    placeholder="Brief description for search engines and social media"
                    rows={3}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}