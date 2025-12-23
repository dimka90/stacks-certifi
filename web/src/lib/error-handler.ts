/**
 * Error Handler
 * Centralized error handling and logging
 */

export class ContractError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'ContractError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export const parseContractError = (error: any): string => {
  if (error instanceof ContractError) {
    return error.message;
  }
  if (error instanceof ValidationError) {
    return `Validation Error: ${error.message}`;
  }
  if (error instanceof NetworkError) {
    return `Network Error: ${error.message}`;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const formatErrorCode = (code: number): string => {
  const errorMap: { [key: number]: string } = {
    401: 'Unauthorized',
    404: 'Not Found',
    409: 'Conflict',
    420: 'Invalid Input',
    500: 'Server Error',
  };
  return errorMap[code] || `Error ${code}`;
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
};

export const logError = (error: Error, context?: string): void => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${context ? `[${context}] ` : ''}${error.name}: ${error.message}`;
  console.error(message);
};
