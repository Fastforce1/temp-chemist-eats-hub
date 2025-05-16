import MacronutrientChart from './MacronutrientChart';

interface NutrientGoal {
  name: string;
  current: number;
  goal: number;
  unit: string;
  trend: 'up' | 'down';
}

interface NutrientGoalsProps {
  nutrientGoals: NutrientGoal[];
  macroData: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutrientGoals = ({ nutrientGoals, macroData }: NutrientGoalsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Nutrient Goals</h2>
      
      <div className="space-y-6">
        {nutrientGoals.map((nutrient, index) => {
          const progress = (nutrient.current / nutrient.goal) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium">{nutrient.name}</span>
                  {nutrient.trend === 'up' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 text-emerald-500"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 text-orange-500"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {nutrient.current} / {nutrient.goal} {nutrient.unit}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-100">
                  <div
                    style={{ width: `${progress}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      progress >= 90 ? 'bg-emerald-500' : 'bg-blue-500'
                    } transition-all duration-500`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Import and use the MacronutrientChart component */}
      <MacronutrientChart macroData={macroData} />
    </div>
  );
};

export default NutrientGoals;
