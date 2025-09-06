-- Completely reset admin system to fix infinite recursion
-- Step 1: Completely disable RLS on admin_users to break any recursion
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Delete and recreate the admin record for the super admin
DELETE FROM public.admin_users WHERE email = 'youssfarouk202@gmail.com';
INSERT INTO public.admin_users (user_id, email, is_super_admin) 
SELECT id, 'youssfarouk202@gmail.com', true 
FROM auth.users 
WHERE email = 'youssfarouk202@gmail.com';

-- Step 3: Re-enable RLS with the simplest possible policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Simple policy: All authenticated users can read admin status (no recursion)
CREATE POLICY "All authenticated can read admin status" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (true);

-- Simple policy: Only allow inserts for the user's own record
CREATE POLICY "Users can insert own admin record" 
ON public.admin_users 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Simple policy: Users can update their own records
CREATE POLICY "Users can update own admin record" 
ON public.admin_users 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Simple policy: Only allow deletes for super admins (avoid recursion by using a simple check)
CREATE POLICY "Super admins can delete admin records" 
ON public.admin_users 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users admin_check
    WHERE admin_check.user_id = auth.uid() 
    AND admin_check.is_super_admin = true
  )
);