-- Fix security vulnerability in waitlist_candidates table
-- Remove duplicate and potentially insecure RLS policies

-- Drop all existing policies on waitlist_candidates
DROP POLICY IF EXISTS "Admins can manage candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Admins can read candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Anyone can insert candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Only admins can manage candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Only admins can view candidates" ON public.waitlist_candidates;
DROP POLICY IF EXISTS "Public can join candidate waitlist" ON public.waitlist_candidates;

-- Create secure, non-conflicting RLS policies
-- 1. Allow public to join waitlist (INSERT only)
CREATE POLICY "Public can join waitlist"
ON public.waitlist_candidates
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Only admins can view candidate data (SELECT)
CREATE POLICY "Only admins can view candidates"
ON public.waitlist_candidates
FOR SELECT
TO authenticated
USING (is_admin());

-- 3. Only admins can modify candidate data (UPDATE)
CREATE POLICY "Only admins can update candidates"
ON public.waitlist_candidates
FOR UPDATE
TO authenticated
USING (is_admin());

-- 4. Only admins can delete candidate data (DELETE)
CREATE POLICY "Only admins can delete candidates"
ON public.waitlist_candidates
FOR DELETE
TO authenticated
USING (is_admin());

-- Log security fix
SELECT log_security_event(
    'security_fix_applied',
    'waitlist_candidates',
    null,
    null,
    '{"action": "fixed_rls_policies", "description": "Removed conflicting policies and secured candidate data access"}'::jsonb
);