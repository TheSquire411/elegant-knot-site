export interface Guest {
  id: string;
  user_id: string;
  guest_group_id?: string | null;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  dietary_restrictions?: string | null;
  notes?: string | null;
  relationship?: string | null;
  is_plus_one: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface GuestGroup {
  id: string;
  user_id: string;
  name: string;
  type: string | null;
  max_size: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  guests?: Guest[];
}

export interface RSVPResponse {
  id: string;
  user_id: string;
  guest_id: string;
  attending?: boolean | null;
  response_date?: string | null;
  meal_choice?: string | null;
  additional_notes?: string | null;
  plus_one_name?: string | null;
  plus_one_attending?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface SeatingTable {
  id: string;
  user_id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangular' | 'square';
  x_position: number;
  y_position: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SeatingAssignment {
  id: string;
  user_id: string;
  guest_group_id: string;
  seating_table_id: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export type GuestRelationship = 
  | 'family' 
  | 'friends' 
  | 'colleagues' 
  | 'bride_family' 
  | 'groom_family' 
  | 'bride_friends' 
  | 'groom_friends'
  | 'other';