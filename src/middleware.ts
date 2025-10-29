import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/_next",
  "/signup",
  "/favicon.ico",
  "/forgot-password",
  "/",
  "/reset-password",
  "/verify-otp",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/gdpr"
];
const AUTH_PATHS = ["/2fa"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const pathname = req.nextUrl.pathname;
  const host = req.headers.get("host") || "";

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  /** -------------------
   *  DOMAIN-BASED ROUTING
   * ------------------- */
  // if (host === "smartle.be") {
  //   // Only allow landing page "/"
  //   if (pathname !== "/") {
  //     console.log("🌐 Redirecting smartle.be to landing page");
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // } else if (host === "app.smartle.be") {
  //   // Redirect root "/" to dashboard
  //   if (pathname === "/") {
  //     console.log("🌐 Redirecting app.smartle.be root to /dashboard");
  //     // return NextResponse.redirect(new URL("/dashboard", req.url));
  //   }
  // }

  /** -------------------
   *  AUTHENTICATION LOGIC
   * ------------------- */

  // Check if backend token has expired by checking the accessToken expiry
  let isAuth = !!token;
  if (token && token.accessToken) {
    try {
      console.log("🔍 MIDDLEWARE: Checking token expiry, accessToken exists:", !!token.accessToken);
      // Decode the JWT token to check expiry (without verification for speed)
      const payload = JSON.parse(atob(token.accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log("🔍 MIDDLEWARE: Token exp:", payload.exp, "Current time:", now, "Expired:", payload.exp && now > payload.exp);
      if (payload.exp && now > payload.exp) {
        console.log("🕐 MIDDLEWARE: Backend token expired, invalidating session");
        isAuth = false;
      }
    } catch (error) {
      console.log("⚠️ MIDDLEWARE: Error checking token expiry:", error);
      // If we can't decode the token, assume it's invalid
      isAuth = false;
    }
  } else {
    console.log("🔍 MIDDLEWARE: No token or no accessToken found");
  }

  // 1. If not authenticated and not on public or 2FA page → redirect to login
  if (!isAuth && !isPublic && !isAuthPath) {
    console.log(
      "🚫 MIDDLEWARE: Redirecting to login - not authenticated and not public route"
    );
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated but 2FA required and not verified
  if (isAuth && token?.twoFactorEnabled && !token?.is2FAVerified) {
    // Allow 2FA page
    if (isAuthPath) {
      console.log("✅ MIDDLEWARE: Allowing access to 2FA page");
      return NextResponse.next();
    }

    // Redirect to 2FA page
    if (!isPublic) {
      console.log(
        "🔄 MIDDLEWARE: Redirecting to 2FA - authenticated but 2FA not verified"
      );
      const twoFAUrl = new URL("/2fa", req.url);
      return NextResponse.redirect(twoFAUrl);
    }
  }
  // 3. If authenticated and trying to access 2FA page when not needed → redirect to dashboard
  if (
    isAuth &&
    isAuthPath &&
    (!token?.twoFactorEnabled || token?.is2FAVerified)
  ) {
    console.log("🔄 MIDDLEWARE: Redirecting to dashboard - 2FA not needed");
    const dashboardUrl = new URL("/", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  console.log("✅ MIDDLEWARE: Allowing request to proceed");
  
  // Create response with security headers to override server headers
  const response = NextResponse.next();
  
  // Override server information headers
  response.headers.set('Server', 'WebServer');
  response.headers.delete('X-Powered-By');
  response.headers.set('X-Powered-By', '');
  response.headers.delete('X-AspNet-Version');
  response.headers.set('X-AspNet-Version', '');
  response.headers.delete('X-AspNetMvc-Version');
  response.headers.set('X-AspNetMvc-Version', '');
  response.headers.delete('X-Drupal-Cache');
  response.headers.set('X-Drupal-Cache', '');
  response.headers.delete('X-Generator');
  response.headers.set('X-Generator', '');
  response.headers.delete('X-Runtime');
  response.headers.set('X-Runtime', '');
  response.headers.delete('X-Version');
  response.headers.set('X-Version', '');
  response.headers.delete('X-Forwarded-For');
  response.headers.set('X-Forwarded-For', '');
  response.headers.delete('X-Forwarded-Proto');
  response.headers.set('X-Forwarded-Proto', '');
  response.headers.delete('Via');
  response.headers.set('Via', '');
  
  // Ensure security headers are present
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Set appropriate cache control based on path
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  } else if (pathname.startsWith('/_next/static/') || pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.match(/\.(png|jpg|jpeg|gif|ico|svg)$/) || pathname.match(/^\/(robots\.txt|sitemap\.xml)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400');
  } else {
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }
  
  return response;
}

export const config = {
  matcher: ["/:path*"],
};
