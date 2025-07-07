-- Insert sample blog categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Wedding Planning', 'wedding-planning', 'Essential tips and guides for planning your perfect wedding'),
('Venues', 'venues', 'Beautiful wedding venues and location inspiration'),
('Fashion & Style', 'fashion-style', 'Wedding dress trends, groom fashion, and style inspiration'),
('Photography', 'photography', 'Wedding photography tips and inspiration'),
('Flowers & Decor', 'flowers-decor', 'Floral arrangements and wedding decoration ideas');

-- Insert sample blog tags
INSERT INTO public.blog_tags (name, slug) VALUES
('budget', 'budget'),
('diy', 'diy'),
('outdoor', 'outdoor'),
('vintage', 'vintage'),
('modern', 'modern'),
('summer', 'summer'),
('winter', 'winter'),
('tips', 'tips'),
('inspiration', 'inspiration'),
('checklist', 'checklist');

-- Insert sample blog posts (using a dummy author_id - in production, these would be real user IDs)
-- Note: We'll use gen_random_uuid() as placeholder author_id since we can't reference actual users here
INSERT INTO public.blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  featured_image_url,
  author_id,
  category_id,
  status,
  tags,
  seo_title,
  seo_description,
  published_at
) VALUES
(
  'Your Complete Wedding Planning Timeline: 12 Months to "I Do"',
  'complete-wedding-planning-timeline-12-months',
  '<h2>Starting Your Wedding Planning Journey</h2><p>Planning a wedding can feel overwhelming, but with the right timeline, you can enjoy every moment of your engagement while staying organized and stress-free.</p><h3>12 Months Before</h3><ul><li>Set your budget</li><li>Create your guest list</li><li>Book your venue</li><li>Hire your photographer</li></ul><h3>9 Months Before</h3><ul><li>Send save the dates</li><li>Book your caterer</li><li>Start dress shopping</li><li>Book entertainment</li></ul><h3>6 Months Before</h3><ul><li>Order invitations</li><li>Plan your menu</li><li>Book transportation</li><li>Register for gifts</li></ul><h3>3 Months Before</h3><ul><li>Send invitations</li><li>Finalize menu and headcount</li><li>Have dress fittings</li><li>Plan rehearsal dinner</li></ul><h3>1 Month Before</h3><ul><li>Confirm all vendors</li><li>Get marriage license</li><li>Finalize seating chart</li><li>Pack for honeymoon</li></ul><p>Remember, this timeline is flexible! Adjust it based on your specific needs and don''t forget to enjoy this special time in your life.</p>',
  'Planning a wedding in 12 months? Our comprehensive timeline breaks down everything you need to do, month by month, to create your perfect wedding day without the stress.',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=400&fit=crop',
  gen_random_uuid(),
  (SELECT id FROM public.blog_categories WHERE slug = 'wedding-planning' LIMIT 1),
  'published',
  ARRAY['planning', 'timeline', 'checklist', 'tips'],
  'Complete Wedding Planning Timeline: 12 Months to Your Perfect Day',
  'Get organized with our detailed 12-month wedding planning timeline. Everything you need to know to plan your dream wedding stress-free.',
  now() - interval '2 days'
),
(
  '10 Stunning Outdoor Wedding Venues That Will Take Your Breath Away',
  'stunning-outdoor-wedding-venues',
  '<h2>Say "I Do" Under the Open Sky</h2><p>There''s something magical about exchanging vows surrounded by nature''s beauty. Outdoor weddings offer endless possibilities for creating unforgettable memories.</p><h3>Garden Venues</h3><p>Botanical gardens provide a naturally stunning backdrop with manicured landscapes and seasonal blooms. The variety of settings within one location offers multiple photo opportunities.</p><h3>Beach Locations</h3><p>Beach weddings create a romantic, relaxed atmosphere. The sound of waves and ocean breeze add natural ambiance that no indoor venue can replicate.</p><h3>Mountain Settings</h3><p>Mountain venues offer breathtaking panoramic views and a sense of grandeur. Perfect for couples who love adventure and want dramatic photos.</p><h3>Vineyard Venues</h3><p>Vineyards combine natural beauty with elegant sophistication. Rolling hills and grapevines create a romantic, rustic-chic atmosphere.</p><h3>Planning Tips for Outdoor Weddings</h3><ul><li>Always have a backup plan for weather</li><li>Consider the season and time of day</li><li>Provide comfort for guests (fans, blankets, etc.)</li><li>Think about power sources for vendors</li><li>Plan for natural lighting in your timeline</li></ul>',
  'Discover breathtaking outdoor wedding venues that will make your special day unforgettable. From gardens to beaches, find the perfect natural setting for your ceremony.',
  'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop',
  gen_random_uuid(),
  (SELECT id FROM public.blog_categories WHERE slug = 'venues' LIMIT 1),
  'published',
  ARRAY['venues', 'outdoor', 'inspiration', 'nature'],
  '10 Stunning Outdoor Wedding Venues for Your Dream Day',
  'Find the perfect outdoor wedding venue with our guide to stunning natural locations that will make your special day truly magical.',
  now() - interval '5 days'
),
(
  'Budget-Friendly Wedding Flowers: How to Create Beautiful Arrangements on a Dime',
  'budget-friendly-wedding-flowers',
  '<h2>Beautiful Blooms Without Breaking the Bank</h2><p>Wedding flowers don''t have to cost a fortune. With smart planning and creative alternatives, you can have stunning floral arrangements that fit your budget.</p><h3>Choose In-Season Flowers</h3><p>Selecting flowers that are in season during your wedding month can save you hundreds of dollars. Spring brings tulips and daffodils, summer offers sunflowers and zinnias, fall features chrysanthemums and dahlias, and winter provides evergreens and amaryllis.</p><h3>DIY Centerpieces</h3><p>Creating your own centerpieces is easier than you think. Simple arrangements in mason jars or vintage vases can look just as elegant as expensive professional designs.</p><h3>Use Greenery as a Base</h3><p>Eucalyptus, ferns, and other greenery are typically less expensive than flowers and can create full, lush arrangements with just a few blooms mixed in.</p><h3>Alternative Options</h3><ul><li>Potted plants as centerpieces (guests can take them home)</li><li>Paper flowers for a unique, lasting option</li><li>Dried flowers for a rustic, vintage look</li><li>Single stem arrangements for minimalist elegance</li></ul><h3>Money-Saving Tips</h3><ul><li>Repurpose ceremony flowers for reception</li><li>Focus budget on bridal bouquet and ceremony arch</li><li>Use grocery store flowers for practice arrangements</li><li>Ask family and friends to contribute garden flowers</li></ul>',
  'Learn how to create stunning wedding flower arrangements without overspending. Discover budget-friendly alternatives and DIY tips for beautiful blooms on your special day.',
  'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=400&fit=crop',
  gen_random_uuid(),
  (SELECT id FROM public.blog_categories WHERE slug = 'flowers-decor' LIMIT 1),
  'published',
  ARRAY['budget', 'flowers', 'diy', 'tips', 'decor'],
  'Budget-Friendly Wedding Flowers: Beautiful Blooms for Less',
  'Discover how to create stunning wedding flower arrangements on a budget with our money-saving tips and DIY flower ideas.',
  now() - interval '1 week'
);