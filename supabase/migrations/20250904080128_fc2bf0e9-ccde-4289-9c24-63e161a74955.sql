-- Additional security measures for authentication

-- Rate limiting for auth attempts (prevent brute force)
CREATE TABLE IF NOT EXISTS public.auth_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  email TEXT,
  attempt_count INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limits
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System manages rate limits" 
ON auth_rate_limits 
FOR ALL 
TO authenticated
USING (false);

-- Create function to log auth attempts
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  p_ip_address TEXT,
  p_email TEXT DEFAULT NULL
) RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create session tracking for security monitoring
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" 
ON user_sessions 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions" 
ON user_sessions 
FOR ALL 
TO authenticated
USING (public.is_admin());