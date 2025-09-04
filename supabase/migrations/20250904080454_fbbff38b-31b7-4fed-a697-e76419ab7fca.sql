-- Update admin email to youssfarouk202@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'youssfarouk202@gmail.com' THEN
    INSERT INTO public.admin_users (user_id, email)
    VALUES (NEW.id, NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';