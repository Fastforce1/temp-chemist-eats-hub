import { RouteObject } from 'react-router-dom';

// Define all routes that should be pre-rendered
export const routes: RouteObject[] = [
  { path: '/' },
  { path: '/search' },
  { path: '/login' },
  { path: '/contact' },
  // Dynamic routes that should have static versions
  { path: '/recipe/popular' },
  { path: '/recipe/trending' },
  { path: '/recipe/new' }
];

// Function to get all static paths
export function getStaticPaths() {
  return routes.map(route => route.path);
}

// Configuration for pre-rendering
export const prerenderConfig = {
  // Disable pre-rendering for dynamic routes that depend on user data
  excludePaths: [
    '/dashboard',
    '/saved',
    '/meal-planner',
    '/profile',
    '/recipe/*' // Exclude dynamic recipe pages
  ],
  // Enable SPA fallback for dynamic routes
  fallback: true,
  // Snapshot options
  snapshot: {
    // Wait for network requests to complete
    waitForNetworkIdle: true,
    // Maximum timeout for each page
    maxTimeout: 10000
  }
}; 