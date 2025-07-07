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
        // CRITICAL FIX: Preserve the current theme when updating content
        // This prevents the AI template theme from being overwritten
        const currentWebsite = website;
        handleWebsiteUpdate({ 
          content: updatedContent,
          theme: currentWebsite.theme // Preserve the AI template theme
        });
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
        
        const loadedTheme = parseJsonField(websiteData.theme, defaultData.theme);
        
        // Ensure theme has the complete structured format
        const completeTheme = {
          ...loadedTheme,
          // Ensure structured fields exist
          colorPalette: loadedTheme.colorPalette || {
            primary: loadedTheme.colors?.[0] || '#F8BBD9',
            secondary: loadedTheme.colors?.[1] || '#D4AF37',
            accent: loadedTheme.colors?.[2] || loadedTheme.colors?.[0] || '#F8BBD9',
            background: '#FFFFFF', 
            text: '#374151'
          },
          typography: loadedTheme.typography || {
            headingFont: loadedTheme.fonts?.heading || 'Playfair Display',
            bodyFont: loadedTheme.fonts?.body || 'Montserrat',
            headingWeight: 700,
            bodyWeight: 400
          },
          layout: loadedTheme.layout || {
            headerStyle: 'classic',
            spacing: 'normal',
            imageLayout: 'standard'
          }
        };

        setWebsite({
          ...websiteData,
          slug: websiteData.slug || undefined,
          domain: websiteData.domain || undefined,
          published_at: websiteData.published_at || undefined,
          status: websiteData.status as 'draft' | 'published' | 'archived',
          content: parseJsonField(websiteData.content, defaultData.content),
          theme: completeTheme,
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
    console.log('=== AI Template Selection Started ===');
    console.log('Template selected:', template);
    
    if (!website) {
      console.error('No website found, cannot select template');
      return;
    }

    // Since we only have AI templates now, we know this is an AI template
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

      let templateTheme: WebsiteTheme;

      if (templateData) {
        console.log('✅ Successfully fetched AI template data:', templateData);
        
        const layoutData = templateData.layout as any;
        const colorsData = templateData.colors as any;
        const typographyData = templateData.typography as any;
        
        // Apply AI-generated design data
        templateTheme = {
          style: template.name,
          colors: [
            colorsData?.primary || '#F8BBD9',
            colorsData?.secondary || '#D4AF37',
            colorsData?.accent || '#F8BBD9'
          ],
          fonts: {
            heading: typographyData?.headingFont || 'Playfair Display',
            body: typographyData?.bodyFont || 'Montserrat'
          },
          colorPalette: {
            primary: colorsData?.primary || '#F8BBD9',
            secondary: colorsData?.secondary || '#D4AF37',
            accent: colorsData?.accent || colorsData?.primary || '#F8BBD9',
            background: colorsData?.background || '#FFFFFF',
            text: colorsData?.text || '#374151'
          },
          typography: {
            headingFont: typographyData?.headingFont || 'Playfair Display',
            bodyFont: typographyData?.bodyFont || 'Montserrat',
            headingWeight: typographyData?.headingWeight || 700,
            bodyWeight: typographyData?.bodyWeight || 400
          },
          layout: layoutData || {
            headerStyle: 'classic',
            spacing: 'normal',
            imageLayout: 'standard'
          }
        };
      } else {
        console.warn('No template data returned, using fallback');
        templateTheme = {
          style: template.name,
          colors: template.colors || ['#F8BBD9', '#D4AF37'],
          fonts: {
            heading: 'Playfair Display',
            body: 'Montserrat'
          },
          colorPalette: {
            primary: template.colors?.[0] || '#F8BBD9',
            secondary: template.colors?.[1] || '#D4AF37',
            accent: template.colors?.[2] || '#F8BBD9',
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
      }

      console.log('✅ Final theme to apply:', templateTheme);

      // Update theme immediately for instant preview
      const updatedWebsite = { ...website, theme: templateTheme };
      setWebsite(updatedWebsite);
      
      // Save to database immediately
      saveWebsite({ theme: templateTheme });
      
      // Generate AI content for the template
      console.log('🤖 Starting AI content generation...');
      setGenerating(true);
      generateTemplateContent(template);
      
    } catch (error) {
      console.error('❌ Error fetching AI template data:', error);
    }
    
    console.log('=== AI Template Selection Complete ===');
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
