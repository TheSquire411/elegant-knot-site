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

// Wedding Website Types
export interface WeddingWebsite {
  id: string;
  user_id: string;
  title: string;
  slug?: string;
  domain?: string;
  status: 'draft' | 'published' | 'archived';
  content: WebsiteContent;
  theme: WebsiteTheme;
  settings: WebsiteSettings;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSection {
  id: string;
  website_id: string;
  section_type: string;
  title?: string;
  content: any;
  settings: any;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteContent {
  coupleNames?: string;
  weddingDate?: string;
  venue?: {
    name: string;
    address: string;
  };
  ourStory?: {
    content: string;
    style: 'romantic' | 'casual' | 'formal';
    photos: string[];
  };
  schedule?: {
    ceremony: {
      time: string;
      location: string;
    };
    reception: {
      time: string;
      location: string;
    };
  };
  registry?: {
    message: string;
    stores: Array<{
      name: string;
      url: string;
    }>;
  };
  accommodations?: Array<{
    name: string;
    address: string;
    phone: string;
    website?: string;
    rate: string;
  }>;
  travel?: {
    airport?: string;
    directions?: string;
    parking?: string;
  };
}

export interface WebsiteTheme {
  style?: string;
  colors: string[];
  fonts: {
    heading: string;
    body: string;
  };
  // Extended AI template properties
  layout?: {
    headerStyle?: string;
    sectionOrder?: string[];
    spacing?: string;
    imageLayout?: string;
  };
  colorPalette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    headingWeight?: number;
    bodyWeight?: number;
  };
}

export interface WebsiteSettings {
  customCSS?: string;
  seoTitle?: string;
  seoDescription?: string;
  analytics?: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  features?: {
    rsvp: boolean;
    guestBook: boolean;
    photoSharing: boolean;
  };
}