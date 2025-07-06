import { ReactNode, CSSProperties } from 'react';

interface WebsitePreviewFrameProps {
  previewMode: 'desktop' | 'mobile';
  theme: {
    typography: {
      bodyFont: string;
      bodyWeight: number;
    };
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };
  children: ReactNode;
}

export default function WebsitePreviewFrame({ previewMode, theme, children }: WebsitePreviewFrameProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-8 flex justify-center">
      <div
        className={`bg-white shadow-2xl overflow-hidden transition-all ${
          previewMode === 'desktop'
            ? 'w-full max-w-5xl rounded-lg'
            : 'w-80 rounded-2xl border-8 border-gray-800'
        }`}
        style={{
          fontFamily: theme.typography.bodyFont,
          fontWeight: theme.typography.bodyWeight,
          '--primary-color': theme.colorPalette.primary,
          '--secondary-color': theme.colorPalette.secondary,
          '--accent-color': theme.colorPalette.accent,
          '--bg-color': theme.colorPalette.background,
          '--text-color': theme.colorPalette.text
        } as CSSProperties}
      >
        <div className="overflow-y-auto" style={{ height: previewMode === 'desktop' ? '600px' : '700px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}