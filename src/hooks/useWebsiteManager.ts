import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { WeddingWebsite, WebsiteTheme } from '../types';
import { useDeepseek } from './useDeepseek';
import { getDefaultWebsiteData } from '../constants/websiteDefaults';

export function useWebsiteManager() {
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { generateTemplateContent } = useDeepseek({
    onSuccess: (generatedContent) => {
      console.log('AI generation successful, received:', generatedContent);
      if (!website) {
        console.log('No website found in success callback');
        return;
      }
      
      try {
        // Merge AI-generated content with existing website data
        const updatedContent = {
          ...website.content,
          coupleNames: generatedContent.coupleNames || 'Alex & Taylor',
          ourStory: {
            content: generatedContent.ourStory ? 
              `${generatedContent.ourStory.paragraph1} ${generatedContent.ourStory.paragraph2}` : 
              'Our love story begins here...',
            style: 'romantic' as const,
            photos: []
          },
          schedule: {
            ceremony: {
              time: generatedContent.ceremonyDetails?.time || '4:00 PM',
              location: generatedContent.ceremonyDetails?.location || 'Beautiful Venue'
            },
            reception: {
              time: generatedContent.receptionDetails?.time || '6:00 PM',
              location: generatedContent.receptionDetails?.location || 'Reception Hall'
            }
          },
          registry: {
            message: generatedContent.registryMessage || 'Your presence is the only present we need!',
            stores: []
          }
        };

        console.log('Updated content:', updatedContent);
        handleWebsiteUpdate({ content: updatedContent });
        setGenerating(false);
      } catch (error) {
        console.error('Error processing AI content:', error);
        setGenerating(false);
      }
    },
    onError: (error) => {
      console.error('Template content generation failed:', error);
      setGenerating(false);
    }
  });

  useEffect(() => {
    loadWebsite();
  }, []);

  const parseJsonField = (field: any, fallback: any) => {
    if (!field) return fallback;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return field;
  };

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
        const defaultData = getDefaultWebsiteData();
        
        setWebsite({
          ...websiteData,
          slug: websiteData.slug || undefined,
          domain: websiteData.domain || undefined,
          published_at: websiteData.published_at || undefined,
          status: websiteData.status as 'draft' | 'published' | 'archived',
          content: parseJsonField(websiteData.content, defaultData.content),
          theme: parseJsonField(websiteData.theme, defaultData.theme),
          settings: parseJsonField(websiteData.settings, defaultData.settings)
        });
      } else {
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
        content: parseJsonField(data.content, getDefaultWebsiteData().content),
        theme: parseJsonField(data.theme, getDefaultWebsiteData().theme),
        settings: parseJsonField(data.settings, getDefaultWebsiteData().settings)
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

  const handleTemplateSelect = async (template: any) => {
    console.log('=== Template Selection Started ===');
    console.log('Template selected:', template);
    console.log('Template ID:', template.id);
    console.log('Template ID type:', typeof template.id);
    
    if (!website) {
      console.error('No website found, cannot select template');
      return;
    }

    // Helper function to check if ID is a UUID format
    const isUUID = (id: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };
    
    // Check if this is an AI-generated template (has UUID format ID)
    const isAITemplate = template.id && typeof template.id === 'string' && isUUID(template.id);
    console.log('Is AI Template:', isAITemplate);

    // Start with basic template structure  
    let templateTheme: WebsiteTheme = {
      style: template.name,
      colors: template.colors || ['#F8BBD9', '#D4AF37'],
      fonts: {
        heading: 'Playfair Display',
        body: 'Montserrat'
      },
      // Initialize with default structured data
      colorPalette: {
        primary: template.colors?.[0] || '#F8BBD9',
        secondary: template.colors?.[1] || '#D4AF37',
        accent: template.colors?.[2] || template.colors?.[0] || '#F8BBD9',
        background: '#FFFFFF',
        text: '#374151'
      },
      typography: {
        headingFont: 'Playfair Display',
        bodyFont: 'Montserrat',
        headingWeight: 700,
        bodyWeight: 400
      },
      layout: {
        headerStyle: 'classic',
        spacing: 'normal',
        imageLayout: 'standard'
      }
    };

    // If this is an AI-generated template, fetch full design data from database
    if (isAITemplate) {
      console.log('Fetching AI template data from database...');
      try {
        const { data: templateData, error } = await supabase
          .from('website_templates')
          .select('layout, colors, typography')
          .eq('id', template.id)
          .single();

        if (error) {
          console.error('Database error fetching template:', error);
          throw error;
        }

        if (templateData) {
          console.log('✅ Successfully fetched AI template data:', templateData);
          
          // Safely cast and validate the data
          const layoutData = templateData.layout as any;
          const colorsData = templateData.colors as any;
          const typographyData = templateData.typography as any;
          
          console.log('Colors data:', colorsData);
          console.log('Typography data:', typographyData);
          console.log('Layout data:', layoutData);
          
          // Apply AI-generated design data
          templateTheme.colorPalette = {
            primary: colorsData?.primary || '#F8BBD9',
            secondary: colorsData?.secondary || '#D4AF37',
            accent: colorsData?.accent || colorsData?.primary || '#F8BBD9',
            background: colorsData?.background || '#FFFFFF',
            text: colorsData?.text || '#374151'
          };
          
          templateTheme.typography = {
            headingFont: typographyData?.headingFont || 'Playfair Display',
            bodyFont: typographyData?.bodyFont || 'Montserrat',
            headingWeight: typographyData?.headingWeight || 700,
            bodyWeight: typographyData?.bodyWeight || 400
          };
          
          templateTheme.layout = layoutData || {
            headerStyle: 'classic',
            spacing: 'normal',
            imageLayout: 'standard'
          };
          
          // Update backward compatibility fields
          templateTheme.fonts = {
            heading: templateTheme.typography.headingFont || 'Playfair Display',
            body: templateTheme.typography.bodyFont || 'Montserrat'
          };
          
          templateTheme.colors = [
            templateTheme.colorPalette.primary || '#F8BBD9',
            templateTheme.colorPalette.secondary || '#D4AF37',
            templateTheme.colorPalette.accent || '#F8BBD9'
          ];
        } else {
          console.warn('No template data returned from database');
        }
      } catch (error) {
        console.error('❌ Error fetching AI template data:', error);
        // Continue with basic template data but show user feedback
        console.log('Continuing with basic template structure...');
      }
    }

    console.log('✅ Final theme to apply:', templateTheme);

    // Update theme immediately for instant preview - single state update
    console.log('📝 Updating website theme...');
    const updatedWebsite = { ...website, theme: templateTheme };
    console.log('📝 Final website state:', updatedWebsite);
    
    // Single immediate state update
    setWebsite(updatedWebsite);
    
    // Save to database immediately after state update
    saveWebsite({ theme: templateTheme });
    
    // Generate AI content for the template (this happens in background)
    if (isAITemplate || generateTemplateContent) {
      console.log('🤖 Starting AI content generation for template:', template.name);
      setGenerating(true);
      generateTemplateContent(template);
    }
    
    console.log('=== Template Selection Complete ===');

    return { shouldSwitchToBuilder: true };
  };

  return {
    website,
    loading,
    saving,
    generating,
    lastSaved,
    loadWebsite,
    createDefaultWebsite,
    saveWebsite,
    handleWebsiteUpdate,
    handleTemplateSelect
  };
}
