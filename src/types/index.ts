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