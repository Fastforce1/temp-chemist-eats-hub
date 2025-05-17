export const STRIPE_PRODUCT_IDS = {
  CREATINE: 'prod_SKNRSFIrcMEccS',
  COLLAGEN_CAPSULES: 'prod_SKNRhm7xa1lnDI',
  MAGNESIUM: 'prod_SKNROi8dB5I8cP',
  VITAMIN_C: 'prod_SKNRvaUrOiIYtu',
  VITAMIN_D3: 'prod_SKNR4ISCsKsPsJ',
  LIONS_MANE: 'prod_SKNRAuMukf3elU',
  BIOTIN: 'prod_SKNR8BM3SGSCfr',
  COLLAGEN_POWDER: 'prod_SKNReDbdAsCJSG',
} as const;

export const STRIPE_PRICE_IDS = {
  CREATINE: 'price_1RPigUJXqLZs0wDXqfDV3Q8K',
  COLLAGEN_CAPSULES: 'price_1RPigUJXqLZs0wDXGXDfq87z',
  MAGNESIUM: 'price_1RPigUJXqLZs0wDXFZrSuAOn',
  VITAMIN_C: 'price_1RPigUJXqLZs0wDXQXARq4i4',
  VITAMIN_D3: 'price_1RPigVJXqLZs0wDXbe7bXwbP',
  LIONS_MANE: 'price_1RPigVJXqLZs0wDXlij6L6SP',
  BIOTIN: 'price_1RPigVJXqLZs0wDXD9Ebd3mj',
  COLLAGEN_POWDER: 'price_1RPigWJXqLZs0wDXzqYdutA0',
} as const;

export const getStripePriceId = (supplementName: string): string => {
  const normalizedName = supplementName.toLowerCase();
  
  if (normalizedName.includes('creatine')) {
    return STRIPE_PRICE_IDS.CREATINE;
  }
  if (normalizedName.includes('collagen') && normalizedName.includes('capsule')) {
    return STRIPE_PRICE_IDS.COLLAGEN_CAPSULES;
  }
  if (normalizedName.includes('collagen') && normalizedName.includes('powder')) {
    return STRIPE_PRICE_IDS.COLLAGEN_POWDER;
  }
  if (normalizedName.includes('magnesium')) {
    return STRIPE_PRICE_IDS.MAGNESIUM;
  }
  if (normalizedName.includes('vitamin c')) {
    return STRIPE_PRICE_IDS.VITAMIN_C;
  }
  if (normalizedName.includes('vitamin d3')) {
    return STRIPE_PRICE_IDS.VITAMIN_D3;
  }
  if (normalizedName.includes('lion') && normalizedName.includes('mane')) {
    return STRIPE_PRICE_IDS.LIONS_MANE;
  }
  if (normalizedName.includes('biotin')) {
    return STRIPE_PRICE_IDS.BIOTIN;
  }
  
  console.error(`No Stripe price ID found for supplement: ${supplementName}`);
  throw new Error(`No Stripe price ID found for supplement: ${supplementName}`);
}; 