import { writeFileSync } from 'fs';
import { format } from 'date-fns';

const SITE_URL = 'https://yourwebsite.com';

const pages = [
  '',
  '/shop',
  '/supplements',
  '/bundles',
  '/health-goals',
  '/about',
  '/contact',
  '/blog',
  '/compare-supplements',
  '/supplement-alternatives',
  '/uk-supplement-guide',
  '/supplement-value-comparison',
];

const supplements = [
  'vitamin-d3-k2',
  'magnesium-complex',
  'zinc-picolinate',
  'collagen-powder',
  'turmeric-complex',
  'ashwagandha',
  'lions-mane',
  'creatine-monohydrate',
  'biotin-complex',
  'omega-3',
];

const comparisons = supplements.map(sup => `compare-${sup}`);
const alternatives = supplements.map(sup => `alternatives-to-${sup}`);
const reviews = supplements.map(sup => `${sup}-review`);

const healthGoals = [
  'immunity',
  'energy',
  'sleep',
  'stress-anxiety',
  'joint-health',
  'cognitive-function',
  'hair-skin-nails',
  'hormone-balance',
  'digestion',
  'muscle-recovery',
];

function generateUrl(path: string, priority: number = 0.5, changefreq: string = 'weekly') {
  return `
    <url>
      <loc>${SITE_URL}${path}</loc>
      <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;
}

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => generateUrl(page, page === '' ? 1.0 : 0.8, 'daily')).join('')}
      ${supplements.map(supplement => generateUrl('/supplements/' + supplement, 0.7)).join('')}
      ${comparisons.map(comp => generateUrl('/compare/' + comp, 0.7)).join('')}
      ${alternatives.map(alt => generateUrl('/alternatives/' + alt, 0.7)).join('')}
      ${reviews.map(review => generateUrl('/reviews/' + review, 0.6)).join('')}
      ${healthGoals.map(goal => generateUrl('/health-goals/' + goal, 0.6)).join('')}
    </urlset>`;

  writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap(); 