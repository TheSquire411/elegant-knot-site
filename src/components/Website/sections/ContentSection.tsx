import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { useDeepseek } from '../../../hooks/useDeepseek';

interface ContentSectionProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
  isGenerating: boolean;
}

export default function ContentSection({ websiteData, onUpdate, isGenerating }: ContentSectionProps) {
  const { generateStory } = useDeepseek({
    onSuccess: (data) => {
      if (data && data.story) {
        updateContent('ourStory', { content: data.story });
      }
    },
    onError: (error) => {
      console.error('Failed to generate story:', error);
    }
  });

  const updateContent = (section: string, updates: any) => {
    onUpdate({
      content: {
        ...websiteData.content,
        [section]: {
          ...websiteData.content[section],
          ...updates
        }
      }
    });
  };

  const updateSimpleContent = (field: string, value: any) => {
    onUpdate({
      content: {
        ...websiteData.content,
        [field]: value
      }
    });
  };

  const handleGenerateStory = async (style: 'romantic' | 'casual' | 'formal') => {
    try {
      const coupleInfo = {
        names: websiteData.content.coupleNames || 'The Happy Couple',
        style,
        weddingDate: websiteData.content.weddingDate,
        venue: websiteData.content.venue?.name,
        additionalInfo: 'A beautiful love story'
      };

      await generateStory(JSON.stringify(coupleInfo));
    } catch (error) {
      console.error('Failed to generate story:', error);
    }
  };

  const addRegistryStore = () => {
    const newStore = {
      name: 'Store Name',
      url: 'https://registry-url.com'
    };

    updateContent('registry', {
      ...websiteData.content.registry,
      stores: [...websiteData.content.registry.stores, newStore]
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Couple Names</label>
          <input
            type="text"
            value={websiteData.content.coupleNames}
            onChange={(e) => updateSimpleContent('coupleNames', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
          <input
            type="date"
            value={websiteData.content.weddingDate}
            onChange={(e) => updateSimpleContent('weddingDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700">Our Story</h4>
          <div className="flex items-center space-x-2">
            <select
              value={websiteData.content.ourStory.style}
              onChange={(e) => updateContent('ourStory', { style: e.target.value })}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="romantic">Romantic</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
            <button
              onClick={() => handleGenerateStory(websiteData.content.ourStory.style)}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isGenerating ? 'Generating...' : 'AI Generate'}</span>
            </button>
          </div>
        </div>
        <textarea
          value={websiteData.content.ourStory.content}
          onChange={(e) => updateContent('ourStory', { content: e.target.value })}
          placeholder="Tell your love story..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-4">Venue Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Venue Name</label>
            <input
              type="text"
              value={websiteData.content.venue.name}
              onChange={(e) => updateContent('venue', { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
            <input
              type="text"
              value={websiteData.content.venue.address}
              onChange={(e) => updateContent('venue', { address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-4">Registry</h4>
        <div className="space-y-4">
          <textarea
            value={websiteData.content.registry.message}
            onChange={(e) => updateContent('registry', { message: e.target.value })}
            placeholder="Registry message for your guests..."
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <div className="space-y-3">
            {websiteData.content.registry.stores.map((store: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={store.name}
                  onChange={(e) => {
                    const updated = [...websiteData.content.registry.stores];
                    updated[index] = { ...store, name: e.target.value };
                    updateContent('registry', { stores: updated });
                  }}
                  placeholder="Store name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="url"
                  value={store.url}
                  onChange={(e) => {
                    const updated = [...websiteData.content.registry.stores];
                    updated[index] = { ...store, url: e.target.value };
                    updateContent('registry', { stores: updated });
                  }}
                  placeholder="Registry URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    const updated = websiteData.content.registry.stores.filter((_: any, i: number) => i !== index);
                    updateContent('registry', { stores: updated });
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addRegistryStore}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Registry Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}