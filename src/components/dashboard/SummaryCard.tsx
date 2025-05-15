import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    label: string;
  };
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  children?: React.ReactNode;
}

const SummaryCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  iconBgColor,
  iconColor,
  children 
}: SummaryCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`${iconBgColor} p-2 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      {trend ? (
        <div className="flex items-center">
          <span className={`${trend.direction === 'up' ? 'text-emerald-500' : 'text-orange-500'} flex items-center text-sm font-medium`}>
            {trend.direction === 'up' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>
            )}
            {trend.value}
          </span>
          <span className="text-gray-500 text-sm ml-2">{trend.label}</span>
        </div>
      ) : null}
      {children}
    </div>
  );
};

export default SummaryCard;
