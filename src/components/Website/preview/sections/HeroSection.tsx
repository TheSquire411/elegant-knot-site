import { formatDate } from '../../../../utils/previewUtils';

interface HeroSectionProps {
  coupleNames: string;
  weddingDate: string;
  venue: {
    name: string;
    address: string;
  };
  theme: {
    colorPalette: {
      primary: string;
      secondary: string;
      text: string;
    };
    typography: {
      headingFont: string;
      headingWeight: number;
    };
  };
}

export default function HeroSection({ coupleNames, weddingDate, venue, theme }: HeroSectionProps) {
  return (
    <section
      className="relative bg-gradient-to-br from-primary-100 to-secondary-100 text-center py-20 px-6"
      style={{
        background: `linear-gradient(135deg, ${theme.colorPalette.primary}20, ${theme.colorPalette.secondary}20)`
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-7xl mb-6"
          style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            color: theme.colorPalette.primary
          }}
        >
          {coupleNames}
        </h1>
        <p 
          className="text-xl md:text-2xl mb-8"
          style={{ color: theme.colorPalette.text }}
        >
          {formatDate(weddingDate)}
        </p>
        <p 
          className="text-lg mb-8"
          style={{ color: theme.colorPalette.text, opacity: 0.8 }}
        >
          {venue.name} • {venue.address}
        </p>
        <button
          className="px-8 py-3 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.colorPalette.primary }}
        >
          RSVP Now
        </button>
      </div>
    </section>
  );
}