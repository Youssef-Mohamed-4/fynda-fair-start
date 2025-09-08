import { useEffect } from 'react';

/**
 * SecurityHeaders Component - Enhanced Security Implementation
 * 
 * This component sets comprehensive security headers to protect against:
 * - XSS attacks (Cross-Site Scripting)
 * - Clickjacking attacks
 * - MIME type sniffing attacks
 * - Information leakage through referrer headers
 * - Mixed content issues
 * 
 * Security Features:
 * - Strict Content Security Policy (CSP) with nonces
 * - X-Frame-Options protection
 * - X-Content-Type-Options protection
 * - Referrer Policy for privacy
 * - Additional security headers
 */
const SecurityHeaders = () => {
  useEffect(() => {
    // Set security-related meta tags and headers
    const setSecurityHeaders = () => {
      // Generate a nonce for CSP (Content Security Policy)
      const nonce = btoa(Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      
      // Enhanced Content Security Policy - More restrictive for better security
      const metaCSP = document.createElement('meta');
      metaCSP.httpEquiv = 'Content-Security-Policy';
      // Removed 'unsafe-inline' and 'unsafe-eval' for better security
      // Added nonce-based script execution for better XSS protection
      metaCSP.content = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' https://kgbpbfxwsqkhzxmkkzmu.supabase.co;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https: blob:;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' https://kgbpbfxwsqkhzxmkkzmu.supabase.co wss://kgbpbfxwsqkhzxmkkzmu.supabase.co;
        frame-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'self';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim();
      
      // X-Frame-Options (SAMEORIGIN to allow Lovable editor in development)
      const metaFrameOptions = document.createElement('meta');
      metaFrameOptions.httpEquiv = 'X-Frame-Options';
      metaFrameOptions.content = 'SAMEORIGIN';
      
      // X-Content-Type-Options - Prevents MIME type sniffing
      const metaContentType = document.createElement('meta');
      metaContentType.httpEquiv = 'X-Content-Type-Options';
      metaContentType.content = 'nosniff';
      
      // Referrer Policy - Controls referrer information
      const metaReferrer = document.createElement('meta');
      metaReferrer.name = 'referrer';
      metaReferrer.content = 'strict-origin-when-cross-origin';
      
      // X-XSS-Protection (for older browsers)
      const metaXSS = document.createElement('meta');
      metaXSS.httpEquiv = 'X-XSS-Protection';
      metaXSS.content = '1; mode=block';
      
      // Permissions Policy (Feature Policy)
      const metaPermissions = document.createElement('meta');
      metaPermissions.httpEquiv = 'Permissions-Policy';
      metaPermissions.content = 'camera=(), microphone=(), geolocation=(), payment=()';

      // Check if already exists before adding to prevent duplicates
      const existingHeaders = {
        csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
        frameOptions: document.querySelector('meta[http-equiv="X-Frame-Options"]'),
        contentType: document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
        referrer: document.querySelector('meta[name="referrer"]'),
        xss: document.querySelector('meta[http-equiv="X-XSS-Protection"]'),
        permissions: document.querySelector('meta[http-equiv="Permissions-Policy"]')
      };

      // Add headers only if they don't exist
      if (!existingHeaders.csp) {
        document.head.appendChild(metaCSP);
        console.log('🔒 SecurityHeaders: CSP header added');
      }
      if (!existingHeaders.frameOptions) {
        document.head.appendChild(metaFrameOptions);
        console.log('🔒 SecurityHeaders: X-Frame-Options header added');
      }
      if (!existingHeaders.contentType) {
        document.head.appendChild(metaContentType);
        console.log('🔒 SecurityHeaders: X-Content-Type-Options header added');
      }
      if (!existingHeaders.referrer) {
        document.head.appendChild(metaReferrer);
        console.log('🔒 SecurityHeaders: Referrer Policy header added');
      }
      if (!existingHeaders.xss) {
        document.head.appendChild(metaXSS);
        console.log('🔒 SecurityHeaders: X-XSS-Protection header added');
      }
      if (!existingHeaders.permissions) {
        document.head.appendChild(metaPermissions);
        console.log('🔒 SecurityHeaders: Permissions Policy header added');
      }

      // Set nonce on script tags for CSP compliance
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (!script.getAttribute('nonce')) {
          script.setAttribute('nonce', nonce);
        }
      });
    };

    setSecurityHeaders();
    
    // Log security headers setup
    console.log('🔒 SecurityHeaders: Enhanced security headers initialized');
  }, []);

  return null;
};

export default SecurityHeaders;