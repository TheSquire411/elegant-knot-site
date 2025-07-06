

interface OurStorySectionProps {
  story: {
    content: string;
  };
  theme: {
    colorPalette: {
      primary: string;
      text: string;
    };
    typography: {
      headingFont: string;
      headingWeight: number;
    };
  };
}

export default function OurStorySection({ story, theme }: OurStorySectionProps) {
  if (!story.content) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl mb-8"
          style={{
            fontFamily: theme.typography.headingFont,
            fontWeight: theme.typography.headingWeight,
            color: theme.colorPalette.primary
          }}
        >
          Our Story
        </h2>
        <div 
          className="prose prose-lg mx-auto"
          style={{ color: theme.colorPalette.text }}
        >
          <div 
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: story.content.includes('<') 
                ? story.content 
                : `<p>${story.content}</p>`
            }}
          />
        </div>
      </div>
    </section>
  );
}