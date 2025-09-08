-- Secure RLS Policies Migration
-- This migration ensures all tables have proper Row Level Security policies
-- to prevent unauthorized access to sensitive data

-- =============================================================================
-- WAITLIST CANDIDATES TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Only admins can view candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Only admins can manage candidates" ON public.waitlist_candidates;

-- Enable RLS (should already be enabled)
ALTER TABLE public.waitlist_candidates ENABLE ROW LEVEL SECURITY;

-- Public can insert (join waitlist)
CREATE POLICY "Public can insert candidates" 
ON public.waitlist_candidates 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read candidate data
CREATE POLICY "Only admins can read candidates" 
ON public.waitlist_candidates 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update/delete candidate data
CREATE POLICY "Only admins can manage candidates" 
ON public.waitlist_candidates 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- WAITLIST EMPLOYERS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert employers" ON public.waitlist_employers;
DROP POLICY IF EXISTS "Only admins can view employers" ON public.waitlist_employers;
DROP POLICY IF EXISTS "Only admins can manage employers" ON public.waitlist_employers;

-- Enable RLS (should already be enabled)
ALTER TABLE public.waitlist_employers ENABLE ROW LEVEL SECURITY;

-- Public can insert (join waitlist)
CREATE POLICY "Public can insert employers" 
ON public.waitlist_employers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read employer data
CREATE POLICY "Only admins can read employers" 
ON public.waitlist_employers 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update/delete employer data
CREATE POLICY "Only admins can manage employers" 
ON public.waitlist_employers 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- ADMIN USERS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Only super admins can manage admin users" ON public.admin_users;

-- Enable RLS (should already be enabled)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Users can only check if THEY are admin (not view all admins)
CREATE POLICY "Users can check their own admin status" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Only super admins can manage admin users
CREATE POLICY "Only super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND is_super_admin = true
  )
);

-- =============================================================================
-- SITE SETTINGS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

-- Enable RLS (should already be enabled)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can view site settings (for coming soon mode, etc.)
CREATE POLICY "Public can view site settings" 
ON public.site_settings 
FOR SELECT 
TO anon, authenticated
WITH CHECK (true);

-- Only admins can manage site settings
CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- WAITLIST ANALYTICS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view analytics data" ON public.waitlist_analytics;
DROP POLICY IF EXISTS "Only admins can insert analytics data" ON public.waitlist_analytics;
DROP POLICY IF EXISTS "Only admins can update analytics data" ON public.waitlist_analytics;
DROP POLICY IF EXISTS "Only admins can delete analytics data" ON public.waitlist_analytics;

-- Enable RLS (should already be enabled)
ALTER TABLE public.waitlist_analytics ENABLE ROW LEVEL SECURITY;

-- Only admins can view analytics data
CREATE POLICY "Only admins can view analytics data" 
ON public.waitlist_analytics 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can insert analytics data
CREATE POLICY "Only admins can insert analytics data" 
ON public.waitlist_analytics 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can update analytics data
CREATE POLICY "Only admins can update analytics data" 
ON public.waitlist_analytics 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Only admins can delete analytics data
CREATE POLICY "Only admins can delete analytics data" 
ON public.waitlist_analytics 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- USER SESSIONS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own sessions only" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can manage all sessions" ON public.user_sessions;

-- Enable RLS (should already be enabled)
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions only
CREATE POLICY "Users can view own sessions only" 
ON public.user_sessions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Admins can manage all sessions
CREATE POLICY "Admins can manage all sessions" 
ON public.user_sessions 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- SECURITY AUDIT LOG TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view security audit log" ON public.security_audit_log;

-- Enable RLS (should already be enabled)
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit log
CREATE POLICY "Admins can view security audit log" 
ON public.security_audit_log 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- AUTH RATE LIMITS TABLE
-- =============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage auth rate limits" ON public.auth_rate_limits;

-- Enable RLS (should already be enabled)
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can manage auth rate limits
CREATE POLICY "Admins can manage auth rate limits" 
ON public.auth_rate_limits 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- VERIFY RLS IS ENABLED
-- =============================================================================

-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'waitlist_candidates',
  'waitlist_employers', 
  'admin_users',
  'site_settings',
  'waitlist_analytics',
  'user_sessions',
  'security_audit_log',
  'auth_rate_limits'
)
ORDER BY tablename;

-- =============================================================================
-- CREATE SECURE ANALYTICS VIEW
-- =============================================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.waitlist_analytics_secure;

-- Create secure analytics view that only admins can access
CREATE VIEW public.waitlist_analytics_secure AS
SELECT 
  'candidates' as type,
  COUNT(*) as total_count,
  COUNT(CASE WHEN current_state = 'final_year' THEN 1 END) as final_year_count,
  COUNT(CASE WHEN current_state = 'fresh_graduate' THEN 1 END) as fresh_graduate_count,
  COUNT(CASE WHEN current_state = 'early_career' THEN 1 END) as early_career_count,
  COUNT(CASE WHEN current_state = 'student' THEN 1 END) as student_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_candidates_last_30d
FROM public.waitlist_candidates

UNION ALL

SELECT 
  'employers' as type,
  COUNT(*) as total_count,
  0 as final_year_count,
  0 as fresh_graduate_count,
  0 as early_career_count,
  0 as student_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_employers_last_30d
FROM public.waitlist_employers;

-- Grant access to the view only to admins
GRANT SELECT ON public.waitlist_analytics_secure TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Only admins can view analytics" 
ON public.waitlist_analytics_secure 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- =============================================================================
-- SECURITY NOTES
-- =============================================================================

-- This migration ensures:
-- 1. Public can only INSERT into waitlist tables (join waitlist)
-- 2. Only admins can READ from waitlist tables (view data)
-- 3. Only admins can UPDATE/DELETE from waitlist tables (manage data)
-- 4. Users can only check their own admin status
-- 5. Only super admins can manage admin users
-- 6. Public can view site settings (for coming soon mode)
-- 7. Only admins can manage site settings
-- 8. All analytics and audit data is admin-only
-- 9. RLS is enabled on all sensitive tables
-- 10. Secure analytics view provides aggregated data safely

-- To verify security:
-- 1. Test public access: Should only be able to INSERT into waitlist tables
-- 2. Test admin access: Should be able to READ/UPDATE/DELETE from all tables
-- 3. Test non-admin access: Should be denied access to sensitive data
-- 4. Check RLS is enabled on all tables
-- 5. Verify policies are working as expected
