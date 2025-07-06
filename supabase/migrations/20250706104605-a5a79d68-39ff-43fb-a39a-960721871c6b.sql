-- Create admin analytics views and functions
CREATE OR REPLACE VIEW public.admin_user_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN created_at >= date_trunc('month', now()) THEN 1 END) as new_this_month,
  COUNT(CASE WHEN subscription_tier != 'free' THEN 1 END) as paid_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users
FROM public.profiles;

CREATE OR REPLACE VIEW public.admin_subscription_stats AS
SELECT 
  subscription_tier,
  COUNT(*) as user_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM public.profiles
GROUP BY subscription_tier;

CREATE OR REPLACE VIEW public.admin_feature_usage_stats AS
SELECT 
  feature_type,
  SUM(usage_count) as total_usage,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(usage_count) as avg_per_user
FROM public.feature_usage
WHERE reset_date >= date_trunc('month', now())
GROUP BY feature_type;

CREATE OR REPLACE VIEW public.admin_content_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.wedding_websites) as total_websites,
  (SELECT COUNT(*) FROM public.budgets) as total_budgets,
  (SELECT COUNT(*) FROM public.guests) as total_guests,
  (SELECT COUNT(*) FROM public.registries) as total_registries;

-- Admin function to get user list with details
CREATE OR REPLACE FUNCTION public.admin_get_users(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  role TEXT,
  subscription_tier subscription_tier,
  subscription_status subscription_status,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
)
SECURITY DEFINER
LANGUAGE SQL
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.role,
    p.subscription_tier,
    p.subscription_status,
    p.created_at,
    p.updated_at,
    au.last_sign_in_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON au.id = p.user_id
  WHERE (p_search IS NULL OR 
         p.full_name ILIKE '%' || p_search || '%' OR 
         p.username ILIKE '%' || p_search || '%')
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- Admin function to update user role
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- Only allow admin users to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  UPDATE public.profiles 
  SET role = p_new_role, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Admin function to update user subscription
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(
  p_user_id UUID,
  p_new_tier subscription_tier
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- Only allow admin users to call this function
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  UPDATE public.profiles 
  SET subscription_tier = p_new_tier, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- RLS policies for admin views
CREATE POLICY "admin_user_stats_policy" ON public.profiles FOR SELECT TO authenticated 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Grant access to admin views for authenticated users (RLS will handle admin check)
GRANT SELECT ON public.admin_user_stats TO authenticated;
GRANT SELECT ON public.admin_subscription_stats TO authenticated;
GRANT SELECT ON public.admin_feature_usage_stats TO authenticated;
GRANT SELECT ON public.admin_content_stats TO authenticated;