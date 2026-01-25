import type { Plugin } from 'vite';

/**
 * Vite plugin to handle PayU POST callbacks by converting them to GET redirects
 * PayU sends payment responses as POST requests, but Vite dev server doesn't
 * handle POST requests to SPA routes properly
 */
export function payuCallbackPlugin(): Plugin {
  return {
    name: 'payu-callback-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Only handle POST requests to /payment/success and /payment/failure
        if (req.method === 'POST' && (req.url === '/payment/success' || req.url === '/payment/failure')) {
          console.log('🔔 Received PayU POST callback:', req.url);

          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            try {
              // Parse the POST data (application/x-www-form-urlencoded)
              const params = new URLSearchParams(body);
              const queryString = params.toString();

              console.log('📦 PayU Response Data:', queryString);

              // Redirect to GET with query parameters
              const redirectUrl = `${req.url}?${queryString}`;
              console.log('🔀 Redirecting to:', redirectUrl);

              res.writeHead(302, {
                'Location': redirectUrl,
                'Content-Type': 'text/html',
              });
              res.end();
            } catch (error) {
              console.error('❌ Error processing PayU callback:', error);
              res.writeHead(500);
              res.end('Error processing payment callback');
            }
          });
        } else {
          next();
        }
      });
    },
  };
}
