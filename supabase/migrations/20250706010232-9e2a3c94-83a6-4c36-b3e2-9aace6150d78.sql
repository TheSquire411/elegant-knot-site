-- Update subscription tiers to reflect new pricing structure
UPDATE public.subscription_tiers 
SET 
  name = 'Wedly Plus',
  price_monthly = 4900, -- $49 in cents
  price_yearly = 4900,   -- One-time payment
  ai_conversations_limit = 10, -- Limited AI chats
  vision_boards_limit = NULL, -- Unlimited
  photo_uploads_limit = NULL, -- Unlimited 
  custom_domain = true,
  advanced_analytics = false,
  collaboration_tools = false,
  priority_support = false
WHERE tier = 'basic';

UPDATE public.subscription_tiers 
SET 
  name = 'Wedly Pro',
  price_monthly = 9900, -- $99 in cents  
  price_yearly = 9900,   -- One-time payment
  ai_conversations_limit = NULL, -- Unlimited AI chats
  vision_boards_limit = NULL, -- Unlimited
  photo_uploads_limit = NULL, -- Unlimited
  custom_domain = true,
  advanced_analytics = true,
  collaboration_tools = true,
  priority_support = true
WHERE tier = 'premium';

-- Remove enterprise tier or convert it (keeping it but making it same as pro for now)
UPDATE public.subscription_tiers 
SET 
  name = 'Wedly Pro Max',
  price_monthly = 9900, -- Same as Pro for now
  price_yearly = 9900,
  ai_conversations_limit = NULL,
  vision_boards_limit = NULL, 
  photo_uploads_limit = NULL,
  custom_domain = true,
  advanced_analytics = true,
  collaboration_tools = true,
  priority_support = true
WHERE tier = 'enterprise';