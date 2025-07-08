-- Update the get_current_user_role function to be SECURITY DEFINER so it bypasses RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- Drop the problematic policy if it exists
DROP POLICY IF EXISTS "admin_user_stats_policy" ON public.profiles;

-- Recreate the policy using the now-safe get_current_user_role function
CREATE POLICY "admin_user_stats_policy" ON public.profiles FOR SELECT TO authenticated
USING (public.get_current_user_role() = 'admin');