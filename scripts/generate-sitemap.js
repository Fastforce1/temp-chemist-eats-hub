
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes } from '../prerender-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.nutritionchemist.com'; // Site URL for sitemap generation

function generateSitemap() {
  console.log('Generating sitemap for client-side rendered application...');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .filter(route => route.path && !route.path.includes('*'))
    .map(
      route => `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  const distDir = path.resolve(__dirname, '../dist');
  
  try {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Don't fail the build for sitemap issues
    process.exit(0);
  }
}

generateSitemap();
