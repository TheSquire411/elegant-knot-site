-- Add automatic slug generation and publishing triggers for wedding websites

-- Function to generate unique slug from title
CREATE OR REPLACE FUNCTION public.generate_website_slug(title_text TEXT, website_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from title
  base_slug := lower(regexp_replace(title_text, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Ensure minimum length
  IF length(base_slug) < 3 THEN
    base_slug := 'wedding-' || base_slug;
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE slug = final_slug 
    AND (website_id IS NULL OR id != website_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Function to handle website publishing
CREATE OR REPLACE FUNCTION public.handle_website_publishing()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If status is being changed to 'published'
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    -- Set published_at timestamp
    NEW.published_at := now();
    
    -- Generate slug if not exists
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
      NEW.slug := public.generate_website_slug(NEW.title, NEW.id);
    END IF;
  END IF;
  
  -- If status is being changed from 'published' to something else
  IF OLD.status = 'published' AND NEW.status != 'published' THEN
    NEW.published_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for website publishing
CREATE TRIGGER trigger_website_publishing
  BEFORE UPDATE ON public.wedding_websites
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_website_publishing();

-- Function to validate website before publishing
CREATE OR REPLACE FUNCTION public.validate_website_for_publishing(website_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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
  
  content_data := website_record.content;
  
  -- Required field validations
  IF content_data->>'coupleNames' IS NULL OR content_data->>'coupleNames' = '' THEN
    errors := array_append(errors, 'Couple names are required');
  END IF;
  
  IF content_data->>'weddingDate' IS NULL OR content_data->>'weddingDate' = '' THEN
    warnings := array_append(warnings, 'Wedding date is recommended');
  END IF;
  
  -- Check if ceremony details exist
  IF content_data->'schedule'->'ceremony'->>'location' IS NULL THEN
    warnings := array_append(warnings, 'Ceremony location is recommended');
  END IF;
  
  -- Build result
  validation_result := jsonb_build_object(
    'valid', array_length(errors, 1) IS NULL,
    'errors', errors,
    'warnings', warnings
  );
  
  RETURN validation_result;
END;
$$;