import { Template } from '../types/template';

export const mockTemplates: Template[] = [
  {
    id: 'elegant-rose',
    name: 'Elegant Rose',
    category: 'elegant',
    style: 'classic',
    preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    features: ['Photo Gallery', 'RSVP Form', 'Timeline', 'Gift Registry'],
    isPremium: false,
    rating: 4.8,
    downloads: 1250,
    colors: ['#F8BBD9', '#D4AF37', '#FFFFFF'],
    description: 'A timeless and elegant design perfect for classic weddings'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'modern',
    style: 'contemporary',
    preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    features: ['Clean Layout', 'Mobile Optimized', 'Interactive Map', 'Social Media'],
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    colors: ['#2C3E50', '#ECF0F1', '#3498DB'],
    description: 'Clean and contemporary design for modern couples'
  },
  {
    id: 'rustic-charm',
    name: 'Rustic Charm',
    category: 'rustic',
    style: 'romantic',
    preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    features: ['Wooden Textures', 'Handwritten Fonts', 'Photo Collage', 'Story Timeline'],
    isPremium: false,
    rating: 4.7,
    downloads: 2100,
    colors: ['#8B4513', '#DEB887', '#F4A460'],
    description: 'Warm and inviting design with rustic elements'
  },
  {
    id: 'vintage-romance',
    name: 'Vintage Romance',
    category: 'vintage',
    style: 'romantic',
    preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    features: ['Vintage Borders', 'Sepia Effects', 'Ornate Details', 'Love Letters'],
    isPremium: true,
    rating: 4.6,
    downloads: 750,
    colors: ['#D8BFD8', '#FFB6C1', '#F0E68C'],
    description: 'Nostalgic design with vintage charm and romantic details'
  },
  {
    id: 'beach-bliss',
    name: 'Beach Bliss',
    category: 'beach',
    style: 'contemporary',
    preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    features: ['Ocean Waves', 'Sandy Textures', 'Sunset Colors', 'Coastal Vibes'],
    isPremium: false,
    rating: 4.5,
    downloads: 1680,
    colors: ['#20B2AA', '#F0F8FF', '#FFE4B5'],
    description: 'Perfect for beach and coastal weddings'
  },
  {
    id: 'garden-party',
    name: 'Garden Party',
    category: 'garden',
    style: 'romantic',
    preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    features: ['Floral Patterns', 'Green Accents', 'Nature Elements', 'Botanical Details'],
    isPremium: true,
    rating: 4.8,
    downloads: 920,
    colors: ['#9CAF88', '#F0FFF0', '#98FB98'],
    description: 'Natural and fresh design for garden weddings'
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    category: 'luxury',
    style: 'bold',
    preview: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg',
    features: ['Gold Accents', 'Premium Fonts', 'Elegant Animations', 'Luxury Feel'],
    isPremium: true,
    rating: 4.9,
    downloads: 450,
    colors: ['#D4AF37', '#000000', '#FFFFFF'],
    description: 'Opulent design for luxury weddings'
  },
  {
    id: 'minimalist-chic',
    name: 'Minimalist Chic',
    category: 'minimalist',
    style: 'contemporary',
    preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
    features: ['Clean Lines', 'White Space', 'Typography Focus', 'Simple Elegance'],
    isPremium: false,
    rating: 4.7,
    downloads: 1340,
    colors: ['#FFFFFF', '#000000', '#F5F5F5'],
    description: 'Less is more - perfect for minimalist couples'
  }
];

export const getCategories = (templates: Template[]) => [
  { value: 'all', label: 'All Templates', count: templates.length },
  { value: 'elegant', label: 'Elegant', count: templates.filter(t => t.category === 'elegant').length },
  { value: 'modern', label: 'Modern', count: templates.filter(t => t.category === 'modern').length },
  { value: 'rustic', label: 'Rustic', count: templates.filter(t => t.category === 'rustic').length },
  { value: 'vintage', label: 'Vintage', count: templates.filter(t => t.category === 'vintage').length },
  { value: 'beach', label: 'Beach', count: templates.filter(t => t.category === 'beach').length },
  { value: 'garden', label: 'Garden', count: templates.filter(t => t.category === 'garden').length },
  { value: 'luxury', label: 'Luxury', count: templates.filter(t => t.category === 'luxury').length },
  { value: 'minimalist', label: 'Minimalist', count: templates.filter(t => t.category === 'minimalist').length }
];

export const styles = [
  { value: 'all', label: 'All Styles' },
  { value: 'classic', label: 'Classic' },
  { value: 'bold', label: 'Bold' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'contemporary', label: 'Contemporary' }
];