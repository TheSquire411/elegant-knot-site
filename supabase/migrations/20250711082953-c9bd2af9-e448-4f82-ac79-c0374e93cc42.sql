-- Fix website validation function to handle null values properly
CREATE OR REPLACE FUNCTION public.validate_website_for_publishing(website_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  website_record RECORD;
  content_data JSONB;
  validation_result JSONB;
  errors TEXT[] := '{}';
  warnings TEXT[] := '{}';
BEGIN
  -- Get website record
  SELECT * INTO website_record
  FROM public.wedding_websites
  WHERE id = website_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'errors', array['Website not found or access denied']
    );
  END IF;
  
  content_data := COALESCE(website_record.content, '{}'::jsonb);
  
  -- Required field validations with null safety
  IF content_data->>'coupleNames' IS NULL OR TRIM(content_data->>'coupleNames') = '' THEN
    errors := array_append(errors, 'Couple names are required for publishing');
  END IF;
  
  IF content_data->>'weddingDate' IS NULL OR TRIM(content_data->>'weddingDate') = '' THEN
    warnings := array_append(warnings, 'Wedding date is recommended for better user experience');
  END IF;
  
  -- Check if ceremony details exist with null safety
  IF content_data->'schedule' IS NULL OR 
     content_data->'schedule'->'ceremony' IS NULL OR
     content_data->'schedule'->'ceremony'->>'location' IS NULL OR
     TRIM(content_data->'schedule'->'ceremony'->>'location') = '' THEN
    warnings := array_append(warnings, 'Ceremony location is recommended for guests');
  END IF;
  
  -- Check if title is present
  IF website_record.title IS NULL OR TRIM(website_record.title) = '' THEN
    errors := array_append(errors, 'Website title is required');
  END IF;
  
  -- Generate slug if not present for publishing
  IF website_record.slug IS NULL OR TRIM(website_record.slug) = '' THEN
    UPDATE public.wedding_websites 
    SET slug = public.generate_website_slug(COALESCE(website_record.title, 'wedding-website'), website_id)
    WHERE id = website_id;
  END IF;
  
  -- Build result
  validation_result := jsonb_build_object(
    'valid', array_length(errors, 1) IS NULL OR array_length(errors, 1) = 0,
    'errors', COALESCE(errors, '{}'),
    'warnings', COALESCE(warnings, '{}')
  );
  
  RETURN validation_result;
END;
$$;