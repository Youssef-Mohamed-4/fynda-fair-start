-- Update existing admin user to be super admin or insert if not exists
DO $$
BEGIN
  -- First, try to update existing record
  UPDATE public.admin_users 
  SET is_super_admin = true 
  WHERE email = 'youssfarouk202@gmail.com';
  
  -- If no rows were updated, insert new record
  IF NOT FOUND THEN
    INSERT INTO public.admin_users (user_id, email, is_super_admin)
    SELECT id, 'youssfarouk202@gmail.com', true
    FROM auth.users 
    WHERE email = 'youssfarouk202@gmail.com'
    ON CONFLICT (user_id) DO UPDATE SET is_super_admin = true;
  END IF;
END $$;

-- Update the handle_new_user function to automatically set super admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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