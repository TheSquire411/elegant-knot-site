export interface GalleryImage {
  id: string;
  filename: string;
  url: string;
  thumbnail: string;
  size: number;
  uploadDate: Date;
  caption?: string;
  tags?: string[];
  category: string;
  isFavorite: boolean;
}

export interface StyleProfile {
  style: string;
  guestCount: number;
  budget: number;
}

export interface WeddingData {
  weddingDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'user';
  styleProfile?: StyleProfile;
  weddingDate?: string;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  time?: string;
  completed: boolean;
  notes?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  total_amount: number;
  spent_amount: number;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  budget_id: string;
  user_id: string;
  title: string;
  amount: number;
  due_date: string | null;
  notes: string | null;
  receipt_url: string | null;
  task_id: string | null;
  category: string | null;
  is_recurring: boolean | null;
  is_paid: boolean | null;
  created_at: string;
  updated_at: string;
}