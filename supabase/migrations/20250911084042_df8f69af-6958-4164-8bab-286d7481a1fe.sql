-- Ensure employers_waitlist table has the correct structure
-- First, let's check if we need to modify the existing table
-- The table should have: name, email, industry, company_size, early_career_hires_per_year

-- Drop the table if it exists and recreate with proper structure
DROP TABLE IF EXISTS public.employers_waitlist;

-- Create employers_waitlist table with the correct structure
CREATE TABLE public.employers_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  early_career_hires_per_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employers_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for waitlist signup)
CREATE POLICY "Allow anonymous inserts" 
ON public.employers_waitlist 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Create policy to allow authenticated users to view all entries (for admin)
CREATE POLICY "Allow authenticated users to view all" 
ON public.employers_waitlist 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to delete entries (for admin)
CREATE POLICY "Allow authenticated users to delete" 
ON public.employers_waitlist 
FOR DELETE 
TO authenticated 
USING (true);