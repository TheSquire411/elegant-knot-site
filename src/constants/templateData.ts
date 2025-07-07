import { Template } from '../types/template';

export const mockTemplates: Template[] = [];

export const getCategories = (templates: Template[]) => [
  { value: 'all', label: 'All Templates', count: templates.length }
];

export const styles = [
  { value: 'all', label: 'All Styles' },
  { value: 'classic', label: 'Classic' },
  { value: 'bold', label: 'Bold' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'contemporary', label: 'Contemporary' }
];