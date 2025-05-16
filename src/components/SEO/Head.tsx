import React from 'react';
import { Helmet } from 'react-helmet-async'; // Corrected import

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
  structuredData?: object;
  alternateLanguages?: { [key: string]: string };
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  preconnectUrls?: string[];
  prefetchUrls?: string[];
}

export const Head: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  keywords = [],
  ogImage,
  structuredData,
  alternateLanguages,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  preconnectUrls = [],
  prefetchUrls = []
}) => {
  const siteName = 'ChemistEats Hub';
  const defaultImage = '/images/default-og.jpg';
  const twitterHandle = '@chemisteatshub';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Resource Hints */}
      {preconnectUrls.map(url => (
        <link key={`preconnect-${url}`} rel="preconnect" href={url} crossOrigin="anonymous" />
      ))}
      {prefetchUrls.map(url => (
        <link key={`prefetch-${url}`} rel="prefetch" href={url} />
      ))}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {author && <meta property="article:author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultImage} />
      
      {/* Alternate Languages */}
      {alternateLanguages &&
        Object.entries(alternateLanguages).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#10B981" />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
