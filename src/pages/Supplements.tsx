import React, { useState } from 'react';
import { Filter, Bell, ShoppingCart } from 'lucide-react';
import SupplementCard from '../components/supplements/SupplementCard';
import Cart from '../components/cart/Cart';
import { useCart } from '../contexts/CartContext';
import type { Supplement } from '../types';

// Brand logo for all Nutrition Chemist products
const BRAND_LOGO = '/images/nutrition-chemist-logo.png';

const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'Creatine Capsules',
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
    name: 'Bovine Collagen Capsules',
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
    name: 'Magnesium 3-in-1',
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
    name: 'Vitamin C Orange Flavoured',
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
    name: 'Vitamin D3 4000iu + K2',
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
    name: 'Lions Mane + Black Pepper Extract',
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
    name: 'Biotin Growth',
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, itemCount } = useCart();

  const handleAddToCart = (supplement: Supplement) => {
    console.log('Adding to cart:', supplement);
    addToCart(supplement, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Supplements</h1>
        <div className="flex items-center space-x-4">
          <button className="relative px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SUPPLEMENTS.map(supplement => (
              <SupplementCard
                key={supplement.id}
                supplement={supplement}
                isRecommended={activeTab === 'recommended'}
                onAdd={() => handleAddToCart(supplement)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Supplement Schedule
          </h2>
          <div className="space-y-4">
            {['Morning', 'Afternoon', 'Evening'].map(timeOfDay => (
              <div key={timeOfDay} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-700">{timeOfDay}</h3>
                  <p className="text-sm text-gray-500">2 supplements</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Supplement Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              <p className="font-medium">Good adherence!</p>
              <p className="text-sm mt-1">You've taken 90% of your supplements this week.</p>
            </div>
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
              <p className="font-medium">Vitamin D is running low</p>
              <p className="text-sm mt-1">Order now to maintain your supply.</p>
            </div>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Supplements; 