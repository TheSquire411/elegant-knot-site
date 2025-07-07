import { Layout } from 'lucide-react';
import { TemplateGalleryProps } from '../../types/template';
import { useAITemplateGeneration } from '../../hooks/useAITemplateGeneration';
import AITemplateGenerator from './AITemplateGenerator';
import TemplateCard from './TemplateCard';

export default function TemplateGallery({ onSelectTemplate, selectedTemplate }: TemplateGalleryProps) {
  const { isGenerating, generationError, generatedTemplate, generateTemplate } = useAITemplateGeneration();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Generate Your Perfect Template</h2>
        <p className="text-xl text-gray-600">AI-powered custom wedding website templates designed just for you</p>
      </div>

      {/* AI Template Generation */}
      <AITemplateGenerator
        isGenerating={isGenerating}
        generationError={generationError}
        generatedTemplate={generatedTemplate}
        onGenerate={generateTemplate}
      />

      {/* Template Display */}
      {generatedTemplate ? (
        <div className="grid justify-center">
          <TemplateCard
            template={generatedTemplate}
            isSelected={selectedTemplate?.id === generatedTemplate.id}
            onSelect={onSelectTemplate}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Generate your first template</h3>
          <p className="text-gray-500 mb-6">Use our AI template generator above to create your perfect wedding website design</p>
        </div>
      )}
    </div>
  );
}