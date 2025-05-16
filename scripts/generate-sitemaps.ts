import fs from 'fs/promises';
import path from 'path';
import { generateProductSitemap, generateComparisonSitemap, generateCategorySitemap } from '../src/utils/generateSitemap';

// This would typically come from your database or API
const mockProducts = [
  { slug: 'whey-protein', name: 'Whey Protein' },
  { slug: 'creatine-monohydrate', name: 'Creatine Monohydrate' },
  { slug: 'bcaa-powder', name: 'BCAA Powder' },
  { slug: 'pre-workout', name: 'Pre-Workout' },
  { slug: 'multivitamin', name: 'Multivitamin' }
];

const categories = [
  'protein',
  'pre-workout',
  'post-workout',
  'vitamins',
  'minerals',
  'amino-acids',
  'weight-management',
  'wellness'
];

async function generateSitemaps() {
  try {
    // Create sitemaps directory if it doesn't exist
    const sitemapsDir = path.join(process.cwd(), 'public', 'sitemaps');
    await fs.mkdir(sitemapsDir, { recursive: true });

    // Generate main sitemap
    const productSitemap = await generateProductSitemap(mockProducts);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-products.xml'),
      productSitemap
    );

    // Generate comparison sitemap
    const comparisonSitemap = await generateComparisonSitemap(mockProducts);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-comparisons.xml'),
      comparisonSitemap
    );

    // Generate category sitemap
    const categorySitemap = await generateCategorySitemap(categories);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-categories.xml'),
      categorySitemap
    );

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>${process.env.VITE_APP_URL}/sitemaps/sitemap-products.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
          <loc>${process.env.VITE_APP_URL}/sitemaps/sitemap-comparisons.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
          <loc>${process.env.VITE_APP_URL}/sitemaps/sitemap-categories.xml</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
      </sitemapindex>`;

    await fs.writeFile(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemapIndex
    );

    console.log('Successfully generated all sitemaps!');
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1);
  }
}

generateSitemaps(); 