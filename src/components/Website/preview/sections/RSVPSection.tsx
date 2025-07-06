

interface RSVPSectionProps {
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

export default function RSVPSection({ theme }: RSVPSectionProps) {
  return (
    <section
      className="py-16 px-6 text-center"
      style={{
        background: `linear-gradient(135deg, ${theme.colorPalette.primary}10, ${theme.colorPalette.secondary}10)`
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl md:text-4xl mb-8"
          style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            color: theme.colorPalette.primary
          }}
        >
          RSVP
        </h2>
        <p 
          className="text-lg mb-8"
          style={{ color: theme.colorPalette.text }}
        >
          Please let us know if you'll be joining us for our special day!
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