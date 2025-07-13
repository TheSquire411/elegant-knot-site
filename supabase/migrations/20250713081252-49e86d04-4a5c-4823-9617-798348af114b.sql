-- Update subscription tiers to restrict guest photo features to paid users only
UPDATE public.subscription_tiers 
SET photo_uploads_limit = 0 
WHERE tier = 'free';

-- Ensure paid tiers have appropriate limits
UPDATE public.subscription_tiers 
SET photo_uploads_limit = 50 
WHERE tier = 'basic';

UPDATE public.subscription_tiers 
SET photo_uploads_limit = 200 
WHERE tier = 'premium';

UPDATE public.subscription_tiers 
SET photo_uploads_limit = NULL 
WHERE tier = 'enterprise';