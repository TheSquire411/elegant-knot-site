import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { formatDistanceToNow } from 'date-fns';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between text-sm text-sage-600 mb-3">
          <div className="flex items-center gap-4">
            {post.category && (
              <Link
                to={`/blog/category/${post.category.slug}`}
                className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium hover:bg-primary-200 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-primary-900 mb-3 leading-tight">
          <Link
            to={`/blog/${post.slug}`}
            className="hover:text-primary-700 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sage-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/blog/tag/${tag}`}
                className="inline-flex items-center gap-1 text-xs text-sage-500 hover:text-primary-600 transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-sage-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-sage-100">
          {/* Author */}
          <div className="flex items-center gap-2 text-sm text-sage-600">
            <User className="h-4 w-4" />
            <span>{post.author?.full_name || 'Anonymous'}</span>
          </div>

          {/* Read More */}
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Read more
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}