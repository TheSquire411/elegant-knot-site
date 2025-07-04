-- Add database-level validation constraints for data integrity

-- Add constraints to expenses table
ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_title_length_check 
CHECK (char_length(title) > 0 AND char_length(title) <= 255);

ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_amount_positive_check 
CHECK (amount > 0);

ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_notes_length_check 
CHECK (notes IS NULL OR char_length(notes) <= 2000);

-- Add constraints to budgets table
ALTER TABLE public.budgets 
ADD CONSTRAINT budgets_name_length_check 
CHECK (char_length(name) > 0 AND char_length(name) <= 100);

ALTER TABLE public.budgets 
ADD CONSTRAINT budgets_total_amount_positive_check 
CHECK (total_amount >= 0);

ALTER TABLE public.budgets 
ADD CONSTRAINT budgets_spent_amount_non_negative_check 
CHECK (spent_amount >= 0);

ALTER TABLE public.budgets 
ADD CONSTRAINT budgets_currency_valid_check 
CHECK (currency IS NULL OR char_length(currency) = 3);

-- Add constraints to profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_length_check 
CHECK (username IS NULL OR (char_length(username) >= 3 AND char_length(username) <= 50));

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_full_name_length_check 
CHECK (full_name IS NULL OR (char_length(full_name) > 0 AND char_length(full_name) <= 100));

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_valid_check 
CHECK (role IN ('user', 'admin', 'moderator'));

-- Add constraints to wedding_websites table
ALTER TABLE public.wedding_websites 
ADD CONSTRAINT wedding_websites_title_length_check 
CHECK (char_length(title) > 0 AND char_length(title) <= 200);

ALTER TABLE public.wedding_websites 
ADD CONSTRAINT wedding_websites_status_valid_check 
CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE public.wedding_websites 
ADD CONSTRAINT wedding_websites_slug_format_check 
CHECK (slug IS NULL OR (char_length(slug) >= 3 AND char_length(slug) <= 100 AND slug ~ '^[a-z0-9-]+$'));