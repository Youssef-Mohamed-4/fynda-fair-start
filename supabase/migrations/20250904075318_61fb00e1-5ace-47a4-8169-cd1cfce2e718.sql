-- Fix the security warning by setting proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';