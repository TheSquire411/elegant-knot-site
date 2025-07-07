import { useState, useCallback, useRef, useEffect } from 'react';
import { errorHandler, ErrorHandlerOptions } from '../utils/errorHandling';

interface UseAsyncOperationOptions extends ErrorHandlerOptions {
  onSuccess?: (data: any) => void;
  immediate?: boolean;
}

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncOperation<T = any, Args extends any[] = any[]>(
  operation: (...args: Args) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const operationRef = useRef(operation);
  const optionsRef = useRef(options);
  
  // Update refs when props change
  useEffect(() => {
    operationRef.current = operation;
    optionsRef.current = options;
  });

  const execute = useCallback(async (...args: Args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operationRef.current(...args);
      setState({ data: result, loading: false, error: null });
      
      if (optionsRef.current.onSuccess) {
        optionsRef.current.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      
      errorHandler.handle(error, {
        ...optionsRef.current,
        retry: () => execute(...args)
      });
      
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.error && state.data === null
  };
}