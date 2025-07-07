-- Fix infinite recursion in profiles table RLS policies

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admin views access policy" ON public.profiles;

-- Create a new admin policy using the existing security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');