import { Eye, Heart, Download, Star, Crown } from 'lucide-react';
import { Template } from '../../types/template';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
}

export default function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={() => onSelect(template)}
    >
      {/* Template Preview */}
      <div className="relative group">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-gold-400 to-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <Crown className="h-3 w-3" />
              <span>PRO</span>
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="absolute bottom-3 left-3 flex space-x-1">
          {template.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{template.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {template.category}
          </span>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Download className="h-3 w-3" />
            <span>{template.downloads.toLocaleString()}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Features:</p>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
            {template.features.length > 2 && (
              <span className="text-xs text-gray-500">
                +{template.features.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="bg-primary-500 text-white text-center py-2">
          <span className="text-sm font-medium">Selected Template</span>
        </div>
      )}
    </div>
  );
}