import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useApp } from '../../context/AppContext';
import { errorHandler } from '../../utils/errorHandling';
import BackButton from '../common/BackButton';
import VisionBoardCustomizer from './VisionBoardCustomizer';
import VisionBoardGenerator from './VisionBoardGenerator';
import PinterestBoard from './PinterestBoard';

export default function VisionBoardPage() {
  const { state } = useApp();
  const [activeStep, setActiveStep] = useState<'customize' | 'generate' | 'pinterest'>('customize');
  const [boardData, setBoardData] = useState<any>(null);
  const [hasExistingBoard, setHasExistingBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingVisionBoard();
  }, [state.user]);

  const loadExistingVisionBoard = async () => {
    if (!state.user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_vision_boards')
        .select('*')
        .eq('user_id', state.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        errorHandler.handle(error, {
          context: 'Vision Board - Load Existing Board',
          showToUser: true,
          severity: 'medium'
        });
      } else if (data) {
        setHasExistingBoard(true);
        // If user has an existing vision board, go directly to generate view
        setBoardData({
          id: data.id,
          preferences: {
            aesthetic: data.aesthetic,
            venue: data.venue,
            colors: data.colors,
            season: data.season,
            mustHave: data.must_have,
            avoid: data.avoid
          },
          elements: data.generated_board_data
        });
        setActiveStep('generate');
      }
    } catch (error) {
      errorHandler.handle(error, {
        context: 'Vision Board - Load Data',
        showToUser: true,
        severity: 'high'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-4">
            <div className="mb-4">
              <BackButton />
            </div>
            <div className="subheading-accent text-primary mb-2">Creative Studio</div>
            <h1 className="section-heading text-primary-700">Vision Board Studio</h1>
            <p className="elegant-text mt-1">Create your perfect wedding vision</p>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-t">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveStep('customize')}
                className={`py-4 border-b-2 transition-colors ${
                  activeStep === 'customize'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="font-medium">Style Preferences</span>
              </button>
              <button
                onClick={() => setActiveStep('pinterest')}
                className={`py-4 border-b-2 transition-colors ${
                  activeStep === 'pinterest'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="font-medium">Pinterest Boards</span>
              </button>
              <button
                onClick={() => setActiveStep('generate')}
                className={`py-4 border-b-2 transition-colors ${
                  activeStep === 'generate'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="font-medium">Generate Vision Board</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeStep === 'customize' && (
          <div className="p-6">
            <VisionBoardCustomizer 
              onComplete={(data) => {
                setBoardData(data);
                setActiveStep('generate');
              }}
              existingPreferences={hasExistingBoard && boardData ? boardData.preferences : null}
            />
          </div>
        )}
        
        {activeStep === 'pinterest' && (
          <PinterestBoard 
            onNavigateBack={() => setActiveStep('customize')}
          />
        )}
        
        {activeStep === 'generate' && boardData && (
          <div className="p-6">
            <VisionBoardGenerator 
              board={boardData}
              hasExistingBoard={hasExistingBoard}
              onEditPreferences={() => setActiveStep('customize')}
            />
          </div>
        )}
        
        {activeStep === 'generate' && !boardData && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Complete Your Style Preferences First
              </h3>
              <p className="text-gray-600 mb-6">
                Before generating your vision board, please set your style preferences.
              </p>
              <button
                onClick={() => setActiveStep('customize')}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Set Style Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}