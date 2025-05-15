import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Target, 
  Droplet, 
  Apple, 
  Pill,
  TrendingUp
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC = () => {
  const nutrientData = {
    labels: ['Proteins', 'Carbs', 'Fats'],
    datasets: [{
      data: [30, 50, 20],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Log Meal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Daily Calories"
          value="1,850 / 2,000"
          icon={<Target className="w-6 h-6 text-blue-500" />}
          trend="+2% vs last week"
          color="bg-blue-50"
        />
        <MetricCard
          title="Water Intake"
          value="1.8L / 2.5L"
          icon={<Droplet className="w-6 h-6 text-cyan-500" />}
          color="bg-cyan-50"
        />
        <MetricCard
          title="Meals Logged"
          value="3 / 5"
          icon={<Apple className="w-6 h-6 text-green-500" />}
          color="bg-green-50"
        />
        <MetricCard
          title="Supplements Taken"
          value="4 / 6"
          icon={<Pill className="w-6 h-6 text-purple-500" />}
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Nutrient Balance</h2>
          <div className="h-64">
            <Doughnut 
              data={nutrientData}
              options={{
                maintainAspectRatio: false,
                cutout: '70%'
              }}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Today's Goals</h2>
          <div className="space-y-4">
            {['Protein', 'Water', 'Steps', 'Sleep'].map((goal) => (
              <div key={goal} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{goal}</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 