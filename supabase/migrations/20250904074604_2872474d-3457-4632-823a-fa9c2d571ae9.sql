-- Create an admin user for your access
-- You'll need to sign up with email: admin@fynda.com and any password
-- After signing up, this will automatically grant admin access

-- Create function to auto-assign admin status for specific email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'admin@fynda.com' THEN
    INSERT INTO public.admin_users (user_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign admin on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Secure the waitlist table - only admins can read it
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON waitlist;
CREATE POLICY "Only admins can read waitlist" 
ON waitlist 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  )
);