import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { generateShortId } from '../../utils/uuid';

interface VisionBoardCustomizerProps {
  onComplete?: (preferences: any) => void;
  onGenerate?: (preferences: any) => void;
  onClose?: () => void;
  existingPreferences?: any;
}

export default function VisionBoardCustomizer({ onComplete, onGenerate, onClose, existingPreferences }: VisionBoardCustomizerProps) {
  const [preferences, setPreferences] = useState({
    aesthetic: existingPreferences?.aesthetic || '',
    venue: existingPreferences?.venue || '',
    colors: existingPreferences?.colors || [] as string[],
    season: existingPreferences?.season || '',
    mustHave: existingPreferences?.mustHave || '',
    avoid: existingPreferences?.avoid || ''
  });

  const aestheticOptions = [
    'Classic & Elegant',
    'Modern & Minimalist',
    'Rustic & Bohemian',
    'Vintage & Romantic',
    'Beach & Tropical',
    'Garden & Natural',
    'Industrial Chic',
    'Glamorous & Luxe'
  ];

  const venueOptions = [
    'Garden/Outdoor',
    'Ballroom/Hotel',
    'Beach/Waterfront',
    'Barn/Rustic',
    'Museum/Historic',
    'Rooftop/City View',
    'Vineyard/Winery',
    'Mountain/Forest'
  ];

  const colorOptions = [
    ['Blush Pink', 'Gold'],
    ['Navy Blue', 'Silver'],
    ['Sage Green', 'Cream'],
    ['Burgundy', 'Rose Gold'],
    ['Lavender', 'Gray'],
    ['Coral', 'Peach'],
    ['Emerald', 'Ivory'],
    ['Dusty Blue', 'Champagne']
  ];

  const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.aesthetic && preferences.venue && preferences.colors.length > 0 && preferences.season) {
      setIsGenerating(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('generate-vision-board', {
          body: preferences
        });

        if (error) {
          throw error;
        }

        // Save to database after successful generation
        await saveVisionBoardToDatabase(data, preferences);

        if (onGenerate) {
          onGenerate(data);
        } else if (onComplete) {
          onComplete(data);
        }
      } catch (error) {
        console.error('Error generating vision board:', error);
        // Fallback to mock data if API fails
        const mockElements = {
          colorPalette: preferences.colors,
          venueImages: [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1549417229-aa67ffaaab29?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop'
          ],
          moodImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=400&fit=crop',
          decorElements: [
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1549417229-aa67ffaaab29?w=300&h=200&fit=crop'
          ],
          keywords: [
            preferences.aesthetic.split(' ')[0],
            preferences.season.toLowerCase(),
            preferences.venue.split('/')[0].toLowerCase(),
            'romantic',
            'elegant',
            'timeless'
          ],
          userPhotos: []
        };

        const boardData = {
          id: generateShortId(),
          preferences,
          elements: mockElements
        };

        // Save mock data to database as well
        await saveVisionBoardToDatabase(boardData, preferences);

        if (onGenerate) {
          onGenerate(boardData);
        } else if (onComplete) {
          onComplete(boardData);
        }
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const saveVisionBoardToDatabase = async (boardData: any, prefs: any) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Check if user already has a vision board
      const { data: existingBoard } = await supabase
        .from('user_vision_boards')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (existingBoard) {
        // Update existing vision board
        const { error } = await supabase
          .from('user_vision_boards')
          .update({
            aesthetic: prefs.aesthetic,
            venue: prefs.venue,
            colors: prefs.colors,
            season: prefs.season,
            must_have: prefs.mustHave,
            avoid: prefs.avoid,
            generated_board_data: boardData.elements,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userData.user.id);

        if (error) {
          console.error('Error updating vision board:', error);
        }
      } else {
        // Create new vision board
        const { error } = await supabase
          .from('user_vision_boards')
          .insert({
            user_id: userData.user.id,
            aesthetic: prefs.aesthetic,
            venue: prefs.venue,
            colors: prefs.colors,
            season: prefs.season,
            must_have: prefs.mustHave,
            avoid: prefs.avoid,
            generated_board_data: boardData.elements
          });

        if (error) {
          console.error('Error saving vision board:', error);
        }
      }
    } catch (error) {
      console.error('Error saving vision board to database:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-primary-500 to-sage-400 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Sparkles className="h-6 w-6 mr-2" />
            Customize Your Vision Board
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Aesthetic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Event Aesthetic *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {aestheticOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, aesthetic: option }))}
                  className={`p-3 text-left border-2 rounded-lg transition-all ${
                    preferences.aesthetic === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Venue Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {venueOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, venue: option }))}
                  className={`p-3 text-left border-2 rounded-lg transition-all ${
                    preferences.venue === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Palette *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((colors, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, colors }))}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    JSON.stringify(preferences.colors) === JSON.stringify(colors)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full bg-primary-300"></div>
                      <div className="w-4 h-4 rounded-full bg-sage-300"></div>
                    </div>
                    <span className="text-sm font-medium">{colors.join(' & ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Wedding Season *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {seasonOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, season: option }))}
                  className={`p-3 text-center border-2 rounded-lg transition-all ${
                    preferences.season === option
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Must-Have Elements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Must-Have Design Elements
            </label>
            <textarea
              value={preferences.mustHave}
              onChange={(e) => setPreferences(prev => ({ ...prev, mustHave: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., string lights, greenery, candles, vintage details..."
            />
          </div>

          {/* Elements to Avoid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elements to Avoid
            </label>
            <textarea
              value={preferences.avoid}
              onChange={(e) => setPreferences(prev => ({ ...prev, avoid: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., bright colors, formal elements, modern furniture..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={!preferences.aesthetic || !preferences.venue || preferences.colors.length === 0 || !preferences.season || isGenerating}
              className="flex-1 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Vision Board'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}