import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
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
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center space-x-2 mx-auto"
        >
          <Sparkles className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>
            {isGenerating ? 'Creating your perfect template...' : 'Generate AI Template'}
          </span>
        </button>
        
        {isGenerating && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-purple-600">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-2">Analyzing your preferences and generating design...</span>
            </div>
          </div>
        )}

        {generationError && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-destructive mb-1">Generation Failed</h4>
                <p className="text-sm text-destructive/80 mb-3">
                  We couldn't generate your template. This might be due to high demand or a temporary issue.
                </p>
                <button
                  onClick={onGenerate}
                  className="flex items-center space-x-2 text-sm bg-destructive text-destructive-foreground px-3 py-1.5 rounded hover:bg-destructive/90 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
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