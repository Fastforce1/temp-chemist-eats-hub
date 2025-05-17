export const STRIPE_PRODUCT_IDS = {
  CREATINE: 'prod_SKNLHf8FbRzteV',
  COLLAGEN: 'prod_SKNLRTgpaYudwA',
} as const;

export const STRIPE_PRICE_IDS = {
  CREATINE: 'price_1RPianJXqLZs0wDX2qgkrM7V',
  COLLAGEN: 'price_1RPianJXqLZs0wDXDKYqD63c',
} as const;

export const getStripePriceId = (supplementName: string): string => {
  const normalizedName = supplementName.toLowerCase();
  
  if (normalizedName.includes('creatine')) {
    return STRIPE_PRICE_IDS.CREATINE;
  }
  if (normalizedName.includes('collagen')) {
    return STRIPE_PRICE_IDS.COLLAGEN;
  }
  
  throw new Error(`No Stripe price ID found for supplement: ${supplementName}`);
}; 