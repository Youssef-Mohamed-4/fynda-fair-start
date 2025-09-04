-- Create waitlist tables for candidates and employers
CREATE TABLE public.waitlist_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  current_state TEXT NOT NULL CHECK (current_state IN ('final_year', 'fresh_graduate', 'early_career', 'student')),
  field_of_study TEXT NOT NULL,
  field_description TEXT, -- Only filled when field_of_study is 'other'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.waitlist_employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  job_description TEXT NOT NULL,
  early_careers_per_year INTEGER, -- Optional field
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_employers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public waitlist)
CREATE POLICY "Anyone can insert candidates" 
ON public.waitlist_candidates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert employers" 
ON public.waitlist_employers 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_waitlist_candidates_email ON public.waitlist_candidates(email);
CREATE INDEX idx_waitlist_employers_email ON public.waitlist_employers(email);