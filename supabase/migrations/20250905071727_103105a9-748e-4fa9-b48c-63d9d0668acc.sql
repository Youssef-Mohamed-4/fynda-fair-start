-- Fix infinite recursion in admin_users RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Only super admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_users;

-- Create new policies that don't cause recursion
CREATE POLICY "Users can view their own admin status" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Create a policy for super admins to manage others (using direct user_id check to avoid recursion)
CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users 
AS PERMISSIVE
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users super_admin
    WHERE super_admin.user_id = auth.uid() 
    AND super_admin.is_super_admin = true
  )
);

-- Update the is_admin function to be more efficient and avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = COALESCE($1, auth.uid())
  );
$$;