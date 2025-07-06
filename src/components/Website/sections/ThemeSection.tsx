import { useState } from 'react';

interface ThemeSectionProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
}

export default function ThemeSection({ websiteData, onUpdate }: ThemeSectionProps) {
  const [showCustomCSS, setShowCustomCSS] = useState(false);

  const updateTheme = (updates: any) => {
    onUpdate({
      theme: {
        ...websiteData.theme,
        ...updates
      }
    });
  };

  const themeOptions = [
    { name: 'Classic & Elegant', colors: ['#F8BBD9', '#D4AF37'] },
    { name: 'Modern & Minimalist', colors: ['#2C3E50', '#ECF0F1'] },
    { name: 'Rustic & Bohemian', colors: ['#8B4513', '#DEB887'] },
    { name: 'Vintage & Romantic', colors: ['#D8BFD8', '#FFB6C1'] },
    { name: 'Beach & Tropical', colors: ['#20B2AA', '#FFE4B5'] },
    { name: 'Garden & Natural', colors: ['#9CAF88', '#F0FFF0'] }
  ];

  const fontOptions = [
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Lora', category: 'serif' },
    { name: 'Open Sans', category: 'sans-serif' },
    { name: 'Crimson Text', category: 'serif' },
    { name: 'Nunito', category: 'sans-serif' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Theme</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {themeOptions.map((theme) => (
            <button
              key={theme.name}
              onClick={() => updateTheme({ style: theme.name, colors: theme.colors })}
              className={`p-4 border-2 rounded-lg transition-all ${
                websiteData.theme.style === theme.name
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex space-x-2 mb-3">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <p className="font-medium text-gray-800">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-medium text-gray-700 mb-4">Heading Font</h4>
          <select
            value={websiteData.theme.fonts.heading}
            onChange={(e) => updateTheme({
              fonts: { ...websiteData.theme.fonts, heading: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {fontOptions.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name} ({font.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-4">Body Font</h4>
          <select
            value={websiteData.theme.fonts.body}
            onChange={(e) => updateTheme({
              fonts: { ...websiteData.theme.fonts, body: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {fontOptions.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name} ({font.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700">Custom CSS</h4>
          <button
            onClick={() => setShowCustomCSS(!showCustomCSS)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showCustomCSS ? 'Hide' : 'Show'} Advanced Styling
          </button>
        </div>
        {showCustomCSS && (
          <textarea
            value={websiteData.customCSS || ''}
            onChange={(e) => onUpdate({ customCSS: e.target.value })}
            placeholder="/* Add your custom CSS here */"
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
}