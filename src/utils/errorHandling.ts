// Simple toast replacement - using notifications system instead
export interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  action?: {
    altText: string;
    children: string;
    onClick: () => void;
  };
}

// Placeholder - the actual toast will be handled by the notification system
export const toast = (options: ToastOptions) => {
  console.log('Toast called:', options);
};

export interface AppError {
  id: string;
  message: string;
  context: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  retry?: () => void;
}

export interface ErrorHandlerOptions {
  showToUser?: boolean;
  severity?: 'low' | 'medium' | 'high';
  context?: string;
  retry?: () => void;
  logToConsole?: boolean;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];
  private maxErrors = 50;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handle(error: unknown, options: ErrorHandlerOptions = {}): void {
    const {
      showToUser = true,
      severity = 'medium',
      context = 'Unknown',
      retry,
      logToConsole = true
    } = options;

    const errorMessage = this.extractErrorMessage(error);
    
    if (logToConsole) {
      console.error(`[${context}]:`, error);
    }

    const appError: AppError = {
      id: crypto.randomUUID(),
      message: errorMessage,
      context,
      timestamp: new Date(),
      severity,
      retry
    };

    this.addError(appError);

    if (showToUser) {
      this.showUserNotification(appError);
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as any).message;
    }
    return 'An unexpected error occurred';
  }

  private addError(error: AppError): void {
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }
  }

  private showUserNotification(error: AppError): void {
    const title = this.getSeverityTitle(error.severity);
    
    toast({
      title,
      description: error.message,
      variant: error.severity === 'high' ? 'destructive' : 'default',
      duration: this.getSeverityDuration(error.severity),
      action: error.retry ? {
        altText: 'Retry',
        children: 'Retry',
        onClick: error.retry
      } : undefined
    });
  }

  private getSeverityTitle(severity: AppError['severity']): string {
    switch (severity) {
      case 'high': return 'Error';
      case 'medium': return 'Warning';
      case 'low': return 'Notice';
      default: return 'Message';
    }
  }

  private getSeverityDuration(severity: AppError['severity']): number {
    switch (severity) {
      case 'high': return 8000;
      case 'medium': return 5000;
      case 'low': return 3000;
      default: return 5000;
    }
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  clearError(id: string): void {
    this.errors = this.errors.filter(error => error.id !== id);
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Convenience functions for common error scenarios
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handle(error, options);
    return null;
  }
};

export const withRetry = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  maxRetries: number = 3,
  options: ErrorHandlerOptions = {}
) => {
  return async (...args: T) => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          errorHandler.handle(error, {
            ...options,
            context: `${options.context} (Failed after ${maxRetries} attempts)`
          });
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
      }
    }
    
    throw lastError;
  };
};