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
      currency: 'usd',
      unit_amount: 425, // $4.25 in cents
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
      currency: 'usd',
      unit_amount: 975, // $9.75 in cents
    },
    metadata: {
      dosage: '1200MG, 2 capsules daily',
      benefits: 'Skin Health, Hair Strength, Joint Support',
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