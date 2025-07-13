-- Add message column to guest_photo_uploads table
ALTER TABLE public.guest_photo_uploads 
ADD COLUMN message TEXT;

-- Add index for better performance when querying uploads with messages
CREATE INDEX idx_guest_photo_uploads_message ON public.guest_photo_uploads(event_id, uploaded_at) WHERE message IS NOT NULL;