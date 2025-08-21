import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CalendarCompactProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const CalendarCompact = ({ selectedDate, onDateSelect }: CalendarCompactProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const months = ["JUL", "AGO", "SEP"];
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(1);

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

  return (
    <div className="space-y-3">
      {/* Compact Month Selector */}
      <div className="flex gap-1">
        {months.map((month, index) => (
          <button
            key={month}
            className={`fever-pill-button text-xs px-2 py-1 flex-1 ${
              selectedMonthIndex === index
                ? "bg-neutral-900 text-white"
                : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setSelectedMonthIndex(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Compact Calendar Grid */}
      <div className="space-y-2">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {["D", "L", "M", "X", "J", "V", "S"].map((day) => (
            <div key={day} className="fever-caption text-center py-1 text-xs">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days - More compact */}
        <div className="grid grid-cols-7 gap-0.5">
          {getDaysInMonth().map((date, index) => (
            <div key={index} className="relative">
              {date ? (
                <button
                  className={`fever-calendar-cell w-full h-8 text-sm relative ${
                    isSelectedDate(date) ? "fever-calendar-selected" : "hover:bg-muted"
                  }`}
                  onClick={() => onDateSelect(date)}
                >
                  {date.getDate()}
                  
                  {/* Corner notch for selected dates */}
                  {isSelectedDate(date) && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary transform rotate-45 translate-x-1 -translate-y-1" />
                  )}
                  
                  {/* Price/availability indicators */}
                  {isBestPrice(date) && !isSelectedDate(date) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-purple rounded-full" />
                  )}
                  {isLowAvailability(date) && !isSelectedDate(date) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent-red rounded-full" />
                  )}
                </button>
              ) : (
                <div className="fever-calendar-cell h-8" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compact Legend */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-0.5 bg-accent-red" />
          <span className="fever-caption text-xs">Baja disponibilidad</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-0.5 bg-accent-purple" />
          <span className="fever-caption text-xs">El mejor precio</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarCompact; 