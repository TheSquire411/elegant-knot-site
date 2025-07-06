-- Fix infinite recursion in profiles table RLS policies

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "admin_user_stats_policy" ON public.profiles;

-- Create a security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;