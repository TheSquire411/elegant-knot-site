import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { BlogPost, BlogCategory, BlogTag, CreateBlogPostData, UpdateBlogPostData } from '../types/blog';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all published blog posts
  const fetchPosts = async (limit?: number, category?: string, tag?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(name, slug),
          author:profiles!blog_posts_author_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      if (category) {
        query = query.eq('category.slug', category);
      }

      // For tag filtering, we'll need to use the tags array
      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      // Filter by tag if specified
      if (tag) {
        filteredData = filteredData.filter(post => 
          post.tags && post.tags.includes(tag)
        );
      }

      setPosts(filteredData as unknown as BlogPost[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single blog post by slug
  const fetchPost = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(name, slug),
          author:profiles!blog_posts_author_id_fkey(full_name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data as unknown as BlogPost;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch blog post');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    }
  };

  // Admin functions
  const createPost = async (postData: CreateBlogPostData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newPost = {
        ...postData,
        author_id: user.id,
        published_at: postData.status === 'published' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const updatePost = async (postData: UpdateBlogPostData) => {
    try {
      const { id, ...updateData } = postData;

      // Set published_at if changing to published status
      if (postData.status === 'published') {
        (updateData as any).published_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', postData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, []);

  return {
    posts,
    categories,
    tags,
    loading,
    error,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    refetch: () => {
      fetchPosts();
      fetchCategories();
      fetchTags();
    }
  };
}