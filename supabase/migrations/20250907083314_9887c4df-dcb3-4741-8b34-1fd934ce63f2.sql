-- Critical security fixes for data protection

-- 1. Secure waitlist_analytics table - restrict access to admins only
ALTER TABLE public.waitlist_analytics ENABLE ROW LEVEL SECURITY;

-- Add RLS policy to restrict analytics data to admins only
CREATE POLICY "Only admins can view analytics data" 
ON public.waitlist_analytics 
FOR SELECT 
USING (is_admin());

-- 2. Restrict site_settings access - remove public read access
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

-- Keep only the authenticated admin access policy
-- The existing "Admins can view site settings" policy is sufficient

-- 3. Add RLS policies for other sensitive operations
CREATE POLICY "Only admins can insert analytics data" 
ON public.waitlist_analytics 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update analytics data" 
ON public.waitlist_analytics 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete analytics data" 
ON public.waitlist_analytics 
FOR DELETE 
USING (is_admin());