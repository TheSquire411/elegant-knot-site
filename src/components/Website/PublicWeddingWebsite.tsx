import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Heart, Clock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { WeddingWebsite } from '../../types';
import { errorHandler } from '../../utils/errorHandling';

export default function PublicWeddingWebsite() {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadWebsite(slug);
    }
  }, [slug]);

  const loadWebsite = async (websiteSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('wedding_websites')
        .select('*')
        .eq('slug', websiteSlug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Wedding website not found or not published yet.');
        } else {
          throw error;
        }
        return;
      }

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

      setWebsite({
        ...data,
        slug: data.slug || undefined,
        domain: data.domain || undefined,
        published_at: data.published_at || undefined,
        status: data.status as 'draft' | 'published' | 'archived',
        content: parseJsonField(data.content, {}),
        theme: parseJsonField(data.theme, {}),
        settings: parseJsonField(data.settings, {})
      });
    } catch (err) {
      console.error('Error loading wedding website:', err);
      setError('Failed to load wedding website. Please try again later.');
      errorHandler.handle(err, {
        context: 'Public Wedding Website - Load',
        showToUser: false,
        severity: 'medium'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary-500 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading wedding website...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Website Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'This wedding website could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  const theme = website.theme;
  const content = website.content;
  const primaryColor = theme.colorPalette?.primary || theme.colors?.[0] || '#F8BBD9';
  const secondaryColor = theme.colorPalette?.secondary || theme.colors?.[1] || '#D4AF37';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-50">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Heart 
            className="h-16 w-16 mx-auto mb-6 animate-pulse"
            style={{ color: primaryColor }}
          />
          <h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{ 
              fontFamily: theme.typography?.headingFont || theme.fonts?.heading || 'serif',
              color: primaryColor
            }}
          >
            {content.coupleNames || 'Our Wedding'}
          </h1>
          {content.weddingDate && (
            <p 
              className="text-xl md:text-2xl mb-8"
              style={{ 
                fontFamily: theme.typography?.bodyFont || theme.fonts?.body || 'sans-serif',
                color: secondaryColor
              }}
            >
              {new Date(content.weddingDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </section>

      {/* Our Story Section */}
      {content.ourStory?.content && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-8"
              style={{ 
                fontFamily: theme.typography?.headingFont || theme.fonts?.heading || 'serif',
                color: primaryColor
              }}
            >
              Our Story
            </h2>
            <div 
              className="text-lg leading-relaxed text-center max-w-3xl mx-auto"
              style={{ 
                fontFamily: theme.typography?.bodyFont || theme.fonts?.body || 'sans-serif'
              }}
            >
              {content.ourStory.content}
            </div>
          </div>
        </section>
      )}

      {/* Wedding Details Section */}
      {content.schedule && (
        <section 
          className="py-16 px-4"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ 
                fontFamily: theme.typography?.headingFont || theme.fonts?.heading || 'serif',
                color: primaryColor
              }}
            >
              Wedding Details
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ceremony */}
              {content.schedule.ceremony && (
                <div className="bg-card rounded-lg p-6 shadow-md text-center">
                  <Calendar 
                    className="h-8 w-8 mx-auto mb-4"
                    style={{ color: primaryColor }}
                  />
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: primaryColor }}
                  >
                    Ceremony
                  </h3>
                  {content.schedule.ceremony.time && (
                    <p className="flex items-center justify-center mb-2 text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {content.schedule.ceremony.time}
                    </p>
                  )}
                  {content.schedule.ceremony.location && (
                    <p className="flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {content.schedule.ceremony.location}
                    </p>
                  )}
                </div>
              )}

              {/* Reception */}
              {content.schedule.reception && (
                <div className="bg-card rounded-lg p-6 shadow-md text-center">
                  <Heart 
                    className="h-8 w-8 mx-auto mb-4"
                    style={{ color: secondaryColor }}
                  />
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: primaryColor }}
                  >
                    Reception
                  </h3>
                  {content.schedule.reception.time && (
                    <p className="flex items-center justify-center mb-2 text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {content.schedule.reception.time}
                    </p>
                  )}
                  {content.schedule.reception.location && (
                    <p className="flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {content.schedule.reception.location}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Registry Section */}
      {content.registry?.message && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ 
                fontFamily: theme.typography?.headingFont || theme.fonts?.heading || 'serif',
                color: primaryColor
              }}
            >
              Registry
            </h2>
            <p 
              className="text-lg mb-8"
              style={{ 
                fontFamily: theme.typography?.bodyFont || theme.fonts?.body || 'sans-serif'
              }}
            >
              {content.registry.message}
            </p>
            {content.registry.stores && content.registry.stores.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {content.registry.stores.map((store, index) => (
                  <a
                    key={index}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: primaryColor,
                      color: 'white'
                    }}
                  >
                    {store.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer 
        className="py-8 px-4 text-center"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <p className="text-muted-foreground">
          Made with ❤️ using Wedding Planner
        </p>
      </footer>
    </div>
  );
}