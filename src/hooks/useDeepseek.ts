import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface UseDeepseekProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export function useDeepseek({ onSuccess, onError }: UseDeepseekProps) {
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

  return {
    analyzeImage,
    generateStory,
    isAnalyzing
  };
}