import React from 'react';
import { Monitor, Smartphone, ExternalLink, Share2 } from 'lucide-react';

interface WebsitePreviewProps {
  websiteData: any;
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export default function WebsitePreview({ websiteData, previewMode, onPreviewModeChange }: WebsitePreviewProps) {
  // Safe data extraction with fallbacks
  const theme = websiteData?.theme || { colors: ['#F8BBD9', '#D4AF37'], fonts: { heading: 'Playfair Display', body: 'Montserrat' } };
  const content = websiteData?.content || {};
  
  // Ensure theme has required properties with AI template support
  const safeTheme = {
    // Use AI color palette if available, otherwise fall back to colors array
    colors: Array.isArray(theme.colors) && theme.colors.length >= 2 ? theme.colors : ['#F8BBD9', '#D4AF37'],
    fonts: theme.fonts || { heading: 'Playfair Display', body: 'Montserrat' },
    // AI-generated design data
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
  
  // Ensure content has safe string values
  const safeContent = {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Website Preview</h3>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPreviewModeChange('desktop')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewMode === 'desktop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => onPreviewModeChange('mobile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewMode === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Open in New Tab</span>
          </button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="bg-gray-100 rounded-lg p-8 flex justify-center">
        <div
          className={`bg-white shadow-2xl overflow-hidden transition-all ${
            previewMode === 'desktop'
              ? 'w-full max-w-5xl rounded-lg'
              : 'w-80 rounded-2xl border-8 border-gray-800'
          }`}
          style={{
            fontFamily: safeTheme.typography.bodyFont,
            fontWeight: safeTheme.typography.bodyWeight,
            '--primary-color': safeTheme.colorPalette.primary,
            '--secondary-color': safeTheme.colorPalette.secondary,
            '--accent-color': safeTheme.colorPalette.accent,
            '--bg-color': safeTheme.colorPalette.background,
            '--text-color': safeTheme.colorPalette.text
          } as React.CSSProperties}
        >
          {/* Website Content */}
          <div className="overflow-y-auto" style={{ height: previewMode === 'desktop' ? '600px' : '700px' }}>
            {/* Hero Section */}
            <section
              className="relative bg-gradient-to-br from-primary-100 to-secondary-100 text-center py-20 px-6"
              style={{
                background: `linear-gradient(135deg, ${safeTheme.colorPalette.primary}20, ${safeTheme.colorPalette.secondary}20)`
              }}
            >
              <div className="max-w-4xl mx-auto">
                <h1
                  className="text-5xl md:text-7xl mb-6"
                  style={{
                    fontFamily: safeTheme.typography.headingFont,
                    fontWeight: safeTheme.typography.headingWeight,
                    color: safeTheme.colorPalette.primary
                  }}
                >
                  {safeContent.coupleNames}
                </h1>
                <p 
                  className="text-xl md:text-2xl mb-8"
                  style={{ color: safeTheme.colorPalette.text }}
                >
                  {formatDate(safeContent.weddingDate)}
                </p>
                <p 
                  className="text-lg mb-8"
                  style={{ color: safeTheme.colorPalette.text, opacity: 0.8 }}
                >
                  {safeContent.venue.name} • {safeContent.venue.address}
                </p>
                <button
                  className="px-8 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: safeTheme.colorPalette.primary }}
                >
                  RSVP Now
                </button>
              </div>
            </section>

            {/* Our Story Section */}
            {safeContent.ourStory.content && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-3xl md:text-4xl mb-8"
                    style={{
                      fontFamily: safeTheme.typography.headingFont,
                      fontWeight: safeTheme.typography.headingWeight,
                      color: safeTheme.colorPalette.primary
                    }}
                  >
                    Our Story
                  </h2>
                  <div 
                    className="prose prose-lg mx-auto"
                    style={{ color: safeTheme.colorPalette.text }}
                  >
                    <div 
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: safeContent.ourStory.content.includes('<') 
                          ? safeContent.ourStory.content 
                          : `<p>${safeContent.ourStory.content}</p>`
                      }}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Schedule Section */}
            <section className="py-16 px-6 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-3xl md:text-4xl text-center mb-12"
                  style={{
                    fontFamily: safeTheme.typography.headingFont,
                    fontWeight: safeTheme.typography.headingWeight,
                    color: safeTheme.colorPalette.primary
                  }}
                >
                  Schedule
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: safeTheme.colorPalette.primary }}>
                      Ceremony
                    </h3>
                    <p 
                      className="text-lg font-medium mb-2"
                      style={{ color: safeTheme.colorPalette.text }}
                    >
                      {formatTime(safeContent.schedule.ceremony.time)}
                    </p>
                    <p style={{ color: safeTheme.colorPalette.text, opacity: 0.7 }}>{safeContent.schedule.ceremony.location}</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: safeTheme.colorPalette.primary }}>
                      Reception
                    </h3>
                    <p 
                      className="text-lg font-medium mb-2"
                      style={{ color: safeTheme.colorPalette.text }}
                    >
                      {formatTime(safeContent.schedule.reception.time)}
                    </p>
                    <p style={{ color: safeTheme.colorPalette.text, opacity: 0.7 }}>{safeContent.schedule.reception.location}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Registry Section */}
            {safeContent.registry.stores.length > 0 && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h2
                    className="text-3xl md:text-4xl font-bold mb-8"
                    style={{
                      fontFamily: safeTheme.fonts.heading,
                      color: safeTheme.colors[0]
                    }}
                  >
                    Registry
                  </h2>
                  <p className="text-lg text-gray-700 mb-8">{safeContent.registry.message}</p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {safeContent.registry.stores.map((store: any, index: number) => (
                      <a
                        key={index}
                        href={store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                        style={{ borderColor: safeTheme.colors[1] }}
                      >
                        <span className="font-semibold" style={{ color: safeTheme.colors[0] }}>
                          {store.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Accommodations Section */}
            {safeContent.accommodations.length > 0 && (
              <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                    style={{
                      fontFamily: safeTheme.fonts.heading,
                      color: safeTheme.colors[0]
                    }}
                  >
                    Accommodations
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {safeContent.accommodations.map((hotel: any, index: number) => (
                      <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: safeTheme.colors[0] }}>
                          {hotel.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{hotel.address}</p>
                        <p className="text-gray-600 mb-2">{hotel.phone}</p>
                        <p className="font-semibold text-gray-800 mb-3">{hotel.rate}</p>
                        {hotel.website && (
                          <a
                            href={hotel.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: safeTheme.colors[0] }}
                          >
                            Book Now
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Travel Section */}
            {(safeContent.travel.airport || safeContent.travel.directions || safeContent.travel.parking) && (
              <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                  <h2
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                    style={{
                      fontFamily: safeTheme.fonts.heading,
                      color: safeTheme.colors[0]
                    }}
                  >
                    Travel & Directions
                  </h2>
                  <div className="space-y-8">
                    {safeContent.travel.airport && (
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: safeTheme.colors[0] }}>
                          Nearest Airport
                        </h3>
                        <p className="text-gray-700">{safeContent.travel.airport}</p>
                      </div>
                    )}
                    {safeContent.travel.directions && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4" style={{ color: safeTheme.colors[0] }}>
                          Directions
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{safeContent.travel.directions}</p>
                      </div>
                    )}
                    {safeContent.travel.parking && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4" style={{ color: safeTheme.colors[0] }}>
                          Parking
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{safeContent.travel.parking}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* RSVP Section */}
            <section
              className="py-16 px-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${safeTheme.colorPalette.primary}10, ${safeTheme.colorPalette.secondary}10)`
              }}
            >
              <div className="max-w-2xl mx-auto">
                <h2
                  className="text-3xl md:text-4xl mb-8"
                  style={{
                    fontFamily: safeTheme.typography.headingFont,
                    fontWeight: safeTheme.typography.headingWeight,
                    color: safeTheme.colorPalette.primary
                  }}
                >
                  RSVP
                </h2>
                <p 
                  className="text-lg mb-8"
                  style={{ color: safeTheme.colorPalette.text }}
                >
                  Please let us know if you'll be joining us for our special day!
                </p>
                <button
                  className="px-8 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: safeTheme.colorPalette.primary }}
                >
                  RSVP Now
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-800 text-white text-center">
              <p className="mb-2">
                {safeContent.coupleNames}
              </p>
              <p className="text-gray-400">
                {formatDate(safeContent.weddingDate)}
              </p>
            </footer>
          </div>
        </div>
      </div>

      {/* Custom CSS Preview */}
      {websiteData.customCSS && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-2">Applied Custom CSS</h4>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{websiteData.customCSS}</code>
          </pre>
        </div>
      )}
    </div>
  );
}