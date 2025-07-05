import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Registry } from '../../types/registry';
import Modal from '../common/Modal';

interface RegistrySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registry: Registry | null;
  onUpdate: (updates: Partial<Registry>) => Promise<boolean>;
}

export function RegistrySettingsModal({ isOpen, onClose, registry, onUpdate }: RegistrySettingsModalProps) {
  const [formData, setFormData] = useState({
    title: registry?.title || '',
    description: registry?.description || '',
    is_public: registry?.is_public ?? true
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    const success = await onUpdate(formData);
    
    if (success) {
      onClose();
    }
    setIsSaving(false);
  };

  // Update form data when registry changes
  useEffect(() => {
    if (registry) {
      setFormData({
        title: registry.title,
        description: registry.description || '',
        is_public: registry.is_public
      });
    }
  }, [registry]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registry Settings">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Registry Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Registry Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Welcome Message
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Thank you for celebrating with us! Here are some items we'd love to have..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm font-medium text-foreground">
                Make registry public for guests
              </span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              When enabled, guests can view and mark items as purchased on your wedding website
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}