import React, { useState } from 'react';
import { Filter, Bell } from 'lucide-react';
import SupplementCard from '../components/supplements/SupplementCard';
import type { Supplement } from '../types';

const MOCK_SUPPLEMENTS: Supplement[] = [
  {
    id: '1',
    name: 'Omega-3 Fish Oil',
    brand: 'Nutrition Chemist',
    description: 'High-quality fish oil supplement for heart and brain health',
    benefits: ['Heart Health', 'Brain Function', 'Joint Support'],
    dosage: '1000mg, 1-2 capsules daily',
    price: 29.99,
    image: '/mock/fish-oil.jpg',
    nutrients: {
      calories: 10,
      protein: 0,
      carbs: 0,
      fat: 1,
      micronutrients: {
        'EPA': 400,
        'DHA': 300
      }
    }
  },
  // Add more mock supplements as needed
];

const Supplements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'current'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (supplement: Supplement) => {
    console.log('Added to cart:', supplement);
    // Implement add to cart logic
  };

  const handleMarkTaken = (supplement: Supplement) => {
    console.log('Marked as taken:', supplement);
    // Implement supplement tracking logic
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Supplements</h1>
        <button className="relative px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
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
                onAdd={handleAddToCart}
                onMarkTaken={handleMarkTaken}
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
    </div>
  );
};

export default Supplements; 