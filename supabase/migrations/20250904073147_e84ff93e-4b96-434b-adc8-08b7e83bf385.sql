-- Drop and recreate the view without security definer properties
DROP VIEW public.waitlist_analytics;

-- Create regular view without security definer
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