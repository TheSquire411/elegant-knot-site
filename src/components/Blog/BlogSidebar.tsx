import { Link } from 'react-router-dom';
import { Folder, Tag, TrendingUp } from 'lucide-react';
import { BlogCategory, BlogTag } from '../../types/blog';

interface BlogSidebarProps {
  categories: BlogCategory[];
  tags: BlogTag[];
}

export default function BlogSidebar({ categories, tags }: BlogSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/blog/category/${category.slug}`}
              className="block text-sage-600 hover:text-primary-600 hover:bg-primary-50 rounded px-2 py-1 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 10).map((tag) => (
            <Link
              key={tag.id}
              to={`/blog/tag/${tag.slug}`}
              className="inline-block bg-sage-100 hover:bg-primary-100 text-sage-700 hover:text-primary-700 px-3 py-1 rounded-full text-sm transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts Widget */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recent Posts
        </h3>
        <div className="text-sm text-sage-600">
          <p>Recent posts will appear here once you start publishing content.</p>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-primary-100 text-sm mb-4">
          Get the latest wedding planning tips and inspiration delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded text-gray-900 text-sm"
          />
          <button className="w-full bg-white text-primary-600 px-4 py-2 rounded font-medium text-sm hover:bg-primary-50 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}