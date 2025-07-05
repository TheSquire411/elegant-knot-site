-- Create registries table
CREATE TABLE public.registries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Our Wedding Registry',
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create registry_items table
CREATE TABLE public.registry_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registry_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  store_url TEXT,
  store_name TEXT,
  is_purchased BOOLEAN NOT NULL DEFAULT false,
  purchased_by TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  quantity_wanted INTEGER NOT NULL DEFAULT 1,
  quantity_purchased INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.registry_items 
ADD FOREIGN KEY (registry_id) REFERENCES public.registries(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE public.registries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for registries
CREATE POLICY "Users can view their own registries" 
ON public.registries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registries" 
ON public.registries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registries" 
ON public.registries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registries" 
ON public.registries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for registry_items
CREATE POLICY "Users can view their own registry items" 
ON public.registry_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registry items" 
ON public.registry_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registry items" 
ON public.registry_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registry items" 
ON public.registry_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_registries_updated_at
BEFORE UPDATE ON public.registries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_registry_items_updated_at
BEFORE UPDATE ON public.registry_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();