import React, { useState } from 'react';
import { Plus, Clock, Coffee, Sun, Moon, UtensilsCrossed } from 'lucide-react';

interface MealEntry {
  id: string;
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface SupplementEntry {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const MOCK_MEALS: MealEntry[] = [
  {
    id: '1',
    time: '08:00',
    type: 'breakfast',
    foods: ['Oatmeal with berries', 'Greek yogurt', 'Coffee'],
    calories: 450,
    protein: 25,
    carbs: 65,
    fat: 12,
  },
  {
    id: '2',
    time: '13:00',
    type: 'lunch',
    foods: ['Grilled chicken salad', 'Quinoa', 'Olive oil dressing'],
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 25,
  },
];

const MOCK_SUPPLEMENTS: SupplementEntry[] = [
  {
    id: '1',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    time: '08:00',
    taken: true,
  },
  {
    id: '2',
    name: 'Omega-3',
    dosage: '1000mg',
    time: '13:00',
    taken: false,
  },
];

const DailyLog: React.FC = () => {
  const [meals, setMeals] = useState<MealEntry[]>(MOCK_MEALS);
  const [supplements, setSupplements] = useState<SupplementEntry[]>(MOCK_SUPPLEMENTS);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const totalNutrition = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <Coffee className="w-5 h-5" />;
      case 'lunch':
        return <Sun className="w-5 h-5" />;
      case 'dinner':
        return <Moon className="w-5 h-5" />;
      default:
        return <UtensilsCrossed className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Daily Log</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total Calories</p>
          <p className="text-2xl font-semibold">{totalNutrition.calories}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Protein</p>
          <p className="text-2xl font-semibold">{totalNutrition.protein}g</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Carbs</p>
          <p className="text-2xl font-semibold">{totalNutrition.carbs}g</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Fat</p>
          <p className="text-2xl font-semibold">{totalNutrition.fat}g</p>
        </div>
      </div>

      {/* Meals Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Meals</h2>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </button>
        </div>
        <div className="space-y-4">
          {meals.map((meal) => (
            <div key={meal.id} className="flex items-start p-4 border rounded-lg">
              <div className="flex-shrink-0 mr-4">
                {getMealIcon(meal.type)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium capitalize">{meal.type}</h3>
                  <span className="ml-2 text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {meal.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{meal.foods.join(', ')}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {meal.calories} cal · {meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplements Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Supplements</h2>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplement
          </button>
        </div>
        <div className="space-y-4">
          {supplements.map((supplement) => (
            <div key={supplement.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{supplement.name}</h3>
                <p className="text-sm text-gray-500">{supplement.dosage} at {supplement.time}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplement.taken}
                  onChange={() => {
                    setSupplements(supplements.map(s =>
                      s.id === supplement.id ? { ...s, taken: !s.taken } : s
                    ));
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyLog; 