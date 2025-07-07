export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  author_id: string;
  category_id?: string | null;
  status: 'draft' | 'published';
  tags: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  status: 'draft' | 'published';
  tags: string[];
  seo_title?: string;
  seo_description?: string;
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}