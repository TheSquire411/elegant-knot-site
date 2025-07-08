-- Fix admin functions - remove duplicates and fix column ambiguity

-- Drop the old version of admin_get_users function that doesn't have enhanced parameters
DROP FUNCTION IF EXISTS public.admin_get_users(integer, integer, text);

-- Recreate the enhanced admin_get_users function with proper column aliasing
CREATE OR REPLACE FUNCTION public.admin_get_users(
  p_search TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_sort_by TEXT DEFAULT 'created_at',
  p_sort_order TEXT DEFAULT 'desc'
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
  last_sign_in_at TIMESTAMPTZ,
  total_count BIGINT
)
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
DECLARE
  sort_column TEXT;
  sort_direction TEXT;
  total_users BIGINT;
BEGIN
  -- CRITICAL: Check if caller is admin before returning any data
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Validate and sanitize input parameters
  IF p_limit < 1 OR p_limit > 100 THEN
    RAISE EXCEPTION 'Invalid limit: must be between 1 and 100';
  END IF;
  
  IF p_offset < 0 THEN
    RAISE EXCEPTION 'Invalid offset: must be non-negative';  
  END IF;

  -- Sanitize search parameter
  IF p_search IS NOT NULL AND LENGTH(p_search) > 100 THEN
    RAISE EXCEPTION 'Search term too long: maximum 100 characters';
  END IF;

  -- Validate sort parameters
  sort_column := CASE p_sort_by
    WHEN 'created_at' THEN 'p.created_at'
    WHEN 'full_name' THEN 'p.full_name'
    WHEN 'role' THEN 'p.role'
    WHEN 'subscription_tier' THEN 'p.subscription_tier'
    WHEN 'last_sign_in_at' THEN 'au.last_sign_in_at'
    ELSE 'p.created_at'
  END;

  sort_direction := CASE UPPER(p_sort_order)
    WHEN 'ASC' THEN 'ASC'
    WHEN 'DESC' THEN 'DESC'
    ELSE 'DESC'
  END;

  -- Get total count for pagination
  SELECT COUNT(*) INTO total_users
  FROM public.profiles p
  WHERE (p_search IS NULL OR 
         p.full_name ILIKE '%' || p_search || '%' OR 
         p.username ILIKE '%' || p_search || '%');

  -- Return paginated user data with proper table aliases
  RETURN QUERY EXECUTE format('
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
      au.last_sign_in_at,
      %L::BIGINT as total_count
    FROM public.profiles p
    LEFT JOIN auth.users au ON au.id = p.user_id
    WHERE ($1 IS NULL OR 
           p.full_name ILIKE ''%%'' || $1 || ''%%'' OR 
           p.username ILIKE ''%%'' || $1 || ''%%'')
    ORDER BY %s %s
    LIMIT $2
    OFFSET $3
  ', total_users, sort_column, sort_direction)
  USING p_search, p_limit, p_offset;
END;
$$;