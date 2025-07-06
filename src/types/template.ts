export interface Template {
  id: string;
  name: string;
  category: 'elegant' | 'modern' | 'rustic' | 'vintage' | 'beach' | 'garden' | 'luxury' | 'minimalist';
  style: 'classic' | 'bold' | 'romantic' | 'contemporary';
  preview: string;
  thumbnail: string;
  features: string[];
  isPremium: boolean;
  rating: number;
  downloads: number;
  colors: string[];
  description: string;
}

export interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  selectedTemplate?: Template;
}

export interface Category {
  value: string;
  label: string;
  count: number;
}

export interface Style {
  value: string;
  label: string;
}

export type SortOption = 'popular' | 'newest' | 'rating';