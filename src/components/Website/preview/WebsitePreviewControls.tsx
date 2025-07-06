import { Monitor, Smartphone, ExternalLink, Share2 } from 'lucide-react';

interface WebsitePreviewControlsProps {
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export default function WebsitePreviewControls({ previewMode, onPreviewModeChange }: WebsitePreviewControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h3 className="text-lg font-semibold text-gray-800">Website Preview</h3>
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onPreviewModeChange('desktop')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              previewMode === 'desktop'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => onPreviewModeChange('mobile')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              previewMode === 'mobile'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Mobile</span>
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Share2 className="h-4 w-4" />
          <span>Share Preview</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          <ExternalLink className="h-4 w-4" />
          <span>Open in New Tab</span>
        </button>
      </div>
    </div>
  );
}