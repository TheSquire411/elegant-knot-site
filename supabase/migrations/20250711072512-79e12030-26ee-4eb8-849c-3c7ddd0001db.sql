-- Create table for tracking authentication rate limits
CREATE TABLE public.auth_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or email
  limit_type TEXT NOT NULL, -- 'ip', 'email', or 'global'
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient lookups
CREATE INDEX idx_auth_rate_limits_identifier_type ON public.auth_rate_limits(identifier, limit_type);
CREATE INDEX idx_auth_rate_limits_blocked_until ON public.auth_rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;
CREATE INDEX idx_auth_rate_limits_created_at ON public.auth_rate_limits(created_at);

-- Enable RLS
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy - only the system should access this table
CREATE POLICY "System access only for auth rate limits" 
ON public.auth_rate_limits 
FOR ALL 
USING (false);

-- Create function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_auth_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.auth_rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours'
    AND (blocked_until IS NULL OR blocked_until < now());
END;
$$;

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(
  p_identifier TEXT,
  p_limit_type TEXT,
  p_max_attempts INTEGER,
  p_window_minutes INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_record RECORD;
  is_blocked BOOLEAN := false;
  attempts_remaining INTEGER;
  reset_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Clean up old records first
  PERFORM public.cleanup_auth_rate_limits();
  
  -- Get current rate limit record
  SELECT * INTO current_record
  FROM public.auth_rate_limits
  WHERE identifier = p_identifier AND limit_type = p_limit_type;
  
  -- Check if currently blocked
  IF current_record.blocked_until IS NOT NULL AND current_record.blocked_until > now() THEN
    is_blocked := true;
    reset_time := current_record.blocked_until;
  ELSE
    -- Check if within time window
    IF current_record.first_attempt_at IS NULL OR 
       current_record.first_attempt_at < now() - (p_window_minutes || ' minutes')::INTERVAL THEN
      -- Reset the counter - outside time window
      UPDATE public.auth_rate_limits
      SET attempt_count = 1,
          first_attempt_at = now(),
          last_attempt_at = now(),
          blocked_until = NULL,
          updated_at = now()
      WHERE identifier = p_identifier AND limit_type = p_limit_type;
      
      attempts_remaining := p_max_attempts - 1;
    ELSE
      -- Increment counter
      UPDATE public.auth_rate_limits
      SET attempt_count = attempt_count + 1,
          last_attempt_at = now(),
          updated_at = now()
      WHERE identifier = p_identifier AND limit_type = p_limit_type;
      
      -- Check if limit exceeded
      IF current_record.attempt_count + 1 >= p_max_attempts THEN
        -- Block for the window duration
        reset_time := now() + (p_window_minutes || ' minutes')::INTERVAL;
        UPDATE public.auth_rate_limits
        SET blocked_until = reset_time
        WHERE identifier = p_identifier AND limit_type = p_limit_type;
        is_blocked := true;
        attempts_remaining := 0;
      ELSE
        attempts_remaining := p_max_attempts - (current_record.attempt_count + 1);
      END IF;
    END IF;
  END IF;
  
  -- Insert record if it doesn't exist
  IF current_record.id IS NULL THEN
    INSERT INTO public.auth_rate_limits (identifier, limit_type, attempt_count)
    VALUES (p_identifier, p_limit_type, 1);
    attempts_remaining := p_max_attempts - 1;
  END IF;
  
  RETURN jsonb_build_object(
    'blocked', is_blocked,
    'attempts_remaining', COALESCE(attempts_remaining, 0),
    'reset_time', reset_time
  );
END;
$$;