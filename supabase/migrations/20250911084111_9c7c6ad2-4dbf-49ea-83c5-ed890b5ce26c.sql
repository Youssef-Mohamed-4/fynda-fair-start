-- Fix RLS issue on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin data
CREATE POLICY "Allow authenticated users to read admins" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (true);