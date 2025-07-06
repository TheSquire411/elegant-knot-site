import { Sparkles } from 'lucide-react';
import { Template } from '../../types/template';

interface AITemplateGeneratorProps {
  isGenerating: boolean;
  generationError: string | null;
  generatedTemplate: Template | null;
  onGenerate: () => void;
}

export default function AITemplateGenerator({ 
  isGenerating, 
  generationError, 
  generatedTemplate, 
  onGenerate 
}: AITemplateGeneratorProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-purple-600 mr-2" />
          <h3 className="text-2xl font-bold text-gray-800">AI-Powered Template Generation</h3>
        </div>
        <p className="text-gray-600 mb-6">Let our AI create a personalized template based on your wedding details and style preferences</p>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
        >
          <Sparkles className="h-5 w-5" />
          <span>{isGenerating ? 'Generating...' : 'Generate AI Template'}</span>
        </button>

        {generationError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">Error: {generationError}</p>
          </div>
        )}

        {generatedTemplate && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">AI template generated successfully! Look for "{generatedTemplate.name}" in the templates below.</p>
          </div>
        )}
      </div>
    </div>
  );
}