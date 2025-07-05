import { useState } from 'react';
import { X, Link, Plus, Loader } from 'lucide-react';
import { useRegistry } from '../../hooks/useRegistry';
import Modal from '../common/Modal';

interface AddRegistryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddRegistryItemModal({ isOpen, onClose }: AddRegistryItemModalProps) {
  const { addRegistryItem, scrapeProductMetadata, isScrapingUrl } = useRegistry();
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    store_url: '',
    store_name: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    quantity_wanted: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlScrape = async () => {
    if (!formData.store_url) return;

    const metadata = await scrapeProductMetadata(formData.store_url);
    if (metadata) {
      setFormData(prev => ({
        ...prev,
        title: metadata.title || prev.title,
        description: metadata.description || prev.description,
        price: metadata.price || prev.price,
        image_url: metadata.image_url || prev.image_url,
        store_name: metadata.store_name || prev.store_name
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setIsSubmitting(true);
    const success = await addRegistryItem({
      title: formData.title,
      description: formData.description || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      image_url: formData.image_url || undefined,
      store_url: formData.store_url || undefined,
      store_name: formData.store_name || undefined,
      priority: formData.priority,
      quantity_wanted: formData.quantity_wanted
    });

    if (success) {
      setFormData({
        title: '',
        description: '',
        price: '',
        image_url: '',
        store_url: '',
        store_name: '',
        priority: 'medium',
        quantity_wanted: 1
      });
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Registry Item">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Add Registry Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'url' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link className="h-4 w-4 inline mr-2" />
            From URL
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'manual' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Manual Entry
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Product URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.store_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, store_url: e.target.value }))}
                    placeholder="https://example.com/product"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleUrlScrape}
                    disabled={!formData.store_url || isScrapingUrl}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isScrapingUrl ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      'Fetch'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Item Title *
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
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => setFormData(prev => ({ ...prev, store_name: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantity Wanted
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity_wanted}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity_wanted: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
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
              disabled={!formData.title || isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin inline mr-2" />
              ) : null}
              Add Item
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}