# Two-Factor Authentication (2FA) Component

This directory contains the Two-Factor Authentication component for the Smartle application.

## Components

### TwoFactorAuth.tsx

A React component that provides a complete 2FA verification interface with the following features:

- **6-digit OTP input**: Individual input boxes for each digit with auto-focus
- **Paste support**: Users can paste a 6-digit code
- **Auto-navigation**: Automatically moves to the next input field
- **Backspace support**: Moves to previous field when backspace is pressed
- **Resend functionality**: Option to resend verification code with cooldown timer
- **Internationalization**: Supports English, French, and Dutch
- **Loading states**: Shows loading indicators during verification and resend
- **Error handling**: Displays appropriate error messages
- **Responsive design**: Matches the existing login page design

## Usage

### Basic Usage

```tsx
import TwoFactorAuth from "@/Components/Auth/TwoFactorAuth";

function MyComponent() {
  const handleVerify = async (code: string): Promise<boolean> => {
    // Your verification logic here
    const response = await api.post('/auth/2fa/verify', { code });
    return response.data.success;
  };

  const handleResendCode = async (): Promise<void> => {
    // Your resend logic here
    await api.post('/auth/2fa/resend', { email });
  };

  return (
    <TwoFactorAuth
      onVerify={handleVerify}
      onResendCode={handleResendCode}
      email="user@example.com"
    />
  );
}
```

### Using the use2FA Hook

For better organization, you can use the provided `use2FA` hook:

```tsx
import { use2FA } from "@/hooks/use2FA";
import TwoFactorAuth from "@/Components/Auth/TwoFactorAuth";

function MyComponent() {
  const email = "user@example.com";
  const { verifyCode, resendCode } = use2FA(email);

  return (
    <TwoFactorAuth
      onVerify={verifyCode}
      onResendCode={resendCode}
      email={email}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onVerify` | `(code: string) => Promise<boolean>` | Yes | Function to verify the 2FA code |
| `onResendCode` | `() => Promise<void>` | No | Function to resend the verification code |
| `email` | `string` | No | Email address to display to the user |
| `onBack` | `() => void` | No | Function to handle going back to login |

## Features

### Input Handling
- **Individual digit inputs**: Each digit has its own input field
- **Auto-focus**: Automatically focuses the next input when a digit is entered
- **Backspace navigation**: Moves to the previous input when backspace is pressed on an empty field
- **Paste support**: Users can paste a 6-digit code and it will be distributed across the inputs
- **Numeric only**: Only allows numeric input with proper mobile keyboard support

### User Experience
- **Visual feedback**: Clear focus states and hover effects
- **Loading states**: Shows spinners during verification and resend operations
- **Error handling**: Displays toast notifications for errors
- **Success feedback**: Shows success messages and redirects on successful verification
- **Resend cooldown**: 30-second cooldown timer for resend functionality

### Internationalization
The component supports three languages:
- **English (en)**
- **French (fr)**
- **Dutch (nl)**

Language switching is handled through Redux state management.

### Styling
The component uses the same design system as the login page:
- Neutral color palette
- Consistent spacing and typography
- Responsive design
- Focus states and accessibility features

## Integration with Backend

To integrate with your backend, you'll need to implement the following endpoints:

1. **2FA Verification**: `POST /auth/2fa/verify`
   ```json
   {
     "code": "123456",
     "email": "user@example.com"
   }
   ```

2. **Resend Code**: `POST /auth/2fa/resend`
   ```json
   {
     "email": "user@example.com"
   }
   ```

## Example Page

See `/app/2fa/page.tsx` for a complete example of how to use the component in a Next.js page.

## Dependencies

- React
- Next.js
- Redux (for language management)
- react-spinners (for loading indicators)
- react-hot-toast (for notifications)
- react-icons (for icons)

## Accessibility

The component includes several accessibility features:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast support 