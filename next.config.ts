import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    domains: ['api.dicebear.com'],
    unoptimized: true,
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Production optimizations to reduce information disclosure
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  webpack(config, { dev, isServer }) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    
    // Production optimizations to remove comments and obfuscate code
    if (!dev) {
      // Configure webpack to minimize and remove comments
      config.optimization = {
        ...config.optimization,
        minimize: true,
        // Remove comments and debug information
        minimizer: config.optimization.minimizer?.map((plugin: any) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            // Configure existing Terser plugin to remove comments
            plugin.options.terserOptions = {
              ...plugin.options.terserOptions,
              compress: {
                ...plugin.options.terserOptions?.compress,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
              },
              mangle: {
                ...plugin.options.terserOptions?.mangle,
                toplevel: true,
              },
              format: {
                ...plugin.options.terserOptions?.format,
                comments: false,
              },
            };
          }
          return plugin;
        }),
      };

      // Remove source maps in production to prevent information disclosure
      config.devtool = false;
      
      // Additional optimizations to reduce information disclosure
      config.optimization.concatenateModules = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  async headers() {
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'none'",
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      // Cache control headers
      {
        key: 'Cache-Control',
        value: 'public, max-age=0, must-revalidate',
      },
      // Override server information to hide nginx version
      {
        key: 'Server',
        value: 'WebServer',
      },
      // Remove X-Powered-By header completely
      {
        key: 'X-Powered-By',
        value: '',
      },
      // Additional headers to hide technology stack
      {
        key: 'X-AspNet-Version',
        value: '',
      },
      {
        key: 'X-AspNetMvc-Version',
        value: '',
      },
      {
        key: 'X-Drupal-Cache',
        value: '',
      },
      {
        key: 'X-Generator',
        value: '',
      },
      {
        key: 'X-Runtime',
        value: '',
      },
      {
        key: 'X-Version',
        value: '',
      },
      {
        key: 'X-Forwarded-For',
        value: '',
      },
      {
        key: 'X-Forwarded-Proto',
        value: '',
      },
      {
        key: 'Via',
        value: '',
      },
    ];

    // Cache control headers for different content types
    const staticAssetHeaders = [
      ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ];

    const pageHeaders = [
      ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
      {
        key: 'Cache-Control',
        value: 'public, max-age=0, must-revalidate',
      },
    ];

    const apiHeaders = [
      ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
      {
        key: 'Cache-Control',
        value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    ];

    const publicFileHeaders = [
      ...securityHeaders.filter(h => h.key !== 'Cache-Control'),
      {
        key: 'Cache-Control',
        value: 'public, max-age=86400',
      },
    ];

    return [
      // Apply to static assets (long cache)
      {
        source: '/_next/static/:path*',
        headers: staticAssetHeaders,
      },
      // Apply to API routes (no cache)
      {
        source: '/api/:path*',
        headers: apiHeaders,
      },
      // Apply to JavaScript files (long cache)
      {
        source: '/:path*\\.js',
        headers: staticAssetHeaders,
      },
      // Apply to CSS files (long cache)
      {
        source: '/:path*\\.css',
        headers: staticAssetHeaders,
      },
      // Apply to image files (medium cache)
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|ico|svg)',
        headers: publicFileHeaders,
      },
      // Apply to font files (long cache)
      {
        source: '/:path*\\.(woff|woff2|ttf|eot)',
        headers: staticAssetHeaders,
      },
      // Apply to robots.txt and sitemap.xml (short cache)
      {
        source: '/robots.txt',
        headers: publicFileHeaders,
      },
      {
        source: '/sitemap.xml',
        headers: publicFileHeaders,
      },
      // Apply to all other pages (no cache)
      {
        source: '/(.*)',
        headers: pageHeaders,
      },
    ];
  },
};

export default nextConfig;
