import React from 'react';
import { Plus, Check } from 'lucide-react';
import type { Supplement } from '../../types';

interface SupplementCardProps {
  supplement: Supplement;
  isRecommended?: boolean;
  isTaken?: boolean;
  onAdd?: (supplement: Supplement) => void;
  onMarkTaken?: (supplement: Supplement) => void;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  isRecommended = false,
  isTaken = false,
  onAdd,
  onMarkTaken
}) => {
  const {
    name,
    brand,
    description,
    benefits,
    dosage,
    price,
    image
  } = supplement;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        {isRecommended && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            Recommended
          </div>
        )}
        <img
          src={image || '/placeholder-supplement.jpg'}
          alt={name}
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{brand}</p>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700">Benefits:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {benefits.map(benefit => (
              <span
                key={benefit}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Dosage:</span> {dosage}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          {!isTaken ? (
            <button
              onClick={() => onMarkTaken?.(supplement)}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark as Taken
            </button>
          ) : (
            <button
              disabled
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Taken Today
            </button>
          )}
          <button
            onClick={() => onAdd?.(supplement)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplementCard; 