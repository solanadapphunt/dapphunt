import { useState } from "react";

interface LeaderboardCalendarProps {
  onDateSelect: (dateInfo: { year: number; month?: number; week?: number }) => void;
}

const LeaderboardCalendar = ({ onDateSelect }: LeaderboardCalendarProps) => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const generateCalendarDays = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysInPrevMonth = getDaysInMonth(month - 1, year);
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isNext: false
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isNext: false
      });
    }
    
    // Next month's leading days
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isNext: true
      });
    }
    
    return days;
  };

  const renderMonth = (month: number, year: number) => {
    const days = generateCalendarDays(month, year);
    
    return (
      <div key={`${year}-${month}`} className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {months[month - 1]}
        </h3>
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayInfo, index) => (
            <button
              key={index}
              onClick={() => {
                if (dayInfo.isCurrentMonth) {
                  onDateSelect({ year, month, week: Math.ceil(dayInfo.day / 7) });
                }
              }}
              className={`
                p-2 text-sm rounded hover:bg-gray-100 transition-colors
                ${dayInfo.isCurrentMonth 
                  ? 'text-gray-900 font-medium hover:bg-[#EC729C] hover:text-white' 
                  : 'text-gray-300'
                }
                ${!dayInfo.isCurrentMonth ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={!dayInfo.isCurrentMonth}
            >
              {dayInfo.day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Year selector */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={() => setSelectedYear(selectedYear - 1)}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          ← {selectedYear - 1}
        </button>
        <h1 className="text-3xl font-bold text-[#EC729C]">{selectedYear}</h1>
        <button
          onClick={() => setSelectedYear(selectedYear + 1)}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          {selectedYear + 1} →
        </button>
      </div>

      {/* Current year calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i + 1, selectedYear))}
      </div>

      {/* Previous year section */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedYear - 1}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => renderMonth(i + 1, selectedYear - 1))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCalendar; 