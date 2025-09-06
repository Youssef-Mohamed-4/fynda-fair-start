-- Temporarily fix the recursion by making admin_users readable
-- First, disable RLS temporarily to clean up
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies 
DROP POLICY IF EXISTS "Users can read own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.admin_users; 
DROP POLICY IF EXISTS "Super admin full access" ON public.admin_users;

-- Re-enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows authenticated users to read admin status
-- This breaks the recursion cycle
CREATE POLICY "Authenticated users can read admin status" 
ON public.admin_users 
FOR SELECT 
USING (true); -- Allow all authenticated users to read

-- Allow users to insert their own admin records
CREATE POLICY "Users can insert own admin record" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own admin records
CREATE POLICY "Users can update own admin record" 
ON public.admin_users 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());