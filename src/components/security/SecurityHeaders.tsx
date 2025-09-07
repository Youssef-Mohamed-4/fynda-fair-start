import { useEffect } from 'react';

const SecurityHeaders = () => {
  useEffect(() => {
    // Set security-related meta tags and headers
    const setSecurityHeaders = () => {
      // Content Security Policy (basic)
      const metaCSP = document.createElement('meta');
      metaCSP.httpEquiv = 'Content-Security-Policy';
      metaCSP.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:";
      
      // X-Frame-Options (SAMEORIGIN to allow Lovable editor)
      const metaFrameOptions = document.createElement('meta');
      metaFrameOptions.httpEquiv = 'X-Frame-Options';
      metaFrameOptions.content = 'SAMEORIGIN';
      
      // X-Content-Type-Options
      const metaContentType = document.createElement('meta');
      metaContentType.httpEquiv = 'X-Content-Type-Options';
      metaContentType.content = 'nosniff';
      
      // Referrer Policy
      const metaReferrer = document.createElement('meta');
      metaReferrer.name = 'referrer';
      metaReferrer.content = 'strict-origin-when-cross-origin';

      // Check if already exists before adding
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        document.head.appendChild(metaCSP);
      }
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        document.head.appendChild(metaFrameOptions);
      }
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        document.head.appendChild(metaContentType);
      }
      if (!document.querySelector('meta[name="referrer"]')) {
        document.head.appendChild(metaReferrer);
      }
    };

    setSecurityHeaders();
  }, []);

  return null;
};

export default SecurityHeaders;