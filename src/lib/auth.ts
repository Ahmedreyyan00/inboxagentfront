import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    "your-temporary-secret-here-replace-with-env-var";
}

if (!process.env.NEXTAUTH_URL) {
  // Use the current host in production, localhost in development
  if (process.env.NODE_ENV === "production") {
    process.env.NEXTAUTH_URL = "https://app.smartle.be";
  } else {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true, // Enable NextAuth debug mode
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Fetch client IP from ipify API for accurate rate limiting
          let clientIp = 'unknown';
          try {
            const ipResponse = await axios.get('https://api.ipify.org?format=json', { 
              timeout: 3000 
            });
            clientIp = ipResponse.data.ip || 'unknown';
            console.log('🌐 [AUTH] Client IP fetched:', clientIp);
          } catch (ipError) {
            console.warn('⚠️ [AUTH] Failed to fetch IP from ipify, continuing with unknown');
          }

          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_BASE_URL + `/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              withCredentials: true,
              headers: {
                'X-Real-IP': clientIp,
                'X-Client-IP': clientIp,
              }
            }
          );

          const data = response.data;

          if (response.status === 200 && data.success) {
            // If 2FA is required, return a special response
            if (data.requires2FA) {
              return {
                id: data.data.user._id,
                email: data.data.user.email,
                name: data.data.user.fullName,
                image: data.data.user.image,
                twoFactorEnabled: data.data.user.twoFactorEnabled,
                isAdmin: data.data.user.isAdmin,
                requires2FA: true,
                // Don't set accessToken yet
              };
            }

            // Normal login without 2FA
            return {
              id: data.data.user._id,
              email: data.data.user.email,
              name: data.data.user.fullName,
              image: data.data.user.image,
              accessToken: data.data.token,
              twoFactorEnabled: data.data.user.twoFactorEnabled,
              isAdmin: data.data.user.isAdmin,
            };
          }

          return null;
        } catch (error: any) {
          // Check if it's a rate limit error
          if (error.response?.status === 429) {
            const message = error.response?.data?.message || 'Too many login attempts. Please try again later.';
            throw new Error(`RATE_LIMIT: ${message}`);
          }
          return null;
        }
      },
    }),
    // Only add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google authentication
      if (account?.provider === "google" && profile) {
        try {
          // Fetch client IP for rate limiting
          let clientIp = 'unknown';
          try {
            const ipResponse = await axios.get('https://api.ipify.org?format=json', { 
              timeout: 3000 
            });
            clientIp = ipResponse.data.ip || 'unknown';
            console.log('🌐 [GOOGLE AUTH] Client IP fetched:', clientIp);
          } catch (ipError) {
            console.warn('⚠️ [GOOGLE AUTH] Failed to fetch IP from ipify, continuing with unknown');
          }

          // Call your backend API to authenticate Google user with token verification
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_BASE_URL + `/api/auth/google-login`,
            {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              googleId: profile.sub,
              idToken: account.id_token, // Send the Google ID token for verification
            },
            {
              headers: {
                'X-Real-IP': clientIp,
                'X-Client-IP': clientIp,
              }
            }
          );

          const data = response.data;

          if (response.status === 200 && data.success) {
            // Update the user object with backend data
            user.id = data.data.user._id;
            user.accessToken = data.data.token;
            user.twoFactorEnabled = data.data.user.twoFactorEnabled;
            user.isAdmin = data.data.user.isAdmin;

            // Handle 2FA requirement
            if (data.requires2FA) {
              user.requires2FA = true;
              // Don't set accessToken for 2FA users yet
            }

            return true;
          }

          return false;
        } catch (error: any) {
          // Check if it's a rate limit error
          if (error.response?.status === 429) {
            const message = error.response?.data?.message || 'Too many login attempts. Please try again later.';
            throw new Error(`RATE_LIMIT: ${message}`);
          }
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.twoFactorEnabled = user.twoFactorEnabled;
        token.is2FAVerified = user.is2FAVerified;
        token.isAdmin = user.isAdmin;

        // Handle 2FA requirement
        if (user.requires2FA) {
          token.requires2FA = true;
          // Don't set accessToken for 2FA users yet
        }
      }

      // Handle session updates (like when 2FA verification is completed)
      if (trigger === "update" && session) {
        token.is2FAVerified =
          session.user?.is2FAVerified ?? token.is2FAVerified;
        token.accessToken = session.accessToken ?? token.accessToken;
        token.isAdmin = session.user?.isAdmin ?? token.isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.is2FAVerified = token.is2FAVerified as boolean;
        session.user.isAdmin = token.isAdmin as boolean;

        // Handle 2FA requirement in session
        if (token.requires2FA) {
          session.requires2FA = true;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
