import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface StoryPersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteData: any;
  onGenerate: (personalizationData: any) => void;
  isGenerating: boolean;
}

export default function StoryPersonalizationModal({
  isOpen,
  onClose,
  websiteData,
  onGenerate,
  isGenerating
}: StoryPersonalizationModalProps) {
  const [formData, setFormData] = useState({
    howMet: '',
    firstDate: '',
    proposal: '',
    sharedInterests: '',
    specialMemories: '',
    weddingStyle: websiteData?.content?.ourStory?.style || 'romantic',
    storyLength: 'medium'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    onGenerate({
      ...formData,
      coupleNames: websiteData?.content?.coupleNames || 'The Happy Couple',
      weddingDate: websiteData?.content?.weddingDate,
      venue: websiteData?.content?.venue?.name,
      theme: websiteData?.theme
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Personalize Your Love Story</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Style</label>
              <select
                value={formData.weddingStyle}
                onChange={(e) => handleInputChange('weddingStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="romantic">Romantic</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Length</label>
              <select
                value={formData.storyLength}
                onChange={(e) => handleInputChange('storyLength', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="short">Short (1-2 paragraphs)</option>
                <option value="medium">Medium (2-3 paragraphs)</option>
                <option value="long">Long (3-4 paragraphs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">How did you meet?</label>
            <textarea
              value={formData.howMet}
              onChange={(e) => handleInputChange('howMet', e.target.value)}
              placeholder="Tell us about how your love story began..."
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First date or special early memory</label>
            <textarea
              value={formData.firstDate}
              onChange={(e) => handleInputChange('firstDate', e.target.value)}
              placeholder="Describe your first date or an early special moment..."
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">The proposal</label>
            <textarea
              value={formData.proposal}
              onChange={(e) => handleInputChange('proposal', e.target.value)}
              placeholder="Share the story of your proposal..."
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shared interests & hobbies</label>
            <textarea
              value={formData.sharedInterests}
              onChange={(e) => handleInputChange('sharedInterests', e.target.value)}
              placeholder="What do you love doing together?"
              className="w-full h-16 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special memories to include</label>
            <textarea
              value={formData.specialMemories}
              onChange={(e) => handleInputChange('specialMemories', e.target.value)}
              placeholder="Any special moments, trips, or memories you'd like included..."
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Story'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}