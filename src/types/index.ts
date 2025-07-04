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