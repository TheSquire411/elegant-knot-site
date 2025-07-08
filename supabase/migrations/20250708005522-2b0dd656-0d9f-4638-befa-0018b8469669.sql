-- Fix all admin functions and RLS policies - remove column ambiguity issues

-- Fix admin_update_user_role function
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
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
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
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  UPDATE public.profiles 
  SET role = p_new_role, updated_at = now()
  WHERE profiles.user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Fix admin_update_user_subscription function
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
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Verify target user exists
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = p_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  UPDATE public.profiles 
  SET subscription_tier = p_new_tier, updated_at = now()
  WHERE profiles.user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Fix the RLS policy on profiles table - drop and recreate with proper column references
DROP POLICY IF EXISTS "admin_user_stats_policy" ON public.profiles;

CREATE POLICY "admin_user_stats_policy" ON public.profiles FOR SELECT TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles p2 
  WHERE p2.user_id = auth.uid() AND p2.role = 'admin'
));