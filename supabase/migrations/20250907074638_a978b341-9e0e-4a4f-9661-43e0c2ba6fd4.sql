-- Fix critical security vulnerabilities in admin tables

-- 1. Remove the dangerous "Everyone can read admin table" policy from admin_users
DROP POLICY IF EXISTS "Everyone can read admin table" ON public.admin_users;

-- 2. Add proper RLS policies to the admins table (currently has no RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create secure policies for admins table
CREATE POLICY "Only super admins can manage admins table" 
ON public.admins 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.admin_users 
    WHERE is_super_admin = true
  )
);

CREATE POLICY "Admins can view admins table" 
ON public.admins 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.admin_users
  )
);

-- 3. Fix database function search paths for security
CREATE OR REPLACE FUNCTION public.log_auth_attempt(p_ip_address text, p_email text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_count INTEGER;
BEGIN
  -- Clean old attempts (older than 1 hour)
  DELETE FROM public.auth_rate_limits 
  WHERE last_attempt < NOW() - INTERVAL '1 hour';
  
  -- Get current attempt count for this IP
  SELECT attempt_count INTO current_count
  FROM public.auth_rate_limits 
  WHERE ip_address = p_ip_address 
  AND (p_email IS NULL OR email = p_email);
  
  IF current_count IS NULL THEN
    -- First attempt
    INSERT INTO public.auth_rate_limits (ip_address, email, attempt_count)
    VALUES (p_ip_address, p_email, 1);
  ELSE
    -- Update attempt count
    UPDATE public.auth_rate_limits 
    SET 
      attempt_count = attempt_count + 1,
      last_attempt = NOW(),
      blocked_until = CASE 
        WHEN attempt_count >= 5 THEN NOW() + INTERVAL '15 minutes'
        ELSE blocked_until
      END
    WHERE ip_address = p_ip_address 
    AND (p_email IS NULL OR email = p_email);
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_action text, p_table_name text DEFAULT NULL::text, p_row_id uuid DEFAULT NULL::uuid, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action, table_name, row_id, old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_row_id, p_old_values, p_new_values
  );
END;
$function$;