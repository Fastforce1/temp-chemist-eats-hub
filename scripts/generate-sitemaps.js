import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { supabase } from '../src/lib/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('slug, name, updated_at')
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products.map(p => ({
    slug: p.slug,
    name: p.name,
    updatedAt: p.updated_at
  }));
}

async function fetchCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('slug, name, updated_at')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories.map(c => ({
    slug: c.slug,
    name: c.name,
    updatedAt: c.updated_at
  }));
}

const generateSitemapXML = (urls) => {
  const xmlUrls = urls
    .map(({ url, lastmod, changefreq, priority }) => `
      <url>
        <loc>${url}</loc>
        ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
        ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
        ${priority !== undefined ? `<priority>${priority}</priority>` : ''}
      </url>
    `)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${xmlUrls}
    </urlset>`;
};

const generateProductSitemap = async (products) => {
  const productUrls = products.map(product => ({
    url: `${process.env.VITE_APP_URL || 'https://chemist-eats-hub.com'}/supplements/${product.slug}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8
  }));

  return generateSitemapXML([
    {
      url: process.env.VITE_APP_URL || 'https://chemist-eats-hub.com',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${process.env.VITE_APP_URL || 'https://chemist-eats-hub.com'}/supplements`,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${process.env.VITE_APP_URL || 'https://chemist-eats-hub.com'}/health-goals`,
      changefreq: 'weekly',
      priority: 0.8
    },
    ...productUrls
  ]);
};

const generateComparisonSitemap = async (products) => {
  const comparisonUrls = [];

  // Generate comparison URLs for each pair of products
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      comparisonUrls.push({
        url: `${process.env.VITE_APP_URL || 'https://chemist-eats-hub.com'}/compare/${products[i].slug}-vs-${products[j].slug}`,
        changefreq: 'weekly',
        priority: 0.7
      });
    }
  }

  return generateSitemapXML(comparisonUrls);
};

const generateCategorySitemap = async (categories) => {
  const categoryUrls = categories.map(category => ({
    url: `${process.env.VITE_APP_URL || 'https://chemist-eats-hub.com'}/supplements/category/${category}`,
    changefreq: 'weekly',
    priority: 0.6
  }));

  return generateSitemapXML(categoryUrls);
};

async function generateSitemaps() {
  try {
    // Create sitemaps directory if it doesn't exist
    const sitemapsDir = path.join(process.cwd(), 'public', 'sitemaps');
    await fs.mkdir(sitemapsDir, { recursive: true });

    // Fetch real data
    const products = await fetchProducts();
    const categories = await fetchCategories();

    if (!products.length) {
      console.warn('No products found, using mock data');
      products.push(...mockProducts.map(p => ({
        ...p,
        updatedAt: new Date().toISOString()
      })));
    }

    if (!categories.length) {
      console.warn('No categories found, using mock data');
      categories.push(...mockCategories.map(c => ({
        slug: c,
        name: c.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        updatedAt: new Date().toISOString()
      })));
    }

    const currentTime = new Date().toISOString();
    const sitemapFiles = [];

    // Generate product sitemap
    const productSitemap = await generateProductSitemap(products);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-products.xml'),
      productSitemap
    );
    sitemapFiles.push({
      path: '/sitemaps/sitemap-products.xml',
      lastmod: currentTime
    });

    // Generate comparison sitemap
    const comparisonSitemap = await generateComparisonSitemap(products);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-comparisons.xml'),
      comparisonSitemap
    );
    sitemapFiles.push({
      path: '/sitemaps/sitemap-comparisons.xml',
      lastmod: currentTime
    });

    // Generate category sitemap
    const categorySitemap = await generateCategorySitemap(categories);
    await fs.writeFile(
      path.join(sitemapsDir, 'sitemap-categories.xml'),
      categorySitemap
    );
    sitemapFiles.push({
      path: '/sitemaps/sitemap-categories.xml',
      lastmod: currentTime
    });

    // Generate sitemap index
    const sitemapIndex = generateSitemapIndex(sitemapFiles);
    await fs.writeFile(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemapIndex
    );

    console.log('Successfully generated all sitemaps!');

    // Ping search engines
    const siteUrl = process.env.VITE_APP_URL || 'https://chemist-eats-hub.com';
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    
    try {
      // Ping Google
      await fetch(`http://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log('Successfully pinged Google');
      
      // Ping Bing
      await fetch(`http://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log('Successfully pinged Bing');
    } catch (error) {
      console.warn('Error pinging search engines:', error);
    }
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Fallback mock data
const mockProducts = [
  { slug: 'whey-protein', name: 'Whey Protein' },
  { slug: 'creatine-monohydrate', name: 'Creatine Monohydrate' },
  { slug: 'bcaa-powder', name: 'BCAA Powder' },
  { slug: 'pre-workout', name: 'Pre-Workout' },
  { slug: 'multivitamin', name: 'Multivitamin' }
];

const mockCategories = [
  'protein',
  'pre-workout',
  'post-workout',
  'vitamins',
  'minerals',
  'amino-acids',
  'weight-management',
  'wellness'
];

generateSitemaps(); 