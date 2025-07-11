-- Add secure search_path to all functions to prevent search path injection attacks

-- Admin Functions
ALTER FUNCTION public.cleanup_auth_rate_limits() SET search_path = '';
ALTER FUNCTION public.check_auth_rate_limit(text, text, integer, integer) SET search_path = '';
ALTER FUNCTION public.admin_update_user_role(uuid, text) SET search_path = '';
ALTER FUNCTION public.admin_update_user_subscription(uuid, subscription_tier) SET search_path = '';
ALTER FUNCTION public.admin_get_users(text, integer, integer, text, text) SET search_path = '';

-- User Role & Authentication
ALTER FUNCTION public.get_current_user_role() SET search_path = '';

-- Website Management
ALTER FUNCTION public.generate_website_slug(text, uuid) SET search_path = '';
ALTER FUNCTION public.handle_website_publishing() SET search_path = '';
ALTER FUNCTION public.validate_website_for_publishing(uuid) SET search_path = '';

-- Utility Functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.update_budget_spent_amount() SET search_path = '';

-- Feature Usage Functions
ALTER FUNCTION public.get_current_usage(uuid, text) SET search_path = '';
ALTER FUNCTION public.increment_usage(uuid, text) SET search_path = '';
ALTER FUNCTION public.can_use_feature(uuid, text) SET search_path = '';