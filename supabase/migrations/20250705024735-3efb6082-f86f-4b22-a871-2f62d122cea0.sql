-- Create guests table for individual guest information
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guest_group_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  dietary_restrictions TEXT,
  notes TEXT,
  relationship TEXT,
  is_plus_one BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guest_groups table for grouping guests together
CREATE TABLE public.guest_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'family', -- family, friends, colleagues, etc.
  max_size INTEGER DEFAULT 8,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rsvp_responses table for tracking RSVP status
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guest_id UUID NOT NULL,
  attending BOOLEAN,
  response_date TIMESTAMP WITH TIME ZONE,
  meal_choice TEXT,
  additional_notes TEXT,
  plus_one_name TEXT,
  plus_one_attending BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seating_tables table for venue table management
CREATE TABLE public.seating_tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 8,
  shape TEXT DEFAULT 'round', -- round, rectangular, square
  x_position DECIMAL(10,2) DEFAULT 0,
  y_position DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seating_assignments table for assigning guests to tables
CREATE TABLE public.seating_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guest_group_id UUID NOT NULL,
  seating_table_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for guest_group_id in guests table
ALTER TABLE public.guests 
ADD CONSTRAINT guests_guest_group_id_fkey 
FOREIGN KEY (guest_group_id) REFERENCES public.guest_groups(id) ON DELETE SET NULL;

-- Add foreign key for guest_id in rsvp_responses table
ALTER TABLE public.rsvp_responses 
ADD CONSTRAINT rsvp_responses_guest_id_fkey 
FOREIGN KEY (guest_id) REFERENCES public.guests(id) ON DELETE CASCADE;

-- Add foreign keys for seating_assignments table
ALTER TABLE public.seating_assignments 
ADD CONSTRAINT seating_assignments_guest_group_id_fkey 
FOREIGN KEY (guest_group_id) REFERENCES public.guest_groups(id) ON DELETE CASCADE,
ADD CONSTRAINT seating_assignments_seating_table_id_fkey 
FOREIGN KEY (seating_table_id) REFERENCES public.seating_tables(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for guests table
CREATE POLICY "Users can view their own guests" 
ON public.guests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guests" 
ON public.guests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guests" 
ON public.guests FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guests" 
ON public.guests FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for guest_groups table
CREATE POLICY "Users can view their own guest groups" 
ON public.guest_groups FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guest groups" 
ON public.guest_groups FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guest groups" 
ON public.guest_groups FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guest groups" 
ON public.guest_groups FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for rsvp_responses table
CREATE POLICY "Users can view their own RSVP responses" 
ON public.rsvp_responses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own RSVP responses" 
ON public.rsvp_responses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVP responses" 
ON public.rsvp_responses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVP responses" 
ON public.rsvp_responses FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for seating_tables table
CREATE POLICY "Users can view their own seating tables" 
ON public.seating_tables FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seating tables" 
ON public.seating_tables FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seating tables" 
ON public.seating_tables FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seating tables" 
ON public.seating_tables FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for seating_assignments table
CREATE POLICY "Users can view their own seating assignments" 
ON public.seating_assignments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seating assignments" 
ON public.seating_assignments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seating assignments" 
ON public.seating_assignments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seating assignments" 
ON public.seating_assignments FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guest_groups_updated_at
BEFORE UPDATE ON public.guest_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rsvp_responses_updated_at
BEFORE UPDATE ON public.rsvp_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seating_tables_updated_at
BEFORE UPDATE ON public.seating_tables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seating_assignments_updated_at
BEFORE UPDATE ON public.seating_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_guests_user_id ON public.guests(user_id);
CREATE INDEX idx_guests_guest_group_id ON public.guests(guest_group_id);
CREATE INDEX idx_guest_groups_user_id ON public.guest_groups(user_id);
CREATE INDEX idx_rsvp_responses_user_id ON public.rsvp_responses(user_id);
CREATE INDEX idx_rsvp_responses_guest_id ON public.rsvp_responses(guest_id);
CREATE INDEX idx_seating_tables_user_id ON public.seating_tables(user_id);
CREATE INDEX idx_seating_assignments_user_id ON public.seating_assignments(user_id);
CREATE INDEX idx_seating_assignments_guest_group_id ON public.seating_assignments(guest_group_id);
CREATE INDEX idx_seating_assignments_seating_table_id ON public.seating_assignments(seating_table_id);