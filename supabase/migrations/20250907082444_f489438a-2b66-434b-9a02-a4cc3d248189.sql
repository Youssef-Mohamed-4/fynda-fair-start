-- Fix function search path security issue
-- Add proper search_path to database functions for security

-- Fix get_waitlist_analytics function
CREATE OR REPLACE FUNCTION public.get_waitlist_analytics()
 RETURNS TABLE(type text, total_count integer, final_year_count integer, fresh_graduate_count integer, early_career_count integer, student_count integer)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT
    type,
    total_count,
    final_year_count,
    fresh_graduate_count,
    early_career_count,
    student_count
  FROM waitlist_analytics
  WHERE auth.uid() IN (SELECT user_id FROM public.admin_users);
$function$;

-- Fix log_auth_attempt function (already has search_path but confirm it's set properly)
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

-- Fix log_security_event function (already has search_path but confirm it's set properly)
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

-- Fix handle_new_user function (already has proper search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'youssfarouk202@gmail.com' THEN
    INSERT INTO public.admin_users (user_id, email, is_super_admin)
    VALUES (NEW.id, NEW.email, true);
  END IF;
  RETURN NEW;
END;
$function$;