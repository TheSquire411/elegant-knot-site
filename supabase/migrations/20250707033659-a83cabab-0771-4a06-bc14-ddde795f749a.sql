-- Fix critical security vulnerabilities in admin functions

-- Update admin_get_users function to include proper authorization check
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
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- CRITICAL: Check if caller is admin before returning any data
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Validate and sanitize input parameters
  IF p_limit < 1 OR p_limit > 1000 THEN
    RAISE EXCEPTION 'Invalid limit: must be between 1 and 1000';
  END IF;
  
  IF p_offset < 0 THEN
    RAISE EXCEPTION 'Invalid offset: must be non-negative';  
  END IF;

  -- Sanitize search parameter to prevent any potential issues
  IF p_search IS NOT NULL AND LENGTH(p_search) > 100 THEN
    RAISE EXCEPTION 'Search term too long: maximum 100 characters';
  END IF;

  -- Return user data with proper parameterized query
  RETURN QUERY
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
END;
$$;

-- Enhance admin_update_user_role with better validation
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Validate role parameter
  IF p_new_role NOT IN ('user', 'admin', 'moderator') THEN
    RAISE EXCEPTION 'Invalid role: must be user, admin, or moderator';
  END IF;

  -- Prevent self-demotion (admin removing their own admin role)
  IF p_user_id = auth.uid() AND p_new_role != 'admin' THEN
    RAISE EXCEPTION 'Cannot modify your own admin role';
  END IF;

  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update the role
  UPDATE public.profiles 
  SET role = p_new_role, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Enhance admin_update_user_subscription with better validation  
CREATE OR REPLACE FUNCTION public.admin_update_user_subscription(
  p_user_id UUID,
  p_new_tier subscription_tier
)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Update the subscription tier
  UPDATE public.profiles 
  SET subscription_tier = p_new_tier, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Add proper RLS policies for admin views
CREATE POLICY "Admin views access policy" ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create audit log table for admin actions (optional but recommended)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);