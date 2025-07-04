-- Create wedding websites table
CREATE TABLE public.wedding_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Our Wedding',
  slug TEXT UNIQUE,
  domain TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  content JSONB NOT NULL DEFAULT '{}',
  theme JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website sections table
CREATE TABLE public.website_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wedding_websites
CREATE POLICY "Users can view their own websites" ON public.wedding_websites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own websites" ON public.wedding_websites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites" ON public.wedding_websites
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites" ON public.wedding_websites
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for website_sections
CREATE POLICY "Users can view sections of their websites" ON public.website_sections
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_sections.website_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create sections for their websites" ON public.website_sections
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_sections.website_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sections of their websites" ON public.website_sections
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_sections.website_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete sections of their websites" ON public.website_sections
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_sections.website_id AND user_id = auth.uid()
  )
);

-- Add foreign key constraint
ALTER TABLE public.website_sections 
ADD CONSTRAINT website_sections_website_id_fkey 
FOREIGN KEY (website_id) REFERENCES public.wedding_websites(id) ON DELETE CASCADE;

-- Create storage bucket for wedding website assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wedding-websites', 'wedding-websites', true);

-- Create storage policies
CREATE POLICY "Users can upload their website assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'wedding-websites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their website assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wedding-websites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their website assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'wedding-websites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their website assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'wedding-websites' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Website assets are publicly accessible
CREATE POLICY "Website assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wedding-websites');

-- Create triggers for updated_at
CREATE TRIGGER update_wedding_websites_updated_at
BEFORE UPDATE ON public.wedding_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_sections_updated_at
BEFORE UPDATE ON public.website_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();