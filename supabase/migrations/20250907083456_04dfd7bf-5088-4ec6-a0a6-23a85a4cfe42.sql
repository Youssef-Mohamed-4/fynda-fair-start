-- Critical security fixes for data protection

-- 1. Recreate waitlist_analytics view with admin-only access
DROP VIEW IF EXISTS public.waitlist_analytics;

CREATE VIEW public.waitlist_analytics 
WITH (security_barrier=true, security_invoker=true)
AS
SELECT 'candidates'::text AS type,
    count(*) AS total_count,
    count(
        CASE
            WHEN (waitlist_candidates.current_state = 'final year'::text) THEN 1
            ELSE NULL::integer
        END) AS final_year_count,
    count(
        CASE
            WHEN (waitlist_candidates.current_state = 'fresh graduate'::text) THEN 1
            ELSE NULL::integer
        END) AS fresh_graduate_count,
    count(
        CASE
            WHEN (waitlist_candidates.current_state = 'early career (0:3)'::text) THEN 1
            ELSE NULL::integer
        END) AS early_career_count,
    count(
        CASE
            WHEN (waitlist_candidates.current_state = 'Student'::text) THEN 1
            ELSE NULL::integer
        END) AS student_count,
    count(
        CASE
            WHEN (waitlist_candidates.field_of_study = 'Software Eng'::text) THEN 1
            ELSE NULL::integer
        END) AS software_eng_count,
    count(
        CASE
            WHEN (waitlist_candidates.field_of_study = 'Data Analytics'::text) THEN 1
            ELSE NULL::integer
        END) AS data_analytics_count,
    count(
        CASE
            WHEN (waitlist_candidates.field_of_study = 'Data Science'::text) THEN 1
            ELSE NULL::integer
        END) AS data_science_count,
    count(
        CASE
            WHEN (waitlist_candidates.field_of_study = 'Computer Science'::text) THEN 1
            ELSE NULL::integer
        END) AS computer_science_count,
    count(
        CASE
            WHEN (waitlist_candidates.field_of_study = 'Other'::text) THEN 1
            ELSE NULL::integer
        END) AS other_field_count
   FROM waitlist_candidates
   WHERE is_admin() -- Only show if user is admin
UNION ALL
 SELECT 'employers'::text AS type,
    count(*) AS total_count,
    0 AS final_year_count,
    0 AS fresh_graduate_count,
    0 AS early_career_count,
    0 AS student_count,
    0 AS software_eng_count,
    0 AS data_analytics_count,
    0 AS data_science_count,
    0 AS computer_science_count,
    0 AS other_field_count
   FROM waitlist_employers
   WHERE is_admin(); -- Only show if user is admin

-- 2. Restrict site_settings access - remove public read access
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;