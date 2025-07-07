import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface UseGeminiProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export function useGemini({ onSuccess, onError }: UseGeminiProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: 'analyzeImage',
          imageUrl
        }
      });

      if (error) throw error;

      onSuccess(data);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      onError('Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateStory = async (personalizationData: any) => {
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: 'generateStory',
          personalizationData
        }
      });

      if (error) throw error;

      onSuccess(data);
    } catch (error) {
      console.error('Failed to generate story:', error);
      onError('Failed to generate story');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateTemplateContent = async (templateData: any) => {
    console.log('generateTemplateContent called with:', templateData);
    setIsAnalyzing(true);

    try {
      console.log('Invoking gemini-analysis function...');
      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: 'generateTemplateContent',
          templateData
        }
      });

      console.log('Function response:', { data, error });

      if (error) throw error;

      onSuccess(data);
    } catch (error) {
      console.error('Failed to generate template content:', error);
      onError('Failed to generate template content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeImage,
    generateStory,
    generateTemplateContent,
    isAnalyzing
  };
}