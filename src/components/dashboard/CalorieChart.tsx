
// Removed React import as it's not used directly with new JSX transform

interface DayData {
  day: string;
  calories: number;
}

interface CalorieChartProps {
  calorieData: DayData[];
}

const CalorieChart = ({ calorieData }: CalorieChartProps) => {
  // Calculate stats
  const totalCalories = calorieData.reduce((sum, day) => sum + day.calories, 0);
  const dailyAverage = Math.round(totalCalories / calorieData.length);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Calorie Intake</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-600 hover:bg-gray-50">
            Week
          </button>
          <button className="px-3 py-1 text-sm border border-transparent rounded-md bg-gray-100 text-gray-800">
            Month
          </button>
        </div>
      </div>

      {/* Chart visualization */}
      <div className="h-72 relative">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {calorieData.map((day, index) => (
            <div key={index} className="flex flex-col items-center w-1/7">
              <div
                className={`w-12 rounded-t-lg ${
                  day.day === 'Fri' ? 'bg-emerald-500' : 'bg-emerald-200'
                }`}
                style={{ height: `${(day.calories / 3000) * 100}%` }}
              ></div>
              <p className="mt-2 text-xs font-medium text-gray-500">{day.day}</p>
            </div>
          ))}
        </div>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between pb-8">
          <span className="text-xs text-gray-400">3000</span>
          <span className="text-xs text-gray-400">2000</span>
          <span className="text-xs text-gray-400">1000</span>
          <span className="text-xs text-gray-400">0</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Daily Average</p>
          <p className="text-lg font-semibold">{dailyAverage} calories</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Weekly Total</p>
          <p className="text-lg font-semibold">{totalCalories} calories</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Goal Progress</p>
          <p className="text-lg font-semibold text-emerald-500">92%</p>
        </div>
      </div>
    </div>
  );
};

export default CalorieChart;
