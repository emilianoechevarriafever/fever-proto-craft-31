import { useState } from "react";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Initialize with current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  // Generate months starting from current month
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 6; i++) { // Show 6 months
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthName = monthDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      const year = monthDate.getFullYear().toString().slice(-2);
      months.push({
        label: `${monthName} ${year}`,
        date: monthDate
      });
    }
    return months;
  };
  
  const months = generateMonths();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0); // Start with current month

  // Update currentMonth when selectedMonthIndex changes
  const handleMonthSelect = (index: number) => {
    setSelectedMonthIndex(index);
    setCurrentMonth(months[index].date);
  };

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
    // Mock: Every 7th day is "best price"
    return date.getDate() % 7 === 0;
  };

  const isLowAvailability = (date: Date | null) => {
    if (!date) return false;
    // Mock: Every 5th day has low availability
    return date.getDate() % 5 === 0;
  };

  const getDayName = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  return (
    <div className="space-y-3">
      {/* Month Selector with Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {months.map((month, index) => (
            <button
              key={month.label}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedMonthIndex === index
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleMonthSelect(index)}
            >
              {month.label}
            </button>
          ))}
        </div>
        {/* Gradient overlay for scroll indication */}
        <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Horizontal Date Scroll */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {getDaysInMonth().map((date, index) => {
            if (!date) return null;
            return (
              <button
                key={index}
                className={`p-2 text-center transition-all flex-shrink-0 min-w-[60px] border rounded-lg ${
                  isSelectedDate(date) 
                    ? "border-2" 
                    : "hover:bg-muted border-border"
                }`}
                style={isSelectedDate(date) 
                  ? { backgroundColor: '#0279ca20', borderColor: '#0279ca' }
                  : {}
                }
                onClick={() => onDateSelect(date)}
              >
                <div className="fever-caption text-muted-foreground">
                  {getDayName(date)}
                </div>
                <div className="fever-body1 font-semibold">
                  {date.getDate()}
                </div>
                
                {/* Price/availability indicators */}
                {isBestPrice(date) && !isSelectedDate(date) && (
                  <div className="w-1 h-1 bg-accent-purple rounded-full mx-auto mt-1" />
                )}
                {isLowAvailability(date) && !isSelectedDate(date) && (
                  <div className="w-1 h-1 bg-accent-red rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
        {/* Gradient overlays for blur effect */}
        <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none" />
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

export default DateSelector; 