-- Complete clean slate approach
-- Step 1: Disable RLS
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "All authenticated can read admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Users can insert own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Users can update own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admin records" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated users can read admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Users can read own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.admin_users;
DROP POLICY IF EXISTS "Super admin full access" ON public.admin_users;

-- Step 3: Ensure the super admin record exists
DELETE FROM public.admin_users WHERE email = 'youssfarouk202@gmail.com';
INSERT INTO public.admin_users (user_id, email, is_super_admin) 
SELECT id, 'youssfarouk202@gmail.com', true 
FROM auth.users 
WHERE email = 'youssfarouk202@gmail.com';

-- Step 4: Create the simplest possible RLS setup
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only one simple policy: everyone can read (this prevents recursion)
CREATE POLICY "Everyone can read admin table" 
ON public.admin_users 
FOR ALL 
USING (true) 
WITH CHECK (true);