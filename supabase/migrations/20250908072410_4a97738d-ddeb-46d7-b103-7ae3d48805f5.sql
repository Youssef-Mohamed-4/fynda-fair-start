-- Fix: Drop the publicly accessible waitlist_analytics view
-- This view exposes sensitive business intelligence data without proper access controls

DROP VIEW IF EXISTS public.waitlist_analytics;

-- The secure alternative 'waitlist_analytics_secure' table already exists 
-- with proper RLS policies that require admin access via is_admin() function
-- All code should use waitlist_analytics_secure instead