
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekDateSelectorProps {
  weekDates: Date[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
}

const WeekDateSelector: React.FC<WeekDateSelectorProps> = ({
  weekDates,
  currentDate,
  setCurrentDate,
  goToPreviousWeek,
  goToNextWeek
}) => {
  // Function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Function to check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Function to format date as day of week and date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    const dayOfWeek = date.toLocaleDateString('en-US', options);
    const dayOfMonth = date.getDate();
    return { dayOfWeek, dayOfMonth };
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="flex justify-between">
        {weekDates.map((date, index) => {
          const { dayOfWeek, dayOfMonth } = formatDate(date);
          return (
            <button
              key={index}
              onClick={() => setCurrentDate(date)}
              className={`flex flex-col items-center justify-center w-12 h-16 rounded-lg transition-colors ${
                isToday(date)
                  ? 'bg-emerald-500 text-white'
                  : isSelectedDate(date)
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-xs font-medium">{dayOfWeek}</span>
              <span className="text-lg">{dayOfMonth}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default WeekDateSelector;
