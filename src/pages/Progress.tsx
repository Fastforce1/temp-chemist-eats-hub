import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, TrendingUp, Scale, Activity } from 'lucide-react';

const MOCK_DATA = [
  { date: '2024-01-01', weight: 180, calories: 2100, protein: 120 },
  { date: '2024-01-08', weight: 178, calories: 2000, protein: 125 },
  { date: '2024-01-15', weight: 177, calories: 1950, protein: 130 },
  { date: '2024-01-22', weight: 175, calories: 1900, protein: 135 },
];

const Progress: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Progress Tracking</h1>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Weight</p>
              <p className="text-2xl font-semibold mt-1">175 lbs</p>
            </div>
            <Scale className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">-5 lbs this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Calories</p>
              <p className="text-2xl font-semibold mt-1">1,950</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center text-green-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">On target</span>
          </div>
        </div>

        {/* Add more metric cards */}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Weight Progress</h2>
        <div className="h-80">
          <LineChart
            width={800}
            height={300}
            data={MOCK_DATA}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#3B82F6" />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Calorie Tracking</h2>
          <div className="h-64">
            <LineChart
              width={400}
              height={200}
              data={MOCK_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#10B981" />
            </LineChart>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Protein Intake</h2>
          <div className="h-64">
            <LineChart
              width={400}
              height={200}
              data={MOCK_DATA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="protein" stroke="#8B5CF6" />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 