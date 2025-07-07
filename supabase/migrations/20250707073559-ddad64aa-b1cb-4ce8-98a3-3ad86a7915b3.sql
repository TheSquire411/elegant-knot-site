-- Update current user's role to admin
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE user_id = '863bd33f-46f7-4711-a8eb-91730af699ab';