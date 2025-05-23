import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface LaunchArchiveProps {
  currentYear: number;
  currentMonth: number;
  onDateSelect: (dateInfo: { year: number; month?: number }) => void;
}

const LaunchArchive = ({ currentYear, currentMonth, onDateSelect }: LaunchArchiveProps) => {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([currentYear]));

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const isCurrentMonth = (year: number, monthIndex: number) => {
    return year === currentYear && monthIndex + 1 === currentMonth;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Launch Archive</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {years.map((year) => (
          <div key={year}>
            {/* Year header */}
            <button
              onClick={() => toggleYear(year)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <span 
                className={`font-medium ${year === currentYear ? 'text-[#EC729C]' : 'text-gray-900'}`}
              >
                {year}
              </span>
              {expandedYears.has(year) ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {/* Months list */}
            {expandedYears.has(year) && (
              <div className="bg-gray-50">
                {months.map((month, index) => (
                  <button
                    key={`${year}-${index}`}
                    onClick={() => onDateSelect({ year, month: index + 1 })}
                    className={`
                      w-full text-left px-6 py-2 text-sm hover:bg-gray-100 transition-colors
                      ${isCurrentMonth(year, index) 
                        ? 'text-[#EC729C] font-medium bg-[#EC729C]/5' 
                        : 'text-gray-600'
                      }
                    `}
                  >
                    • {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaunchArchive; 