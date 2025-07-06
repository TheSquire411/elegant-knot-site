import { useState, useMemo } from 'react';
import { Layout } from 'lucide-react';
import { TemplateGalleryProps, SortOption } from '../../types/template';
import { mockTemplates, getCategories, styles } from '../../constants/templateData';
import { useAITemplateGeneration } from '../../hooks/useAITemplateGeneration';
import AITemplateGenerator from './AITemplateGenerator';
import TemplateFilters from './TemplateFilters';
import TemplateCard from './TemplateCard';
import TemplateStats from './TemplateStats';

export default function TemplateGallery({ onSelectTemplate, selectedTemplate }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const { isGenerating, generationError, generatedTemplate, generateTemplate } = useAITemplateGeneration();

  const allTemplates = generatedTemplate ? [generatedTemplate, ...mockTemplates] : mockTemplates;
  const categories = getCategories(allTemplates);

  const filteredTemplates = useMemo(() => {
    return allTemplates
      .filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchesStyle = selectedStyle === 'all' || template.style === selectedStyle;
        const matchesPremium = !showPremiumOnly || template.isPremium;
        
        return matchesSearch && matchesCategory && matchesStyle && matchesPremium;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return b.downloads - a.downloads;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [allTemplates, searchTerm, selectedCategory, selectedStyle, showPremiumOnly, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStyle('all');
    setShowPremiumOnly(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Choose Your Perfect Template</h2>
        <p className="text-xl text-gray-600">Over 100 professionally designed templates to match your wedding style</p>
      </div>

      {/* AI Template Generation */}
      <AITemplateGenerator
        isGenerating={isGenerating}
        generationError={generationError}
        generatedTemplate={generatedTemplate}
        onGenerate={generateTemplate}
      />

      {/* Filters */}
      <TemplateFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showPremiumOnly={showPremiumOnly}
        onPremiumToggle={setShowPremiumOnly}
        categories={categories}
        styles={styles}
        filteredCount={filteredTemplates.length}
        totalCount={allTemplates.length}
      />

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters to see more templates</p>
          <button
            onClick={clearFilters}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Template Stats */}
      <TemplateStats templates={allTemplates} />
    </div>
  );
}