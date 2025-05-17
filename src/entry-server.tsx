import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Mock Stripe for SSR
if (typeof window === 'undefined') {
  global.window = {} as any;
  global.document = {
    createElement: () => ({
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: () => {},
    }),
  } as any;
}

export function render(url: string) {
  const queryClient = new QueryClient();
  const helmetContext = {};

  return ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
} 