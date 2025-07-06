-- Update admin@admin.com user's role to admin
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE user_id = 'bc381da2-432b-45b6-968b-1b4b3f3e9e07';