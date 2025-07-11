
import React, { useMemo } from 'react';
import WebsitePreviewControls from './preview/WebsitePreviewControls';
import WebsitePreviewFrame from './preview/WebsitePreviewFrame';
import HeroSection from './preview/sections/HeroSection';
import OurStorySection from './preview/sections/OurStorySection';
import ScheduleSection from './preview/sections/ScheduleSection';
import RSVPSection from './preview/sections/RSVPSection';
import FooterSection from './preview/sections/FooterSection';

interface WebsitePreviewProps {
  websiteData: any;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

function WebsitePreview({ websiteData, previewMode, onPreviewModeChange }: WebsitePreviewProps) {
  // Memoize expensive theme calculations
  const safeTheme = useMemo(() => {
    const theme = websiteData?.theme || {};
    
    return {
      colorPalette: theme.colorPalette || {
        primary: theme.colors?.[0] || '#F8BBD9',
        secondary: theme.colors?.[1] || '#D4AF37', 
        accent: theme.colors?.[2] || theme.colors?.[0] || '#F8BBD9',
        background: '#FFFFFF',
        text: '#374151'
      },
      typography: theme.typography || {
        headingFont: theme.fonts?.heading || 'Playfair Display',
        bodyFont: theme.fonts?.body || 'Montserrat',
        headingWeight: 700,
        bodyWeight: 400
      },
      layout: theme.layout || {
        headerStyle: 'classic',
        spacing: 'normal', 
        imageLayout: 'standard'
      }
    };
  }, [websiteData?.theme]);
  
  // Memoize content processing
  const safeContent = useMemo(() => {
    const content = websiteData?.content || {};
    
    return {
      coupleNames: typeof content.coupleNames === 'string' ? content.coupleNames : 'Sarah & Michael',
      weddingDate: typeof content.weddingDate === 'string' ? content.weddingDate : '2024-09-15',
      venue: content.venue || { name: 'Garden Venue', address: '123 Beautiful Street, City, State' },
      ourStory: content.ourStory || { content: 'Our love story begins here...', style: 'romantic', photos: [] },
      schedule: content.schedule || {
        ceremony: { time: '16:00', location: 'Garden Venue' },
        reception: { time: '18:00', location: 'Reception Hall' }
      },
      registry: content.registry || { message: 'Your presence is the only present we need!', stores: [] },
      accommodations: Array.isArray(content.accommodations) ? content.accommodations : [],
      travel: content.travel || {}
    };
  }, [websiteData?.content]);

  // Memoize theme key for stable re-rendering
  const themeKey = useMemo(() => 
    JSON.stringify(safeTheme), 
    [safeTheme]
  );

  return (
    <div key={`preview-${websiteData?.id}-${themeKey}`} className="space-y-6">
      <WebsitePreviewControls 
        previewMode={previewMode}
        onPreviewModeChange={onPreviewModeChange}
      />

      <WebsitePreviewFrame previewMode={previewMode} theme={safeTheme}>
        <HeroSection
          coupleNames={safeContent.coupleNames}
          weddingDate={safeContent.weddingDate}
          venue={safeContent.venue}
          theme={safeTheme}
        />

        <OurStorySection
          story={safeContent.ourStory}
          theme={safeTheme}
        />

        <ScheduleSection
          schedule={safeContent.schedule}
          theme={safeTheme}
        />

        <RSVPSection theme={safeTheme} />

        <FooterSection
          coupleNames={safeContent.coupleNames}
          weddingDate={safeContent.weddingDate}
          theme={safeTheme}
        />
      </WebsitePreviewFrame>

      {/* Custom CSS Preview */}
      {websiteData?.settings?.customCSS && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Applied Custom CSS</h4>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{websiteData.settings.customCSS}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(WebsitePreview, (prevProps, nextProps) => {
  return (
    prevProps.previewMode === nextProps.previewMode &&
    prevProps.websiteData?.id === nextProps.websiteData?.id &&
    JSON.stringify(prevProps.websiteData?.theme) === JSON.stringify(nextProps.websiteData?.theme) &&
    JSON.stringify(prevProps.websiteData?.content) === JSON.stringify(nextProps.websiteData?.content)
  );
});