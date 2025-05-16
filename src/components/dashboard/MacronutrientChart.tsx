
// Removed React import as it's not used directly with new JSX transform

interface MacroData {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacronutrientChartProps {
  macroData: MacroData;
}

const MacronutrientChart = ({ macroData }: MacronutrientChartProps) => {
  return (
    <div className="mt-8">
      <h3 className="font-medium text-gray-800 mb-4">Macronutrient Distribution</h3>
      <div className="flex items-center justify-center">
        <div className="relative h-40 w-40">
          {/* Simplified pie chart representation */}
          <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent border-t-emerald-500 border-r-emerald-500"
            style={{ transform: 'rotate(115deg)' }}
          ></div>
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent border-b-yellow-500 border-l-yellow-500"
            style={{ transform: 'rotate(30deg)' }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
          <span className="text-sm">Protein {macroData.protein}%</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-sm">Carbs {macroData.carbs}%</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-sm">Fat {macroData.fat}%</span>
        </div>
      </div>
    </div>
  );
};

export default MacronutrientChart;
