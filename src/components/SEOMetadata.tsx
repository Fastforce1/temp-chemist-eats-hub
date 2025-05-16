
// import { Helmet } from 'react-helmet-async'; // Old import
import ReactHelmetAsync from 'react-helmet-async'; // New import
const { Helmet } = ReactHelmetAsync; // Destructure

interface SEOMetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export default function SEOMetadata({
  title = 'Premium UK Nutrition Supplements | Compare & Save',
  description = 'Compare premium UK nutrition supplements. Find research-backed alternatives with proven bioavailability. Expert-formulated vitamins & minerals at better value.',
  keywords = 'UK nutrition supplements, compare supplements, supplement alternatives, wellness products, premium supplements, better value supplements',
  canonicalUrl = 'https://yourwebsite.com', // Note: This should ideally be dynamic or from env
  ogImage = '/images/og-image.jpg'
}: SEOMetadataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ChemistEatsHub",
    "description": "Premium UK nutrition supplements with research-backed formulas",
    "url": canonicalUrl,
    "logo": `${canonicalUrl}/images/logo.png`, // Ensure logo path is correct
    "sameAs": [
      "https://facebook.com/chemisteatshub",
      "https://instagram.com/chemisteatshub",
      "https://tiktok.com/@chemisteatshub"
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "6.99",
      "highPrice": "199.99",
      "offerCount": "50+",
      "description": "Compare and find better value supplements"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "UK Nutrition Supplements",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Premium Vitamins & Minerals",
          "itemListElement": [
            {
              "@type": "Product",
              "name": "Vitamin D3 + K2",
              "description": "High-strength formula with optimal absorption",
              "category": "Vitamin Supplements",
              "offers": {
                "@type": "Offer",
                "price": "9.99",
                "priceCurrency": "GBP"
              }
            },
            {
              "@type": "Product",
              "name": "Magnesium Complex",
              "description": "Triple-form magnesium for enhanced bioavailability",
              "category": "Mineral Supplements",
              "offers": {
                "@type": "Offer",
                "price": "14.99",
                "priceCurrency": "GBP"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Wellness Products",
          "itemListElement": [
            {
              "@type": "Product",
              "name": "Collagen Supplements",
              "description": "Premium grade with proven absorption",
              "category": "Beauty & Wellness",
              "offers": {
                "@type": "Offer",
                "price": "16.99",
                "priceCurrency": "GBP"
              }
            }
          ]
        }
      ]
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "ComparisonFeature",
        "value": "Research-backed formulas"
      },
      {
        "@type": "PropertyValue",
        "name": "ComparisonFeature",
        "value": "Better value pricing"
      },
      {
        "@type": "PropertyValue",
        "name": "ComparisonFeature",
        "value": "Proven bioavailability"
      }
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Comparison Meta Tags */}
      <meta name="product:category" content="UK Nutrition Supplements" />
      <meta name="product:availability" content="in_stock" />
      <meta name="product:condition" content="new" />
      <meta name="product:price:amount" content="6.99" />
      <meta name="product:price:currency" content="GBP" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
