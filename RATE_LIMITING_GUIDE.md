# Rate Limiting Frontend Implementation Guide

## Overview

The frontend now properly handles rate limiting errors from the backend and displays user-friendly messages with retry times.

## What Was Implemented

### 1. **Rate Limit Utility** (`src/Utils/rateLimitHandler.ts`)

A comprehensive utility that:
- Parses rate limit headers from API responses
- Calculates retry times
- Formats time remaining in a human-readable way
- Handles 429 (Too Many Requests) errors

### 2. **Axios Interceptors Updated**

#### `src/api/axiosInstance.tsx`
- Automatically catches 429 errors
- Shows toast notifications with retry time
- Example message: "Too many login attempts. Please try again after 15 minutes."

#### `src/lib/Api.ts`
- Both authenticated and public API instances handle rate limits
- Consistent error handling across all API calls

### 3. **NextAuth Integration** (`src/lib/auth.ts`)

- Catches rate limit errors during login
- Passes error messages through to the UI
- Handles both credentials and Google login rate limits

### 4. **Login Component** (`src/Components/Auth/Login.tsx`)

- Displays rate limit messages with time remaining
- Shows ⏱️ icon for rate limit errors
- Custom toast duration (6 seconds) for rate limit messages

## How It Works

### User Experience Flow

1. **User exceeds rate limit** (e.g., 5 login attempts in 15 minutes)

2. **Backend responds with:**
   ```json
   {
     "success": false,
     "message": "Too many login attempts. Please try again after 15 minutes."
   }
   ```
   Plus headers:
   ```
   RateLimit-Limit: 5
   RateLimit-Remaining: 0
   RateLimit-Reset: 1234567890
   ```

3. **Frontend automatically:**
   - Detects the 429 status code
   - Parses the error message and headers
   - Shows a toast notification with the exact time to wait
   - Prevents the login from proceeding

4. **User sees:**
   ```
   ⏱️ Too many login attempts. Please try again after 15 minutes.
   ```

## Example Messages

### Login Rate Limit (5 attempts per 15 minutes)
```
⏱️ Too many login attempts. Please try again after 15 minutes.
```

### Signup Rate Limit (3 signups per hour)
```
⏱️ Too many accounts created. Please try again after an hour.
```

### Forgot Password Rate Limit (3 requests per hour)
```
⏱️ Too many password reset requests. Please try again after an hour.
```

### OTP Verification Rate Limit (5 attempts per 15 minutes)
```
⏱️ Too many OTP verification attempts. Please try again after 15 minutes.
```

## Advanced Usage: Countdown Timer

If you want to show a live countdown to users, use the `createRetryCountdown` utility:

```typescript
import { createRetryCountdown, handleRateLimitError } from "@/Utils/rateLimitHandler";

const [retryMessage, setRetryMessage] = useState<string>("");

try {
  // API call
} catch (error: any) {
  const rateLimitInfo = handleRateLimitError(error);
  
  if (rateLimitInfo.isRateLimited && rateLimitInfo.retryAfter) {
    // Start countdown
    const cleanup = createRetryCountdown(
      rateLimitInfo.retryAfter,
      (timeLeft) => {
        setRetryMessage(`Please wait ${timeLeft} before trying again.`);
      },
      () => {
        setRetryMessage("");
        toast.success("You can try again now!");
      }
    );
    
    // Cleanup on component unmount
    return () => cleanup();
  }
}
```

## Testing Rate Limits

### Test Login Rate Limit:
1. Try to login with wrong password 5 times
2. On the 6th attempt, you'll see the rate limit message
3. Wait 15 minutes or check the message for exact time

### Test Forgot Password Rate Limit:
1. Request password reset 3 times
2. On the 4th request, you'll be rate limited
3. Message will tell you to wait 1 hour

## Backend Rate Limits Reference

| Endpoint | Limit | Window | Limiter |
|----------|-------|--------|---------|
| POST /api/auth/login | 5 requests | 15 min | loginLimiter |
| POST /api/auth/signup | 3 requests | 1 hour | signupLimiter |
| POST /api/auth/google-login | 5 requests | 15 min | loginLimiter |
| POST /api/auth/forgot-password | 3 requests | 1 hour | forgotPasswordLimiter |
| POST /api/auth/verify-otp | 5 requests | 15 min | otpVerificationLimiter |
| POST /api/auth/reset-password | 3 requests | 1 hour | resetPasswordLimiter |
| POST /api/auth/2fa/setup-verify | 10 requests | 15 min | strictLimiter |
| POST /api/auth/2fa/login-verify | 10 requests | 15 min | strictLimiter |
| All /api/* routes | 100 requests | 15 min | generalLimiter |

## Response Headers

When rate limits are active, responses include:

- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until user can retry (when rate limited)

## Error Response Structure

When rate limited (429 status):
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes."
}
```

## Customization

### Change Toast Duration
In `axiosInstance.tsx` or `Api.ts`:
```typescript
toast.error(rateLimitInfo.message, {
  duration: 5000, // Change to desired milliseconds
  icon: "⏱️",
});
```

### Change Message Format
In `rateLimitHandler.ts`, modify the `handleRateLimitError` function:
```typescript
let message = `You've exceeded the limit. Come back after ${timeRemaining} to try again.`;
```

### Add Custom Styling
The toast uses react-hot-toast. Customize in your toast configuration:
```typescript
toast.error(message, {
  duration: 6000,
  icon: "⏱️",
  style: {
    background: '#FEE2E2',
    color: '#991B1B',
  },
});
```

## Security Benefits

✅ **Prevents brute force attacks** - Attackers can't try unlimited passwords
✅ **User-friendly feedback** - Users know exactly when they can retry
✅ **Transparent limits** - Rate limit headers inform users about remaining attempts
✅ **Consistent UX** - All rate limit errors handled uniformly across the app
✅ **IP-based tracking** - Backend tracks limits per IP address

## Troubleshooting

### Rate limit message not showing?
- Check browser console for error logs
- Verify backend is sending 429 status code
- Ensure `express-rate-limit` is installed on backend

### Wrong retry time displayed?
- Check backend `RateLimit-Reset` header is set correctly
- Verify server and client clocks are synchronized

### Toast not appearing?
- Ensure `react-hot-toast` Toaster component is in your app layout
- Check for conflicting toast configurations

## Support

For issues or questions about rate limiting:
1. Check browser console for detailed error logs
2. Verify backend rate limiter configuration
3. Test with curl to see raw response headers

