-- Create admin settings table for website configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT,
  primary_color TEXT DEFAULT '213 85% 15%',
  secondary_color TEXT DEFAULT '213 100% 96%', 
  accent_color TEXT DEFAULT '213 85% 60%',
  coming_soon_mode BOOLEAN DEFAULT false,
  site_title TEXT DEFAULT 'Fynda',
  site_description TEXT DEFAULT 'Connect ambitious early careers with progressive employers',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table 
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waitlist analytics view for admin
CREATE VIEW public.waitlist_analytics AS
SELECT 
  'candidates' as type,
  COUNT(*) as total_count,
  COUNT(CASE WHEN current_state = 'final year' THEN 1 END) as final_year_count,
  COUNT(CASE WHEN current_state = 'fresh graduate' THEN 1 END) as fresh_graduate_count,
  COUNT(CASE WHEN current_state = 'early career (0:3)' THEN 1 END) as early_career_count,
  COUNT(CASE WHEN current_state = 'Student' THEN 1 END) as student_count,
  COUNT(CASE WHEN field_of_study = 'Software Eng' THEN 1 END) as software_eng_count,
  COUNT(CASE WHEN field_of_study = 'Data Analytics' THEN 1 END) as data_analytics_count,
  COUNT(CASE WHEN field_of_study = 'Data Science' THEN 1 END) as data_science_count,
  COUNT(CASE WHEN field_of_study = 'Computer Science' THEN 1 END) as computer_science_count,
  COUNT(CASE WHEN field_of_study = 'Other' THEN 1 END) as other_field_count
FROM public.waitlist_candidates

UNION ALL

SELECT 
  'employers' as type,
  COUNT(*) as total_count,
  0, 0, 0, 0, 0, 0, 0, 0, 0
FROM public.waitlist_employers;

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings (only admins can modify)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can update site settings" 
ON public.site_settings 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Only super admins can manage admin users" 
ON public.admin_users 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

-- RLS Policies for waitlist data (admin access)
CREATE POLICY "Admins can view all candidates" 
ON public.waitlist_candidates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage candidates" 
ON public.waitlist_candidates 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all employers" 
ON public.waitlist_employers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage employers" 
ON public.waitlist_employers 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Insert default site settings
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());

-- Create functions for better admin management
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid
  )
$$;

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();