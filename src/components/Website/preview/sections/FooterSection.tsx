import { formatDate } from '../../../../utils/previewUtils';

interface FooterSectionProps {
  coupleNames: string;
  weddingDate: string;
  theme: {
    colorPalette: {
      primary: string;
      text: string;
      background: string;
    };
    typography: {
      bodyFont: string;
      bodyWeight: number;
    };
  };
}

export default function FooterSection({ coupleNames, weddingDate, theme }: FooterSectionProps) {
  return (
    <footer 
      className="py-8 px-6 text-center"
      style={{
        backgroundColor: theme.colorPalette.primary,
        fontFamily: theme.typography.bodyFont,
        fontWeight: theme.typography.bodyWeight
      }}
    >
      <p 
        className="mb-2"
        style={{ color: theme.colorPalette.background }}
      >
        {coupleNames}
      </p>
      <p 
        style={{ 
          color: theme.colorPalette.background,
          opacity: 0.7
        }}
      >
        {formatDate(weddingDate)}
      </p>
    </footer>
  );
}