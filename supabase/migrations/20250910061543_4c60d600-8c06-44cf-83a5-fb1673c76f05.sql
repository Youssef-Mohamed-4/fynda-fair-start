-- Create admin user for youssfarouk202@gmail.com
-- First, let's ensure we have a way to create admin users properly

-- Create or update the admin user setup function
CREATE OR REPLACE FUNCTION create_admin_user(admin_email text, admin_password text DEFAULT 'admin123')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  existing_admin record;
BEGIN
  -- Check if admin already exists
  SELECT * INTO existing_admin 
  FROM admin_users 
  WHERE email = admin_email;
  
  IF existing_admin.id IS NOT NULL THEN
    RETURN 'Admin user already exists: ' || admin_email;
  END IF;
  
  -- Insert the admin user into admin_users table (for now, we'll handle auth separately)
  -- The user_id will be set when they first authenticate
  INSERT INTO admin_users (email, is_super_admin, user_id)
  VALUES (admin_email, true, null)
  ON CONFLICT (email) DO UPDATE SET
    is_super_admin = true,
    updated_at = now();
    
  RETURN 'Admin user created/updated: ' || admin_email;
END;
$$;

-- Ensure the main admin exists
SELECT create_admin_user('youssfarouk202@gmail.com');

-- Update the handle_new_user function to properly link admin users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if this email exists in admin_users table
  UPDATE admin_users 
  SET user_id = NEW.id, updated_at = now()
  WHERE email = NEW.email AND user_id IS NULL;
  
  -- If this is the main admin email and doesn't exist, create it
  IF NEW.email = 'youssfarouk202@gmail.com' THEN
    INSERT INTO admin_users (user_id, email, is_super_admin)
    VALUES (NEW.id, NEW.email, true)
    ON CONFLICT (email) DO UPDATE SET
      user_id = NEW.id,
      is_super_admin = true,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger is in place
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();