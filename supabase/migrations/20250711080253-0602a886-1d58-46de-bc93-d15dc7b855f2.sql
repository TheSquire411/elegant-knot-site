ALTER VIEW public.admin_feature_usage_stats
  SET (security_invoker = true);

-- Fix for admin_user_stats view
ALTER VIEW public.admin_user_stats SET (security_invoker = true);

-- Fix for admin_subscription_stats view
ALTER VIEW public.admin_subscription_stats SET (security_invoker = true);

-- Fix for admin_content_stats view
ALTER VIEW public.admin_content_stats SET (security_invoker = true);