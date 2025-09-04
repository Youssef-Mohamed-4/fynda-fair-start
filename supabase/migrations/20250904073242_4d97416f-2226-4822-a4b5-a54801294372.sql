-- Fix security definer function by removing it and using RLS policies instead
-- Drop the is_admin function since it has SECURITY DEFINER
DROP FUNCTION public.is_admin(UUID);

-- Update RLS policies to not use the function
-- We already have the correct policies in place without needing the function