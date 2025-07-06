import { Template } from '../../types/template';

interface TemplateStatsProps {
  templates: Template[];
}

export default function TemplateStats({ templates }: TemplateStatsProps) {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-2xl p-6">
      <div className="grid md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-2xl font-bold text-primary-600">{templates.length}+</div>
          <div className="text-sm text-gray-600">Professional Templates</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-sage-600">{templates.filter(t => !t.isPremium).length}</div>
          <div className="text-sm text-gray-600">Free Templates</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gold-600">{templates.filter(t => t.isPremium).length}</div>
          <div className="text-sm text-gray-600">Premium Templates</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">8</div>
          <div className="text-sm text-gray-600">Style Categories</div>
        </div>
      </div>
    </div>
  );
}