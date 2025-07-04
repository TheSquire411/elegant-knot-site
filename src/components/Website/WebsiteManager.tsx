import { useState, useEffect } from 'react';
import { Save, Eye, Globe, Settings, Layers, Palette, FileText } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { WeddingWebsite, WebsiteTheme } from '../../types';
import BackButton from '../common/BackButton';
import WebsiteBuilder from './WebsiteBuilder';
import WebsitePreview from './WebsitePreview';
import SectionBuilder from './SectionBuilder';
import TemplateGallery from './TemplateGallery';

type ActiveTab = 'templates' | 'builder' | 'sections' | 'preview' | 'settings';

export default function WebsiteManager() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('templates');
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Default website data structure
  const getDefaultWebsiteData = (): Omit<WeddingWebsite, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
    title: 'Our Wedding',
    status: 'draft',
    content: {
      coupleNames: 'Sarah & Michael',
      weddingDate: '2024-09-15',
      venue: {
        name: 'Garden Venue',
        address: '123 Beautiful Street, City, State'
      },
      ourStory: {
        content: 'Our love story begins here...',
        style: 'romantic',
        photos: []
      },
      schedule: {
        ceremony: {
          time: '16:00',
          location: 'Garden Venue'
        },
        reception: {
          time: '18:00',
          location: 'Reception Hall'
        }
      },
      registry: {
        message: 'Your presence is the only present we need!',
        stores: []
      },
      accommodations: [],
      travel: {}
    },
    theme: {
      style: 'Classic & Elegant',
      colors: ['#F8BBD9', '#D4AF37'],
      fonts: {
        heading: 'Playfair Display',
        body: 'Montserrat'
      }
    },
    settings: {
      features: {
        rsvp: true,
        guestBook: true,
        photoSharing: true
      }
    }
  });

  useEffect(() => {
    loadWebsite();
  }, []);

  const loadWebsite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: websites, error } = await supabase
        .from('wedding_websites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (websites && websites.length > 0) {
        const websiteData = websites[0];
        setWebsite({
          ...websiteData,
          slug: websiteData.slug || undefined,
          domain: websiteData.domain || undefined,
          published_at: websiteData.published_at || undefined,
          status: websiteData.status as 'draft' | 'published' | 'archived',
          content: (websiteData.content as any) || {},
          theme: (websiteData.theme as any) || { colors: [], fonts: { heading: '', body: '' } },
          settings: (websiteData.settings as any) || {}
        });
        setActiveTab('builder');
      } else {
        // Create a default website
        await createDefaultWebsite();
      }
    } catch (error) {
      console.error('Error loading website:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultWebsite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const defaultData = getDefaultWebsiteData();
      
      const { data, error } = await supabase
        .from('wedding_websites')
        .insert([{
          title: defaultData.title,
          status: defaultData.status,
          content: defaultData.content as any,
          theme: defaultData.theme as any,
          settings: defaultData.settings as any,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setWebsite({
        ...data,
        slug: data.slug || undefined,
        domain: data.domain || undefined,
        published_at: data.published_at || undefined,
        status: data.status as 'draft' | 'published' | 'archived',
        content: (data.content as any) || {},
        theme: (data.theme as any) || { colors: [], fonts: { heading: '', body: '' } },
        settings: (data.settings as any) || {}
      });
    } catch (error) {
      console.error('Error creating website:', error);
    }
  };

  const saveWebsite = async (updates?: Partial<WeddingWebsite>) => {
    if (!website) return;

    setSaving(true);
    try {
      const updatedWebsite = updates ? { ...website, ...updates } : website;

      const { error } = await supabase
        .from('wedding_websites')
        .update({
          title: updatedWebsite.title,
          content: updatedWebsite.content as any,
          theme: updatedWebsite.theme as any,
          settings: updatedWebsite.settings as any,
          status: updatedWebsite.status
        })
        .eq('id', website.id);

      if (error) throw error;

      if (updates) {
        setWebsite(updatedWebsite);
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving website:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleWebsiteUpdate = (updates: Partial<WeddingWebsite>) => {
    if (!website) return;
    
    const updatedWebsite = { ...website, ...updates };
    setWebsite(updatedWebsite);
    
    // Auto-save after a delay
    setTimeout(() => {
      saveWebsite(updatedWebsite);
    }, 1000);
  };

  const handleTemplateSelect = (template: any) => {
    if (!website) return;

    const templateTheme: WebsiteTheme = {
      style: template.name,
      colors: template.colors,
      fonts: {
        heading: 'Playfair Display',
        body: 'Montserrat'
      }
    };

    handleWebsiteUpdate({ theme: templateTheme });
    setActiveTab('builder');
  };

  const tabs = [
    { key: 'templates', label: 'Templates', icon: Palette, description: 'Choose a design' },
    { key: 'builder', label: 'Builder', icon: FileText, description: 'Edit content' },
    { key: 'sections', label: 'Sections', icon: Layers, description: 'Manage sections' },
    { key: 'preview', label: 'Preview', icon: Eye, description: 'See your site' },
    { key: 'settings', label: 'Settings', icon: Settings, description: 'Configure site' }
  ];

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
      {/* Header */}
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
                onClick={() => saveWebsite()}
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ActiveTab)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-sage-600 hover:text-sage-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'templates' && (
          <TemplateGallery 
            onSelectTemplate={handleTemplateSelect}
            selectedTemplate={undefined}
          />
        )}

        {activeTab === 'builder' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <WebsiteBuilder
                websiteData={website}
                onUpdate={handleWebsiteUpdate}
                onGenerateStory={() => {}}
                isGenerating={false}
              />
            </div>
            <div className="lg:sticky lg:top-24">
              <WebsitePreview
                websiteData={website}
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
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
                onPreviewModeChange={setPreviewMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <WebsitePreview
            websiteData={website}
            previewMode={previewMode}
            onPreviewModeChange={setPreviewMode}
          />
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-sage-800 mb-6">Website Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Website Title
                  </label>
                  <input
                    type="text"
                    value={website.title}
                    onChange={(e) => handleWebsiteUpdate({ title: e.target.value })}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Website Status
                  </label>
                  <select
                    value={website.status}
                    onChange={(e) => handleWebsiteUpdate({ status: e.target.value as 'draft' | 'published' | 'archived' })}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-sage-800 mb-4">Features</h3>
                  <div className="space-y-3">
                    {Object.entries(website.settings.features || { rsvp: true, guestBook: true, photoSharing: true }).map(([feature, enabled]) => (
                      <label key={feature} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={Boolean(enabled)}
                           onChange={(e) => handleWebsiteUpdate({
                             settings: {
                               ...website.settings,
                               features: {
                                 ...(website.settings.features || { rsvp: true, guestBook: true, photoSharing: true }),
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}