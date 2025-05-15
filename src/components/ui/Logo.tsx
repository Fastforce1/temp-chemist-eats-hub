import React from 'react';
import { FlaskRound as Flask } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  const iconSize = {
    small: 18,
    medium: 24,
    large: 32,
  };

  return (
    <div className="flex items-center">
      <Flask 
        size={iconSize[size]} 
        className="text-emerald-500 mr-2" 
        fill="rgba(74, 222, 128, 0.2)" 
        strokeWidth={2} 
      />
      <span className={`font-bold ${sizeClasses[size]} text-gray-900`}>
        Nutrition <span className="text-emerald-500">Chemist</span>
      </span>
    </div>
  );
};

export default Logo;