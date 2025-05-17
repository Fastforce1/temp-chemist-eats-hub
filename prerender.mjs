import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// Mock browser globals for SSR
global.window = {
  matchMedia: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  }),
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null
  },
  location: {
    pathname: '/',
    search: '',
    hash: ''
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
  innerWidth: 1024,
  innerHeight: 768
}

global.document = {
  createElement: () => ({
    style: {},
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    removeAttribute: () => {}
  }),
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
  defaultView: global.window,
  addEventListener: () => {},
  removeEventListener: () => {},
  createTextNode: (text) => ({ text }),
  querySelector: () => null,
  querySelectorAll: () => []
}

// Mock navigator using Object.defineProperty
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'node',
    language: 'en-US',
    platform: 'node'
  },
  configurable: true
});

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')

// Helper function to ensure dynamic routes have sample values
const generateDynamicRoutes = (baseRoute, params) => {
  // For now, just generate one example for each dynamic route
  return params.map(param => {
    const sampleValue = 'example-' + param.replace(':', '');
    return baseRoute.replace(param, sampleValue);
  });
};

// Define routes to prerender based on App.tsx route configuration
const routesToPrerender = [
  // Public routes
  '/',
  '/login',
  '/signup',
  '/search',
  '/contact',
  '/saved',
  
  // Dynamic routes (with sample values)
  ...generateDynamicRoutes('/recipe/:id', [':id']),
  
  // Dashboard routes
  '/dashboard',
  '/dashboard/meals',
  '/dashboard/supplements',
  '/dashboard/progress',
  '/dashboard/log',
  '/dashboard/learn',
  '/dashboard/settings',
  '/dashboard/profile'
];

;(async () => {
  for (const url of routesToPrerender) {
    const appHtml = render(url)
    const html = template.replace('<!--app-html-->', appHtml)

    // Ensure the file path is properly constructed
    const filePath = `dist${url === '/' ? '/index' : url}.html`
    
    // Create all necessary subdirectories
    const dirPath = path.dirname(toAbsolute(filePath))
    fs.mkdirSync(dirPath, { recursive: true })
    
    // Write the file
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})() 