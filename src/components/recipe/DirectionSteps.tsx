
import React from 'react';

interface DirectionStepsProps {
  directions: string[];
}

const DirectionSteps: React.FC<DirectionStepsProps> = ({ directions }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Directions</h2>
      <ol className="space-y-4">
        {directions.map((step: string, index: number) => (
          <li key={index} className="flex">
            <span className="flex-shrink-0 flex items-center justify-center bg-emerald-500 text-white rounded-full w-6 h-6 mr-3 font-medium text-sm">
              {index + 1}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default DirectionSteps;
