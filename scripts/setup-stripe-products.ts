import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const products = [
  {
    name: '65 Creatine Capsules',
    description: 'High-quality creatine supplement for muscle strength and performance',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 425, // £4.25 in pence
    },
    metadata: {
      dosage: '1500MG, 2 capsules daily',
      benefits: 'Muscle Strength, Exercise Performance, Recovery',
    },
  },
  {
    name: '90 Bovine Collagen Capsules',
    description: 'Premium bovine collagen for skin, hair, and joint health',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 975, // £9.75 in pence
    },
    metadata: {
      dosage: '1200MG, 2 capsules daily',
      benefits: 'Skin Health, Hair Strength, Joint Support',
    },
  },
  {
    name: '90 Magnesium 3-in-1',
    description: 'Triple-form magnesium supplement for optimal absorption',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 765, // £7.65 in pence
    },
    metadata: {
      dosage: '1800MG, 2 capsules daily',
      benefits: 'Muscle Function, Bone Health, Energy Production',
    },
  },
  {
    name: '65 Vitamin C Orange Flavour',
    description: 'Sugar-free orange flavored vitamin C supplement',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 392, // £3.92 in pence
    },
    metadata: {
      dosage: '250MG, 1 tablet daily',
      benefits: 'Immune Support, Antioxidant Protection, Skin Health',
    },
  },
  {
    name: '125 Vitamin D3 4000iu + K2',
    description: 'High-strength vitamin D3 with K2 for optimal absorption',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 610, // £6.10 in pence
    },
    metadata: {
      dosage: '1 capsule daily',
      benefits: 'Bone Health, Immune Function, Calcium Absorption',
    },
  },
  {
    name: '65 Lions Mane + Black Pepper Extract',
    description: 'Premium lions mane mushroom supplement with enhanced absorption',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 745, // £7.45 in pence
    },
    metadata: {
      dosage: '4000MG, 2 capsules daily',
      benefits: 'Cognitive Function, Mental Clarity, Nerve Health',
    },
  },
  {
    name: '125 Biotin Growth',
    description: 'High-strength biotin supplement for hair, skin, and nail health',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 565, // £5.65 in pence
    },
    metadata: {
      dosage: '10,000ug, 1 capsule daily',
      benefits: 'Hair Growth, Skin Health, Nail Strength',
    },
  },
  {
    name: 'Beauty Glow Bovine Collagen Peptides Protein Powder',
    description: 'Premium collagen protein powder for beauty and wellness',
    default_price_data: {
      currency: 'gbp',
      unit_amount: 1532, // £15.32 in pence
    },
    metadata: {
      dosage: '14g (1 scoop) daily',
      benefits: 'Skin Elasticity, Hair Growth, Joint Health, Protein Source',
    },
  },
];

async function createProducts() {
  try {
    console.log('🚀 Starting Stripe product creation...');

    for (const productData of products) {
      console.log(`Creating product: ${productData.name}`);
      const product = await stripe.products.create({
        ...productData,
        active: true,
      });
      console.log(`✅ Created product: ${product.name} (ID: ${product.id})`);
      console.log(`   Price ID: ${(product as any).default_price}`);
    }

    console.log('\n✨ All products created successfully!');
  } catch (error) {
    console.error('❌ Error creating products:', error);
    process.exit(1);
  }
}

createProducts(); 