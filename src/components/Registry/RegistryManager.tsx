import { useState } from 'react';
import { Plus, Edit, Search, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { useRegistry } from '../../hooks/useRegistry';
import BackButton from '../common/BackButton';
import { AddRegistryItemModal } from './AddRegistryItemModal';
import { RegistryItemCard } from './RegistryItemCard';
import { RegistrySettingsModal } from './RegistrySettingsModal';

export default function RegistryManager() {
  const {
    registry,
    registryItems,
    registryStats,
    isLoading,
    updateRegistryItem,
    deleteRegistryItem,
    updateRegistry
  } = useRegistry();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'purchased'>('all');

  const filteredItems = registryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.store_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'purchased' && item.is_purchased) ||
                         (filterStatus === 'available' && !item.is_purchased);
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="subheading-accent text-primary mb-2">Wedding Registry</div>
            <h1 className="section-heading">{registry?.title}</h1>
            <p className="elegant-text mt-2">{registry?.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Settings
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Item
            </button>
          </div>
        </div>

        {/* Registry Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-foreground">{registryStats.totalItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Purchased</p>
                <p className="text-2xl font-bold text-foreground">{registryStats.purchasedItems}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${registryStats.totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center">
              <div className="h-5 w-5 bg-green-500 rounded-full mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold text-foreground">
                  {registryStats.totalItems > 0 
                    ? Math.round((registryStats.purchasedItems / registryStats.totalItems) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="purchased">Purchased</option>
          </select>
        </div>
      </div>

      {/* Registry Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="section-heading text-xl mb-2">
            {registryItems.length === 0 ? 'No items in your registry yet' : 'No items match your filters'}
          </h3>
          <p className="elegant-text mb-4">
            {registryItems.length === 0 
              ? 'Start building your registry by adding items from your favorite stores'
              : 'Try adjusting your search or filters to see more items'
            }
          </p>
          {registryItems.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Your First Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <RegistryItemCard
              key={item.id}
              item={item}
              onUpdate={updateRegistryItem}
              onDelete={deleteRegistryItem}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddRegistryItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <RegistrySettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        registry={registry}
        onUpdate={updateRegistry}
      />
    </div>
  );
}