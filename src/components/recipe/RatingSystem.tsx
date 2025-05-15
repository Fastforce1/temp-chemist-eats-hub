
import React from 'react';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  userRating: number | null;
  onRating: (rating: number) => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ userRating, onRating }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Rate this Recipe</h2>
      <div className="flex items-center">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  userRating && star <= userRating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                } transition-colors hover:text-yellow-400`}
              />
            </button>
          ))}
        </div>
        <span className="ml-4 text-gray-600">
          {userRating ? `You rated this ${userRating} stars` : 'Click to rate'}
        </span>
      </div>
    </div>
  );
};

export default RatingSystem;
