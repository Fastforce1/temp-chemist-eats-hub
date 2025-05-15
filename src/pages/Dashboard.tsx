import React from 'react';
import { LineChart, PieChart, Users, TrendingUp } from 'lucide-react';

// Import the new components
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SummaryCard from '../components/dashboard/SummaryCard';
import CalorieChart from '../components/dashboard/CalorieChart';
import NutrientGoals from '../components/dashboard/NutrientGoals';
import MealsTable from '../components/dashboard/MealsTable';

const Dashboard: React.FC = () => {
  // Mock data for visualization
  const calorieData = [
    { day: 'Mon', calories: 1850 },
    { day: 'Tue', calories: 2100 },
    { day: 'Wed', calories: 1750 },
    { day: 'Thu', calories: 1950 },
    { day: 'Fri', calories: 2200 },
    { day: 'Sat', calories: 2400 },
    { day: 'Sun', calories: 2150 },
  ];

  const macroData = {
    protein: 28,
    carbs: 45,
    fat: 27,
  };

  const nutrientGoals = [
    { name: 'Protein', current: 98, goal: 120, unit: 'g', trend: 'up' as const },
    { name: 'Carbs', current: 210, goal: 250, unit: 'g', trend: 'down' as const },
    { name: 'Fat', current: 65, goal: 70, unit: 'g', trend: 'up' as const },
    { name: 'Fiber', current: 22, goal: 30, unit: 'g', trend: 'up' as const },
  ];

  const recentMeals = [
    {
      name: 'Breakfast',
      description: 'Greek Yogurt with Berries and Granola',
      calories: 320,
      time: '8:30 AM',
    },
    {
      name: 'Lunch',
      description: 'Grilled Chicken Salad with Avocado',
      calories: 450,
      time: '12:45 PM',
    },
    {
      name: 'Snack',
      description: 'Apple with Almond Butter',
      calories: 210,
      time: '3:30 PM',
    },
    {
      name: 'Dinner',
      description: 'Salmon with Quinoa and Roasted Vegetables',
      calories: 580,
      time: '7:15 PM',
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader title="Nutrition Dashboard" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Daily Calories"
          value="1,950"
          trend={{ value: "+5.2%", direction: "up", label: "from last week" }}
          icon={LineChart}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        
        <SummaryCard 
          title="Macronutrients"
          value="Balanced"
          icon={PieChart}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
              <span className="text-xs text-gray-600">Protein</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-600">Carbs</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs text-gray-600">Fat</span>
            </div>
          </div>
        </SummaryCard>
        
        <SummaryCard 
          title="Water Intake"
          value="1.8 / 2.5L"
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        >
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: '72%' }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">0L</span>
              <span className="text-xs text-gray-500">2.5L</span>
            </div>
          </div>
        </SummaryCard>
        
        <SummaryCard 
          title="Activity Level"
          value="Moderate"
          trend={{ value: "-2.1%", direction: "down", label: "from last week" }}
          icon={TrendingUp}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Weekly Calorie Chart */}
        <CalorieChart calorieData={calorieData} />

        {/* Right column - Nutrient Goals */}
        <NutrientGoals 
          nutrientGoals={nutrientGoals}
          macroData={macroData}
        />
      </div>

      {/* Recent Meals Log */}
      <MealsTable meals={recentMeals} />
    </div>
  );
};

export default Dashboard;
