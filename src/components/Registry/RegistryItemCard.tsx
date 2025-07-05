import { useState } from 'react';
import { ExternalLink, Trash2, CheckCircle, Package } from 'lucide-react';
import { RegistryItem } from '../../types/registry';

interface RegistryItemCardProps {
  item: RegistryItem;
  onUpdate: (itemId: string, updates: Partial<RegistryItem>) => Promise<boolean>;
  onDelete: (itemId: string) => Promise<boolean>;
}

export function RegistryItemCard({ item, onUpdate, onDelete }: RegistryItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    setIsDeleting(true);
    const success = await onDelete(item.id);
    if (!success) {
      setIsDeleting(false);
    }
  };

  const togglePurchased = async () => {
    await onUpdate(item.id, { 
      is_purchased: !item.is_purchased,
      purchased_at: !item.is_purchased ? new Date().toISOString() : undefined,
      purchased_by: !item.is_purchased ? 'Store Manager' : undefined
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border overflow-hidden transition-all hover:shadow-md ${
      item.is_purchased ? 'opacity-75' : ''
    }`}>
      {/* Image */}
      <div className="aspect-square bg-muted relative">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Purchase Status Overlay */}
        {item.is_purchased && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Purchased
            </div>
          </div>
        )}

        {/* Priority Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
        )}

        {/* Price and Store */}
        <div className="flex justify-between items-center mb-3">
          {item.price && (
            <span className="text-lg font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
          )}
          {item.store_name && (
            <span className="text-sm text-muted-foreground">{item.store_name}</span>
          )}
        </div>

        {/* Quantity */}
        {item.quantity_wanted > 1 && (
          <div className="text-sm text-muted-foreground mb-3">
            Quantity: {item.quantity_purchased}/{item.quantity_wanted}
          </div>
        )}

        {/* Purchase Info */}
        {item.is_purchased && item.purchased_by && (
          <div className="text-sm text-green-600 mb-3">
            Purchased by {item.purchased_by}
            {item.purchased_at && (
              <div className="text-xs text-muted-foreground">
                {new Date(item.purchased_at).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {item.store_url && (
            <a
              href={item.store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center text-sm font-medium flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Item
            </a>
          )}
          
          <button
            onClick={togglePurchased}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              item.is_purchased
                ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {item.is_purchased ? 'Mark Available' : 'Mark Purchased'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}