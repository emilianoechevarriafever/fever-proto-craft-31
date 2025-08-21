import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date, isBestPrice?: boolean) => void;
}

const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate all available months (flattened)
  const allMonths = [
    "AUG 25", "SEP 25", "OCT 25",
    "NOV 25", "DEC 25", "JAN 26", 
    "FEB 26", "MAR 26", "APR 26"
  ];
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isSelectedDate = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isBestPrice = (date: Date | null) => {
    if (!date) return false;
    // Mock: Days 5, 6, 7, 12, 13, 19, 20, 26, 27 are "best price"
    const day = date.getDate();
    return [5, 6, 7, 12, 13, 19, 20, 26, 27].includes(day);
  };

  const isLowAvailability = (date: Date | null) => {
    if (!date) return false;
    // Mock: Days 9, 23 have low availability
    const day = date.getDate();
    return [9, 23].includes(day);
  };

  const getPrice = (date: Date | null) => {
    if (!date) return null;
    const day = date.getDate();
    // Best price days get $40, low availability gets $44, others get $44
    if (isBestPrice(date)) return '$40';
    if (isLowAvailability(date)) return '$44';
    return '$44';
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonthIndex(monthIndex);
    // Calculate the actual month based on selected index
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + monthIndex);
    setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
  };

  return (
    <div className="space-y-4">
      {/* Month Selector with Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {allMonths.map((month, index) => (
            <button
              key={month}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedMonthIndex === index
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </button>
          ))}
        </div>
        {/* Gradient overlay for scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1">
          {["MON", "TU", "WED", "TH", "FRI", "SAT", "SU"].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((date, index) => (
            <div key={index} className="relative">
              {date ? (
                <button
                  className={`w-full h-10 p-2 relative transition-all border rounded-lg flex items-center justify-center ${
                    isSelectedDate(date) 
                      ? "bg-blue-50 border-blue-500" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => onDateSelect(date, isBestPrice(date))}
                >
                  <div className={`text-sm font-semibold ${
                    isSelectedDate(date) ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {date.getDate()}
                  </div>
                  
                  {/* Price/availability indicators - side by side */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {isBestPrice(date) && (
                      <div className="w-2 h-0.5 rounded-full" style={{backgroundColor: '#6f41d7'}} />
                    )}
                    {isLowAvailability(date) && (
                      <div className="w-2 h-0.5 bg-red-500 rounded-full" />
                    )}
                  </div>
                </button>
              ) : (
                <div className="w-full h-10" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-red-500 rounded-full" />
            <span className="text-xs text-red-500 font-medium">Low availability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{backgroundColor: '#6f41d7'}} />
            <span className="text-xs font-medium" style={{color: '#6f41d7'}}>Best price</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;