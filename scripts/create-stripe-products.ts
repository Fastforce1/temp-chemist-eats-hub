import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const products = [
  {
    id: 'prod_creatine',
    name: '65 Creatine Capsules',
    description: 'High-quality creatine supplement for muscle strength and performance',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '1500MG, 2 capsules daily',
      benefits: 'Muscle Strength, Exercise Performance, Recovery'
    }
  },
  {
    id: 'prod_collagen',
    name: '90 Bovine Collagen Capsules',
    description: 'Premium bovine collagen for skin, hair, and joint health',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '1200MG, 2 capsules daily',
      benefits: 'Skin Health, Hair Strength, Joint Support'
    }
  },
  {
    id: 'prod_magnesium',
    name: '90 Magnesium 3-in-1',
    description: 'Triple-form magnesium supplement for optimal absorption',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '1800MG, 2 capsules daily',
      benefits: 'Muscle Function, Bone Health, Energy Production'
    }
  },
  {
    id: 'prod_vitaminc',
    name: '65 Vitamin C Orange Flavour',
    description: 'Sugar-free orange flavored vitamin C supplement',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '250MG, 1 tablet daily',
      benefits: 'Immune Support, Antioxidant Protection, Skin Health'
    }
  },
  {
    id: 'prod_vitamind',
    name: '125 Vitamin D3 4000iu + K2',
    description: 'High-strength vitamin D3 with K2 for optimal absorption',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '1 capsule daily',
      benefits: 'Bone Health, Immune Function, Calcium Absorption'
    }
  },
  {
    id: 'prod_lionsmane',
    name: '65 Lions Mane + Black Pepper Extract',
    description: 'Premium lions mane mushroom supplement with enhanced absorption',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '4000MG, 2 capsules daily',
      benefits: 'Cognitive Function, Mental Clarity, Nerve Health'
    }
  },
  {
    id: 'prod_biotin',
    name: '125 Biotin Growth',
    description: 'High-strength biotin supplement for hair, skin, and nail health',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '10,000ug, 1 capsule daily',
      benefits: 'Hair Growth, Skin Health, Nail Strength'
    }
  },
  {
    id: 'prod_collagenpowder',
    name: 'Beauty Glow Bovine Collagen Peptides Protein Powder',
    description: 'Premium collagen protein powder for beauty and wellness',
    images: ['/images/nutrition-chemist-logo.svg'],
    metadata: {
      dosage: '14g (1 scoop) daily',
      benefits: 'Skin Elasticity, Hair Growth, Joint Health, Protein Source'
    }
  }
];

async function createProducts() {
  console.log('🚀 Starting product creation in Stripe...');

  for (const product of products) {
    try {
      console.log(`Creating product: ${product.name}`);
      
      // Check if product already exists
      const existingProducts = await stripe.products.list({
        ids: [product.id]
      });

      if (existingProducts.data.length > 0) {
        console.log(`Product ${product.name} already exists, updating...`);
        await stripe.products.update(product.id, {
          name: product.name,
          description: product.description,
          images: product.images,
          metadata: product.metadata
        });
      } else {
        console.log(`Creating new product: ${product.name}`);
        await stripe.products.create({
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          metadata: product.metadata
        });
      }

      console.log(`✅ Successfully processed product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error processing product ${product.name}:`, error);
    }
  }

  console.log('✨ Finished processing all products');
}

createProducts().catch(console.error); 