import { useState } from 'react';
import VisionBoardCustomizer from './VisionBoardCustomizer';
import VisionBoardGenerator from './VisionBoardGenerator';
import PinterestBoard from './PinterestBoard';

export default function VisionBoardPage() {
  const [activeStep, setActiveStep] = useState<'customize' | 'generate' | 'pinterest'>('customize');
  const [boardData, setBoardData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sage-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-serif font-bold text-primary-700">Vision Board Studio</h1>
            <p className="text-sage-600 mt-1">Create your perfect wedding vision</p>
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