
// This file exists as a simplified placeholder for the previous SSR configuration
// Used by other scripts that might reference it

export const routes = [
  { path: '/' },
  { path: '/search' },
  { path: '/login' },
  { path: '/contact' },
];

export function getStaticPaths() {
  return routes.map(route => route.path);
}

export const prerenderConfig = {
  excludePaths: [
    '/dashboard',
    '/saved',
    '/meal-planner',
    '/profile',
    '/recipe/*'
  ],
  fallback: true,
};
