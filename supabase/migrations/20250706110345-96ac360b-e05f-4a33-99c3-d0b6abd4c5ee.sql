-- Update current user's role to admin
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE user_id = '402bdcab-0d1e-48d6-afa2-dc8d987aa94a';