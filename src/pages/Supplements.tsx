import React, { useState } from 'react';
import { Filter, Bell, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupplementCard } from '../components/supplements/SupplementCard';
import { useCart } from '../contexts/CartContext';
import type { Supplement } from '../types';
import { Head } from '../components/SEO/Head';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { generateProductStructuredData } from '../utils/structuredData';

// Brand logo for all Nutrition Chemist products
const BRAND_LOGO = '/images/nutrition-chemist-logo.svg';

const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: '65 Creatine Capsules',
    brand: 'Nutrition Chemist',
    description: 'High-quality creatine supplement for muscle strength and performance',
    benefits: ['Muscle Strength', 'Exercise Performance', 'Recovery'],
    dosage: '1500MG, 2 capsules daily',
    price: 4.25,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Creatine Monohydrate': 1500
      }
    }
  },
  {
    id: '2',
    name: '90 Bovine Collagen Capsules',
    brand: 'Nutrition Chemist',
    description: 'Premium bovine collagen for skin, hair, and joint health',
    benefits: ['Skin Health', 'Hair Strength', 'Joint Support'],
    dosage: '1200MG, 2 capsules daily',
    price: 9.75,
    image: BRAND_LOGO,
    nutrients: {
      calories: 5,
      protein: 1,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Collagen': 1200
      }
    }
  },
  {
    id: '3',
    name: '90 Magnesium 3-in-1',
    brand: 'Nutrition Chemist',
    description: 'Triple-form magnesium supplement for optimal absorption',
    benefits: ['Muscle Function', 'Bone Health', 'Energy Production'],
    dosage: '1800MG, 2 capsules daily',
    price: 7.65,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Magnesium': 1800
      }
    }
  },
  {
    id: '4',
    name: '65 Vitamin C Orange Flavour',
    brand: 'Nutrition Chemist',
    description: 'Sugar-free orange flavored vitamin C supplement',
    benefits: ['Immune Support', 'Antioxidant Protection', 'Skin Health'],
    dosage: '250MG, 1 tablet daily',
    price: 3.92,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Vitamin C': 250
      }
    }
  },
  {
    id: '5',
    name: '125 Vitamin D3 4000iu + K2',
    brand: 'Nutrition Chemist',
    description: 'High-strength vitamin D3 with K2 for optimal absorption',
    benefits: ['Bone Health', 'Immune Function', 'Calcium Absorption'],
    dosage: '1 capsule daily',
    price: 6.10,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Vitamin D3': 4000,
        'Vitamin K2': 100
      }
    }
  },
  {
    id: '6',
    name: '65 Lions Mane + Black Pepper Extract',
    brand: 'Nutrition Chemist',
    description: 'Premium lions mane mushroom supplement with enhanced absorption',
    benefits: ['Cognitive Function', 'Mental Clarity', 'Nerve Health'],
    dosage: '4000MG, 2 capsules daily',
    price: 7.45,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Lions Mane Extract': 4000,
        'Black Pepper Extract': 10
      }
    }
  },
  {
    id: '7',
    name: '125 Biotin Growth',
    brand: 'Nutrition Chemist',
    description: 'High-strength biotin supplement for hair, skin, and nail health',
    benefits: ['Hair Growth', 'Skin Health', 'Nail Strength'],
    dosage: '10,000ug, 1 capsule daily',
    price: 5.65,
    image: BRAND_LOGO,
    nutrients: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Biotin': 10000
      }
    }
  },
  {
    id: '8',
    name: 'Beauty Glow Bovine Collagen Peptides Protein Powder',
    brand: 'Nutrition Chemist',
    description: 'Premium collagen protein powder for beauty and wellness',
    benefits: ['Skin Elasticity', 'Hair Growth', 'Joint Health', 'Protein Source'],
    dosage: '14g (1 scoop) daily',
    price: 15.32,
    image: BRAND_LOGO,
    nutrients: {
      calories: 56,
      protein: 14,
      carbs: 0,
      fat: 0,
      micronutrients: {
        'Collagen Peptides': 14000
      }
    }
  }
];

const Supplements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'current'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();

  // Generate structured data for all products
  const productsStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: MOCK_SUPPLEMENTS.map((supplement, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductStructuredData({
        name: supplement.name,
        description: supplement.description,
        image: supplement.image,
        price: supplement.price,
        currency: 'GBP',
        sku: supplement.id,
        brand: supplement.brand
      })
    }))
  };

  const handleAddToCart = (supplement: Supplement) => {
    console.log('Adding to cart:', supplement);
    addToCart(supplement, 1);
  };

  const categories = ['all', 'vitamins', 'minerals', 'herbs', 'amino-acids'];

  const filteredSupplements = selectedCategory === 'all' 
    ? MOCK_SUPPLEMENTS 
    : MOCK_SUPPLEMENTS.filter(sup => sup.nutrients.micronutrients['Collagen Peptides'] !== undefined);

  return (
    <>
      <Head 
        title="Premium Health Supplements"
        description="Shop our range of expert-formulated health supplements. High-quality vitamins, minerals, and wellness products backed by scientific research. Free UK delivery."
        keywords={['buy supplements online', 'vitamins', 'minerals', 'health supplements', 'wellness products', 'premium supplements', 'UK supplements']}
        type="website"
        structuredData={productsStructuredData}
      />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Supplements</h1>
          <div className="flex items-center space-x-4">
            <button className="relative px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="relative px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex p-4">
              <div className="flex-1">
                <div className="flex space-x-4">
                  {['all', 'recommended', 'current'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        activeTab === tab
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab as typeof activeTab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search supplements..."
                    className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <Filter className="w-5 h-5 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex space-x-4 mb-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    selectedCategory === category
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSupplements.map((supplement) => (
                <SupplementCard
                  key={supplement.id}
                  supplement={supplement}
                  onAdd={(quantity) => addToCart(supplement, quantity)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Supplements; 