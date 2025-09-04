-- Fix all critical security vulnerabilities identified in the scan

-- 1. Secure admin_users table - remove public access to admin emails
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Only allow users to check if THEY are admin (not view all admins)
CREATE POLICY "Users can check their own admin status" 
ON admin_users 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- 2. Secure user_sessions - ensure only session owner and admins can view
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON user_sessions;

CREATE POLICY "Users can view own sessions only" 
ON user_sessions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all sessions" 
ON user_sessions 
FOR ALL 
TO authenticated
USING (public.is_admin());

-- 3. Further secure waitlist tables - only admins can view, public can only insert
DROP POLICY IF EXISTS "Admins can view all candidates" ON waitlist_candidates;
DROP POLICY IF EXISTS "Admins can manage candidates" ON waitlist_candidates;

CREATE POLICY "Only admins can view candidates" 
ON waitlist_candidates 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can manage candidates" 
ON waitlist_candidates 
FOR ALL 
TO authenticated
USING (public.is_admin());

-- Keep public insert for waitlist signup
CREATE POLICY "Public can join candidate waitlist" 
ON waitlist_candidates 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Same for employers
DROP POLICY IF EXISTS "Admins can view all employers" ON waitlist_employers;
DROP POLICY IF EXISTS "Admins can manage employers" ON waitlist_employers;

CREATE POLICY "Only admins can view employers" 
ON waitlist_employers 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can manage employers" 
ON waitlist_employers 
FOR ALL 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public can join employer waitlist" 
ON waitlist_employers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 4. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  row_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON security_audit_log 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_table_name TEXT DEFAULT NULL,
  p_row_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, table_name, row_id, old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_row_id, p_old_values, p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;