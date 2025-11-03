/**
 * Utility to handle rate limit errors and extract retry information
 */

export interface RateLimitInfo {
  isRateLimited: boolean;
  retryAfter?: number; // seconds
  limit?: number;
  remaining?: number;
  reset?: number; // timestamp
  message: string;
}

/**
 * Parse rate limit headers from API response
 */
export function parseRateLimitHeaders(headers: any): RateLimitInfo {
  const rateLimitLimit = headers?.['ratelimit-limit'];
  const rateLimitRemaining = headers?.['ratelimit-remaining'];
  const rateLimitReset = headers?.['ratelimit-reset'];
  const retryAfter = headers?.['retry-after'];

  return {
    isRateLimited: false,
    limit: rateLimitLimit ? parseInt(rateLimitLimit) : undefined,
    remaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : undefined,
    reset: rateLimitReset ? parseInt(rateLimitReset) : undefined,
    message: '',
  };
}

/**
 * Format time remaining for user display
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

/**
 * Calculate retry time from rate limit reset timestamp
 */
export function calculateRetryTime(resetTimestamp: number): number {
  const now = Math.floor(Date.now() / 1000);
  const retryAfter = resetTimestamp - now;
  return Math.max(retryAfter, 0);
}

/**
 * Handle rate limit error and return user-friendly message
 */
export function handleRateLimitError(error: any): RateLimitInfo {
  if (error.response?.status === 429) {
    const headers = error.response.headers;
    const data = error.response.data;
    
    // Get retry-after from headers or calculate from reset time
    let retryAfterSeconds = 0;
    
    if (headers?.['retry-after']) {
      retryAfterSeconds = parseInt(headers['retry-after']);
    } else if (headers?.['ratelimit-reset']) {
      retryAfterSeconds = calculateRetryTime(parseInt(headers['ratelimit-reset']));
    }
    
    // Default to 15 minutes if no specific time is provided
    if (!retryAfterSeconds || retryAfterSeconds <= 0) {
      retryAfterSeconds = 900; // 15 minutes
    }
    
    const timeRemaining = formatTimeRemaining(retryAfterSeconds);
    
    // Use backend message if available, otherwise create a friendly message
    let message = data?.message || `Too many attempts. Please try again after ${timeRemaining}.`;
    
    // If backend doesn't include time in message, append it
    if (data?.message && !data.message.includes('after') && !data.message.includes('minute')) {
      message = `${data.message} Please wait ${timeRemaining} before trying again.`;
    }
    
    return {
      isRateLimited: true,
      retryAfter: retryAfterSeconds,
      limit: headers?.['ratelimit-limit'] ? parseInt(headers['ratelimit-limit']) : undefined,
      remaining: 0,
      reset: headers?.['ratelimit-reset'] ? parseInt(headers['ratelimit-reset']) : undefined,
      message,
    };
  }
  
  return {
    isRateLimited: false,
    message: error.response?.data?.message || error.message || 'An error occurred',
  };
}

/**
 * Create a countdown timer for rate limit retry
 */
export function createRetryCountdown(
  retryAfterSeconds: number,
  onUpdate: (timeLeft: string) => void,
  onComplete: () => void
): () => void {
  let remainingSeconds = retryAfterSeconds;
  
  const intervalId = setInterval(() => {
    remainingSeconds--;
    
    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      onComplete();
    } else {
      onUpdate(formatTimeRemaining(remainingSeconds));
    }
  }, 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

