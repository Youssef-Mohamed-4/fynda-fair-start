-- Completely fix the infinite recursion issue by simplifying the policies
-- First, disable RLS temporarily to clean up
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Policy 1: Users can read their own admin record
CREATE POLICY "Users can read own admin status" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Policy 2: Allow authenticated users to insert (for new user registration)
CREATE POLICY "Allow authenticated insert" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Policy 3: Super admins can do everything (using a direct approach)
CREATE POLICY "Super admin full access" 
ON public.admin_users 
FOR ALL 
USING (
  user_id = auth.uid() AND is_super_admin = true
) 
WITH CHECK (
  user_id = auth.uid() AND is_super_admin = true
);

-- Update the is_admin function to be simpler and avoid any potential recursion
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT true FROM public.admin_users WHERE user_id = COALESCE(check_user_id, auth.uid()) LIMIT 1),
    false
  );
$$;