import { Palette, FileText, Layers, Eye, Settings } from 'lucide-react';

export type ActiveTab = 'templates' | 'builder' | 'sections' | 'preview' | 'settings';

interface WebsiteManagerTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs = [
  { key: 'templates', label: 'Templates', icon: Palette, description: 'Choose a design' },
  { key: 'builder', label: 'Builder', icon: FileText, description: 'Edit content' },
  { key: 'sections', label: 'Sections', icon: Layers, description: 'Manage sections' },
  { key: 'preview', label: 'Preview', icon: Eye, description: 'See your site' },
  { key: 'settings', label: 'Settings', icon: Settings, description: 'Configure site' }
] as const;

export default function WebsiteManagerTabs({ activeTab, onTabChange }: WebsiteManagerTabsProps) {
  return (
    <div className="bg-white border-b border-sage-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key as ActiveTab)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-sage-600 hover:text-sage-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}