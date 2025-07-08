-- Remove the duplicate RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;