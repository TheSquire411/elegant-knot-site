export interface Registry {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegistryItem {
  id: string;
  registry_id: string;
  user_id: string;
  title: string;
  description?: string | null;
  price?: number | null;
  image_url?: string | null;
  store_url?: string | null;
  store_name?: string | null;
  is_purchased: boolean;
  purchased_by?: string | null;
  purchased_at?: string | null;
  priority: 'high' | 'medium' | 'low';
  quantity_wanted: number;
  quantity_purchased: number;
  created_at: string;
  updated_at: string;
}

export interface ProductMetadata {
  title: string;
  description?: string;
  price?: string;
  image_url?: string;
  store_name: string;
}

export interface AddRegistryItemData {
  title: string;
  description?: string;
  price?: number;
  image_url?: string;
  store_url?: string;
  store_name?: string;
  priority?: 'high' | 'medium' | 'low';
  quantity_wanted?: number;
}