import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Template } from '../types/template';

interface WeddingData {
  style_quiz_answers: { aesthetic: string; colors: string[] };
  partner1_name: string;
  partner2_name: string;
  wedding_date: string;
  venue_name: string;
}

export function useAITemplateGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedTemplate, setGeneratedTemplate] = useState<Template | null>(null);

  // Mock wedding data - in real app, this would come from context or API
  const weddingData: WeddingData = {
    style_quiz_answers: { aesthetic: 'elegant', colors: ['#F8BBD9', '#D4AF37'] },
    partner1_name: 'Alex',
    partner2_name: 'Taylor',
    wedding_date: '2024-09-15',
    venue_name: 'Garden Venue'
  };

  const generateTemplate = async () => {
    if (!weddingData) {
      alert("Please enter some wedding details on the dashboard first!");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('gemini-analysis', {
        body: {
          type: 'generateTemplateContent',
          templateData: {
            style: weddingData.style_quiz_answers,
            details: {
              partner1Name: weddingData.partner1_name,
              partner2Name: weddingData.partner2_name,
              weddingDate: weddingData.wedding_date,
              venue: weddingData.venue_name,
            },
          }
        },
      });

      if (error) {
        throw error;
      }

      if (data && data.template) {
        // Save the new template to the database
        const { data: savedTemplate, error: insertError } = await supabase
          .from('website_templates')
          .insert({
            user_id: user.id,
            name: 'AI-Generated Theme',
            layout: data.template.layout || {},
            colors: data.template.colors || {},
            typography: data.template.typography || {},
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // Convert to Template format and set as generated template
        const aiTemplate: Template = {
          id: savedTemplate.id,
          name: savedTemplate.name,
          category: 'modern',
          style: 'contemporary',
          preview: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
          thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
          features: ['AI Generated', 'Personalized', 'Modern Design', 'Custom Colors'],
          isPremium: true,
          rating: 5.0,
          downloads: 1,
          colors: data.template.colors?.primary ? [data.template.colors.primary] : ['#2C3E50'],
          description: 'AI-generated template based on your wedding preferences'
        };

        setGeneratedTemplate(aiTemplate);
      }
    } catch (error) {
      console.error("Error generating template:", error);
      if (error instanceof Error) {
        setGenerationError(error.message);
      } else {
        setGenerationError("An unknown error occurred during AI template generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generationError,
    generatedTemplate,
    generateTemplate
  };
}