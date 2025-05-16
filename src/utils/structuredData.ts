interface ProductStructuredData {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  sku: string;
  brand?: string;
  category?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  reviews?: Array<{
    author: string;
    rating: number;
    content: string;
    datePublished: string;
  }>;
}

export const generateProductStructuredData = ({
  name,
  description,
  image,
  price,
  currency,
  sku,
  brand,
  category,
  availability = 'InStock',
  reviews = []
}: ProductStructuredData) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: brand ? {
      '@type': 'Brand',
      name: brand
    } : undefined,
    category,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: window.location.href
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
        reviewCount: reviews.length
      },
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating
        },
        reviewBody: review.content,
        datePublished: review.datePublished
      }))
    })
  };
};

export const generateFAQStructuredData = (questions: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}; 