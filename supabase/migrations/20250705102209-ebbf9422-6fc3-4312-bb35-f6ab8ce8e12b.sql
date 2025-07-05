-- Create invitations table to track invitation status
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guest_id UUID NOT NULL,
  email TEXT NOT NULL,
  invitation_type TEXT NOT NULL DEFAULT 'wedding',
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  rsvp_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT CHECK (status IN ('pending', 'sent', 'opened', 'bounced', 'rsvp_completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.invitations 
ADD FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invitations
CREATE POLICY "Users can view their own invitations" 
ON public.invitations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invitations" 
ON public.invitations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" 
ON public.invitations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" 
ON public.invitations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invitations_updated_at
BEFORE UPDATE ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();