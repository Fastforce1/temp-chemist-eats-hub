interface SitemapURL {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface Product {
  slug: string;
  name: string;
  updatedAt?: string;
}

interface Category {
  slug: string;
  name: string;
  updatedAt?: string;
}

const formatDate = (date: string | Date): string => {
  return new Date(date).toISOString();
};

const getLastModified = (item: { updatedAt?: string }): string => {
  return item.updatedAt ? formatDate(item.updatedAt) : formatDate(new Date());
};

export const generateSitemapXML = (urls: SitemapURL[]): string => {
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

export const generateProductSitemap = async (products: Product[]): Promise<string> => {
  const baseUrl = process.env.VITE_APP_URL || 'https://chemist-eats-hub.com';
  
  const productUrls: SitemapURL[] = products.map(product => ({
    url: `${baseUrl}/supplements/${product.slug}`,
    lastmod: getLastModified(product),
    changefreq: 'daily',
    priority: 0.8
  }));

  return generateSitemapXML([
    {
      url: baseUrl,
      lastmod: formatDate(new Date()),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/supplements`,
      lastmod: formatDate(new Date()),
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/health-goals`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: 0.8
    },
    ...productUrls
  ]);
};

export const generateComparisonSitemap = async (products: Product[]): Promise<string> => {
  const baseUrl = process.env.VITE_APP_URL || 'https://chemist-eats-hub.com';
  const comparisonUrls: SitemapURL[] = [];

  // Generate comparison URLs for each pair of products
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const lastmod = [products[i], products[j]]
        .map(p => p.updatedAt ? new Date(p.updatedAt) : new Date())
        .sort((a, b) => b.getTime() - a.getTime())[0];

      comparisonUrls.push({
        url: `${baseUrl}/compare/${products[i].slug}-vs-${products[j].slug}`,
        lastmod: formatDate(lastmod),
        changefreq: 'weekly',
        priority: 0.7
      });
    }
  }

  return generateSitemapXML(comparisonUrls);
};

export const generateCategorySitemap = async (categories: Category[]): Promise<string> => {
  const baseUrl = process.env.VITE_APP_URL || 'https://chemist-eats-hub.com';
  const categoryUrls: SitemapURL[] = categories.map(category => ({
    url: `${baseUrl}/supplements/category/${category.slug}`,
    lastmod: getLastModified(category),
    changefreq: 'weekly',
    priority: 0.6
  }));

  return generateSitemapXML(categoryUrls);
};

export const generateSitemapIndex = (sitemaps: { path: string; lastmod: string }[]): string => {
  const baseUrl = process.env.VITE_APP_URL || 'https://chemist-eats-hub.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps.map(sitemap => `
        <sitemap>
          <loc>${baseUrl}${sitemap.path}</loc>
          <lastmod>${sitemap.lastmod}</lastmod>
        </sitemap>
      `).join('')}
    </sitemapindex>`;
}; 