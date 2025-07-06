-- Create user_vision_boards table to store vision board preferences and generated content
CREATE TABLE public.user_vision_boards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aesthetic TEXT NOT NULL,
  venue TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  season TEXT NOT NULL,
  must_have TEXT,
  avoid TEXT,
  generated_board_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_vision_boards ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own vision boards" 
ON public.user_vision_boards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vision boards" 
ON public.user_vision_boards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision boards" 
ON public.user_vision_boards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision boards" 
ON public.user_vision_boards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_vision_boards_updated_at
BEFORE UPDATE ON public.user_vision_boards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();