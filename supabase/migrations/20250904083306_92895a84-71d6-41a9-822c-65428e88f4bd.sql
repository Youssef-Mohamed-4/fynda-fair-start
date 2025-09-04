-- Update waitlist_employers table to replace job_description with role
ALTER TABLE public.waitlist_employers 
DROP COLUMN job_description,
ADD COLUMN role text NOT NULL DEFAULT 'Other';