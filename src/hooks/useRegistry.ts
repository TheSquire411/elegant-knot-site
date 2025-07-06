import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useApp } from '../context/AppContext';
import { Registry, RegistryItem, ProductMetadata, AddRegistryItemData } from '../types/registry';

export function useRegistry() {
  const { state } = useApp();
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [registryItems, setRegistryItems] = useState<RegistryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);

  // Load user's registry and items
  const loadRegistry = async () => {
    if (!state.user) return;

    try {
      setIsLoading(true);
      
      // Get all registries for the user to handle duplicates
      const { data: allRegistries, error: registryError } = await supabase
        .from('registries')
        .select('*')
        .eq('user_id', state.user.id)
        .order('created_at', { ascending: true }); // Oldest first

      let registryData: Registry | null = null;

      if (registryError) {
        throw registryError;
      }

      if (!allRegistries || allRegistries.length === 0) {
        // No registry exists, create one
        const { data: newRegistry, error: createError } = await supabase
          .from('registries')
          .insert({
            user_id: state.user.id,
            title: 'Our Wedding Registry',
            description: 'Thank you for celebrating with us! Here are some items we\'d love to have as we start our new life together.',
            is_public: true
          })
          .select()
          .single();

        if (createError) throw createError;
        registryData = newRegistry;
      } else {
        // Use the oldest registry (first in the array)
        registryData = allRegistries[0];

        // If there are duplicate registries, consolidate them
        if (allRegistries.length > 1) {
          console.log(`Found ${allRegistries.length} registries for user. Consolidating...`);
          await consolidateDuplicateRegistries(allRegistries);
        }
      }

      setRegistry(registryData);

      // Load registry items for the primary registry
      if (registryData) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('registry_items')
          .select('*')
          .eq('registry_id', registryData.id)
          .order('created_at', { ascending: false });

        if (itemsError) throw itemsError;
        setRegistryItems((itemsData || []).map(item => ({
          ...item,
          priority: (item.priority || 'medium') as 'high' | 'medium' | 'low'
        })));
      }

    } catch (error) {
      console.error('Error loading registry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Consolidate duplicate registries by moving all items to the oldest registry
  const consolidateDuplicateRegistries = async (registries: Registry[]) => {
    if (registries.length <= 1) return;

    const primaryRegistry = registries[0]; // Oldest registry
    const duplicateRegistries = registries.slice(1); // All other registries

    try {
      // Move all items from duplicate registries to the primary registry
      for (const duplicateRegistry of duplicateRegistries) {
        const { data: itemsToMove, error: fetchError } = await supabase
          .from('registry_items')
          .select('*')
          .eq('registry_id', duplicateRegistry.id);

        if (fetchError) {
          console.error('Error fetching items from duplicate registry:', fetchError);
          continue;
        }

        if (itemsToMove && itemsToMove.length > 0) {
          // Update registry_id for all items
          const { error: updateError } = await supabase
            .from('registry_items')
            .update({ registry_id: primaryRegistry.id })
            .eq('registry_id', duplicateRegistry.id);

          if (updateError) {
            console.error('Error moving items to primary registry:', updateError);
            continue;
          }

          console.log(`Moved ${itemsToMove.length} items from duplicate registry to primary registry`);
        }

        // Delete the duplicate registry
        const { error: deleteError } = await supabase
          .from('registries')
          .delete()
          .eq('id', duplicateRegistry.id);

        if (deleteError) {
          console.error('Error deleting duplicate registry:', deleteError);
        } else {
          console.log('Deleted duplicate registry');
        }
      }
    } catch (error) {
      console.error('Error consolidating duplicate registries:', error);
    }
  };

  // Scrape product metadata from URL
  const scrapeProductMetadata = async (url: string): Promise<ProductMetadata | null> => {
    try {
      setIsScrapingUrl(true);
      
      const { data, error } = await supabase.functions.invoke('scrape-product-metadata', {
        body: { url }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error scraping product metadata:', error);
      return null;
    } finally {
      setIsScrapingUrl(false);
    }
  };

  // Add registry item
  const addRegistryItem = async (itemData: AddRegistryItemData): Promise<boolean> => {
    if (!state.user || !registry) return false;

    try {
      const { data, error } = await supabase
        .from('registry_items')
        .insert({
          registry_id: registry.id,
          user_id: state.user.id,
          ...itemData
        })
        .select()
        .single();

      if (error) throw error;

      setRegistryItems(prev => [{
        ...data,
        priority: (data.priority || 'medium') as 'high' | 'medium' | 'low'
      }, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding registry item:', error);
      return false;
    }
  };

  // Update registry item
  const updateRegistryItem = async (itemId: string, updates: Partial<RegistryItem>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('registry_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      setRegistryItems(prev =>
        prev.map(item => item.id === itemId ? {
          ...data,
          priority: (data.priority || 'medium') as 'high' | 'medium' | 'low'
        } : item)
      );
      return true;
    } catch (error) {
      console.error('Error updating registry item:', error);
      return false;
    }
  };

  // Delete registry item
  const deleteRegistryItem = async (itemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('registry_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setRegistryItems(prev => prev.filter(item => item.id !== itemId));
      return true;
    } catch (error) {
      console.error('Error deleting registry item:', error);
      return false;
    }
  };

  // Update registry settings
  const updateRegistry = async (updates: Partial<Registry>): Promise<boolean> => {
    if (!registry) return false;

    try {
      const { data, error } = await supabase
        .from('registries')
        .update(updates)
        .eq('id', registry.id)
        .select()
        .single();

      if (error) throw error;

      setRegistry(data);
      return true;
    } catch (error) {
      console.error('Error updating registry:', error);
      return false;
    }
  };

  // Mark item as purchased (for guest view)
  const markItemPurchased = async (itemId: string, purchasedBy?: string): Promise<boolean> => {
    return updateRegistryItem(itemId, {
      is_purchased: true,
      purchased_by: purchasedBy,
      purchased_at: new Date().toISOString(),
      quantity_purchased: 1
    });
  };

  useEffect(() => {
    loadRegistry();
  }, [state.user]);

  // Calculate registry statistics
  const registryStats = {
    totalItems: registryItems.length,
    purchasedItems: registryItems.filter(item => item.is_purchased).length,
    totalValue: registryItems.reduce((sum, item) => sum + (item.price || 0), 0),
    purchasedValue: registryItems
      .filter(item => item.is_purchased)
      .reduce((sum, item) => sum + (item.price || 0), 0),
  };

  return {
    registry,
    registryItems,
    registryStats,
    isLoading,
    isScrapingUrl,
    loadRegistry,
    scrapeProductMetadata,
    addRegistryItem,
    updateRegistryItem,
    deleteRegistryItem,
    updateRegistry,
    markItemPurchased
  };
}