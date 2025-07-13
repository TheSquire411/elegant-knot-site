-- Create independent guest photo feature tables

-- Main photo events table (independent of wedding websites)
CREATE TABLE public.guest_photo_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    share_code TEXT UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 8),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Photo uploads linked to events
CREATE TABLE public.guest_photo_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.guest_photo_events(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL UNIQUE,
    file_name TEXT,
    content_type TEXT,
    file_size INTEGER,
    uploaded_by_name TEXT,
    uploaded_by_email TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_guest_photo_events_user_id ON public.guest_photo_events(user_id);
CREATE INDEX idx_guest_photo_events_share_code ON public.guest_photo_events(share_code);
CREATE INDEX idx_guest_photo_uploads_event_id ON public.guest_photo_uploads(event_id);

-- Enable RLS
ALTER TABLE public.guest_photo_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_photo_uploads ENABLE ROW LEVEL SECURITY;

-- Policies for guest_photo_events
CREATE POLICY "Users can view their own photo events" 
ON public.guest_photo_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own photo events" 
ON public.guest_photo_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photo events" 
ON public.guest_photo_events FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photo events" 
ON public.guest_photo_events FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for guest_photo_uploads
CREATE POLICY "Event owners can view their photo uploads" 
ON public.guest_photo_uploads FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.guest_photo_events 
    WHERE id = guest_photo_uploads.event_id AND user_id = auth.uid()
));

CREATE POLICY "Anyone can upload photos to active events" 
ON public.guest_photo_uploads FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.guest_photo_events 
    WHERE id = guest_photo_uploads.event_id AND is_active = true
));

CREATE POLICY "Event owners can delete photo uploads" 
ON public.guest_photo_uploads FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM public.guest_photo_events 
    WHERE id = guest_photo_uploads.event_id AND user_id = auth.uid()
));

-- Create storage bucket for guest photos
INSERT INTO storage.buckets (id, name, public) VALUES ('guest-photos', 'guest-photos', true);

-- Storage policies
CREATE POLICY "Anyone can upload to guest-photos bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'guest-photos');

CREATE POLICY "Anyone can view guest photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'guest-photos');

CREATE POLICY "Event owners can delete their guest photos" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'guest-photos' AND
    auth.uid() IN (
        SELECT gpe.user_id 
        FROM public.guest_photo_events gpe
        WHERE gpe.share_code = (storage.foldername(name))[1]
    )
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_guest_photo_events_updated_at
    BEFORE UPDATE ON public.guest_photo_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();