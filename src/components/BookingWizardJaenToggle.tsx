import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import DateSelector from "./DateSelector";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingState {
  adults: number;
  kids: number;
  selectedDate: Date | null;
  timeSlot: string;
  gameType: string;
  specificTimeSlot: string;
}

interface BookingWizardJaenToggleProps {
  calendarType?: 'big' | 'small';
  prototypeId: string;
  venueName: string;
  isInBookingSection: boolean;
}

const BookingWizardJaenToggle = ({ calendarType = 'big', prototypeId, venueName, isInBookingSection }: BookingWizardJaenToggleProps) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingState>({
    adults: 2,
    kids: 0,
    selectedDate: null,
    timeSlot: "afternoon",
    gameType: "",
    specificTimeSlot: ""
  });

  // State for "More info" toggles
  const [showAdultInfo, setShowAdultInfo] = useState(false);
  const [showChildInfo, setShowChildInfo] = useState(false);

  // Progressive toggle system - which section is currently expanded
  const [expandedSection, setExpandedSection] = useState<string | null>('people');
  const [currentStep, setCurrentStep] = useState<number>(1);

  const timeSlotOptions = [
    { label: "Morning", value: "morning", subtitle: "10:00 – 14:00" },
    { label: "Afternoon", value: "afternoon", subtitle: "14:00 – 18:00" },
    { label: "Evening", value: "evening", subtitle: "18:00 – 22:00" }
  ];

  const specificTimeSlots = {
    morning: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"],
    afternoon: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
    evening: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]
  };

  const getTotalPrice = () => {
    const gamePrice = booking.gameType === "one" ? 10 : 
                     booking.gameType === "two" ? 18 :
                     booking.gameType === "birthday" ? 25 : 0;
    const totalPeople = booking.adults + booking.kids;
    return gamePrice * totalPeople;
  };

  const isStepCompleted = (section: string) => {
    switch (section) {
      case 'people': return booking.adults > 0 || booking.kids > 0;
      case 'datetime': return booking.selectedDate !== null && booking.timeSlot !== '';
      case 'duration': return booking.gameType !== '';
      case 'time': return booking.gameType === "birthday" || booking.specificTimeSlot !== '';
      default: return false;
    }
  };

  const getSectionOrder = () => ['people', 'datetime', 'duration', 'time'];

  const getNextSection = (currentSection: string) => {
    const sections = getSectionOrder();
    const currentIndex = sections.indexOf(currentSection);
    return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
  };

  // Get first available date (tomorrow)
  const getFirstAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const applyDefaultValues = (targetSection: string) => {
    const sections = getSectionOrder();
    const targetIndex = sections.indexOf(targetSection);
    
    // Apply defaults for all previous sections AND target section if they're not completed
    const updates: Partial<BookingState> = {};
    
    for (let i = 0; i <= targetIndex; i++) {
      const section = sections[i];
      if (!isStepCompleted(section)) {
        switch (section) {
          case 'people':
            // Keep current adults/kids values (already have defaults)
            break;
          case 'datetime':
            if (!booking.selectedDate) {
              updates.selectedDate = getFirstAvailableDate();
            }
            // timeSlot already has default "afternoon"
            break;
          case 'duration':
            if (!booking.gameType) {
              updates.gameType = "one";
            }
            break;
          case 'time':
            if (!booking.specificTimeSlot) {
              updates.specificTimeSlot = "16:00";
            }
            break;
        }
      }
    }
    
    if (Object.keys(updates).length > 0) {
      setBooking(prev => ({ ...prev, ...updates }));
    }
  };

  const getActivityOptions = () => {
    const totalKids = booking.kids;
    const options = [
      { value: "one", label: "1 Game", duration: "~20 minutes", price: 10, emoji: "🎳" },
      { value: "two", label: "2 Games", duration: "~40 minutes", price: 18, emoji: "🎳🎳" }
    ];
    
    // Add birthday party option if 8 or more kids
    if (totalKids >= 8) {
      options.push({
        value: "birthday", 
        label: "Birthday Package", 
        duration: "Two bowling games + one hour birthday room with finger food", 
        price: 25, 
        emoji: "🎉"
      });
    }
    
    return options;
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'people': return "1. Select Party Size";
      case 'datetime': return "2. Select date and part of the day";
      case 'duration': return "3. Choose your activity";
      case 'time': return "4. Select the entry time";
      default: return "";
    }
  };

  const getCTALabel = () => {
    if (!expandedSection) return "Continue";
    
    if (expandedSection === 'people') {
      return isStepCompleted('people') ? "Select date" : "Continue";
    }
    if (expandedSection === 'datetime') {
      return isStepCompleted('datetime') ? "Select activity" : "Continue";
    }
    if (expandedSection === 'duration') {
      return isStepCompleted('duration') ? "Select hour" : "Continue";
    }
    if (expandedSection === 'time') {
      return isStepCompleted('time') ? `${getTotalPrice()}€ - Buy now` : "Continue";
    }
    
    return "Continue";
  };

  const scrollToSection = (sectionName: string) => {
    setTimeout(() => {
      const element = document.querySelector(`[data-section="${sectionName}"]`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300); // Wait for expand animation
  };

  const getBookingSummary = () => {
    const summary = [];
    
    // People
    if (isStepCompleted('people')) {
      const totalPeople = booking.adults + booking.kids;
      summary.push(`${totalPeople} person${totalPeople !== 1 ? 's' : ''}`);
    }
    
    // Date & Time
    if (isStepCompleted('datetime')) {
      const dateStr = booking.selectedDate?.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
      const timeOption = timeSlotOptions.find(t => t.value === booking.timeSlot);
      summary.push(`${dateStr}, ${timeOption?.label}`);
    }
    
    // Activity
    if (isStepCompleted('duration')) {
      const activity = getActivityOptions().find(a => a.value === booking.gameType);
      summary.push(activity?.label || "");
    }
    
    // Specific time
    if (isStepCompleted('time')) {
      summary.push(booking.specificTimeSlot);
    }
    
    return summary;
  };

  const handleCTAClick = () => {
    if (!expandedSection) {
      // If no section is expanded, start with first section
      setExpandedSection('people');
      scrollToSection('people');
      return;
    }

    // If current section is completed, move to next section
    if (isStepCompleted(expandedSection)) {
      const nextSection = getNextSection(expandedSection);
      if (nextSection) {
        // Apply default values for the next section
        applyDefaultValues(nextSection);
        // Close current section and open next one
        setExpandedSection(nextSection);
        scrollToSection(nextSection);
      } else {
        // All sections completed - go to checkout
        handleComplete();
      }
    }
    // If current section not completed, do nothing (user needs to complete it)
  };

  const isAllCompleted = () => {
    return isStepCompleted('people') && isStepCompleted('datetime') && isStepCompleted('duration') && isStepCompleted('time');
  };

  const handleComplete = () => {
    const bookingData = {
      adults: booking.adults,
      kids: booking.kids,
      selectedDate: booking.selectedDate!,
      timeSlot: booking.timeSlot,
      specificTimeSlot: booking.specificTimeSlot,
      gameType: booking.gameType,
      totalPrice: getTotalPrice(),
      prototypeId,
      venueName
    };
    
    navigate('/confirmation', { state: { bookingData } });
  };

  // Handle floating button click when in booking section
  useEffect(() => {
    const handleFloatingClick = (event: CustomEvent) => {
      if (isInBookingSection) {
        handleCTAClick();
      }
    };

    window.addEventListener('floatingButtonClick', handleFloatingClick as EventListener);
    return () => window.removeEventListener('floatingButtonClick', handleFloatingClick as EventListener);
  }, [isInBookingSection, expandedSection, booking]);

  // Notify parent about booking updates
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('bookingUpdate', {
      detail: {
        isCompleted: isAllCompleted(),
        totalPrice: getTotalPrice()
      }
    }));
  }, [booking, expandedSection]);



  const getSectionSummary = (section: string) => {
    switch (section) {
      case 'people':
        const totalPeople = booking.adults + booking.kids;
        if (totalPeople === 0) return "Select people";
        return `${totalPeople} person${totalPeople !== 1 ? 's' : ''}`;
      case 'datetime':
        if (!booking.selectedDate) return "Select date & time";
        const dateStr = booking.selectedDate.toLocaleDateString("en-US", { 
          weekday: "short", 
          month: "short", 
          day: "numeric" 
        });
        const timeOption = timeSlotOptions.find(t => t.value === booking.timeSlot);
        return `${dateStr}, ${timeOption?.label}`;
      case 'duration':
        const activity = getActivityOptions().find(a => a.value === booking.gameType);
        return activity?.label || "Select activity";
      case 'time':
        return booking.specificTimeSlot || "Select time";
      default:
        return "";
    }
  };

  const renderSection = (section: string, title: string, icon: React.ReactNode) => {
    const isCompleted = isStepCompleted(section);
    const isExpanded = expandedSection === section;
    
    return (
      <div 
        data-section={section}
        className="fever-card transition-all duration-300 ease-in-out"
        style={{ scrollMarginTop: '80px', backgroundColor: '#ffffff' }}
      >
        <button
          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-all duration-200 ease-in-out"
          onClick={() => {
            if (isExpanded) {
              setExpandedSection(null);
            } else {
              // Apply default values when manually opening a section
              applyDefaultValues(section);
              setExpandedSection(section);
              scrollToSection(section);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
              isExpanded ? 'text-white scale-110' : 
              isCompleted ? 'text-white scale-105' :
              'bg-muted text-muted-foreground scale-100'
            }`}
            style={
              isExpanded || isCompleted 
                ? { backgroundColor: '#0279ca' }
                : {}
            }>
              {icon}
            </div>
            <div className="text-left">
              <div className="fever-body1 transition-colors duration-300 ease-in-out">
                {title}
              </div>
              <div className="fever-caption text-muted-foreground transition-all duration-300 ease-in-out">
                {getSectionSummary(section)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ease-in-out ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`} />
          </div>
        </button>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`px-4 pb-4 border-t border-border/50 transition-all duration-300 ease-in-out ${
            isExpanded ? 'mt-4 pt-4 translate-y-0' : 'mt-0 pt-0 -translate-y-2'
          }`}>
            {renderSectionContent(section)}
          </div>
        </div>
      </div>
    );
  };

  const renderSectionContent = (section: string) => {
    switch (section) {
      case 'people':
        return (
          <div className="space-y-4">
            {/* Adults Ticket */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="relative flex">
                {/* Left side - Content */}
                <div className="flex-1 p-4">
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Adults (18+)</h3>
                    <button 
                      className="text-xs transition-colors"
                      style={{ color: '#0279ca' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#025a9c'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0279ca'}
                      onClick={() => setShowAdultInfo(!showAdultInfo)}
                    >
                      More info
                    </button>
                    {showAdultInfo && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-gray-700">
                        <p><strong>Age requirement:</strong> 18 years and older</p>
                        <p><strong>Includes:</strong> Lane access, shoe rental, automatic scoring</p>
                        <p><strong>Duration:</strong> Up to 2 hours of play</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-bold" style={{color: '#363f49'}}>
                    €{booking.gameType === 'one' ? '10.00' : booking.gameType === 'two' ? '18.00' : booking.gameType === 'birthday' ? '25.00' : '10.00'}
                  </div>
                </div>
                
                {/* Perforated edge effect */}
                <div className="w-px">
                  <div className="h-full border-l border-dashed border-gray-300"></div>
                </div>
                
                {/* Right side - Controls */}
                <div className="flex items-center justify-center p-4 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm"
                      onClick={() => setBooking({ ...booking, adults: Math.max(0, booking.adults - 1) })}
                      disabled={booking.adults === 0}
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[1.5rem] text-center">{booking.adults}</span>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors text-sm"
                      style={{ backgroundColor: '#0279ca' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025a9c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0279ca'}
                      onClick={() => setBooking({ ...booking, adults: booking.adults + 1 })}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Children Ticket */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="relative flex">
                {/* Left side - Content */}
                <div className="flex-1 p-4">
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Youths (7-17)</h3>
                    <button 
                      className="text-xs transition-colors"
                      style={{ color: '#0279ca' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#025a9c'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#0279ca'}
                      onClick={() => setShowChildInfo(!showChildInfo)}
                    >
                      More info
                    </button>
                    {showChildInfo && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-gray-700">
                        <p><strong>Age requirement:</strong> 7-17 years old</p>
                        <p><strong>Includes:</strong> Lane access, shoe rental, automatic scoring</p>
                        <p><strong>Duration:</strong> Up to 2 hours of play</p>
                        <p><strong>Note:</strong> Children under 12 must be accompanied by an adult</p>
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-bold" style={{color: '#363f49'}}>
                    €{booking.gameType === 'one' ? '8.00' : booking.gameType === 'two' ? '15.00' : booking.gameType === 'birthday' ? '20.00' : '8.00'}
                  </div>
                </div>
                
                {/* Perforated edge effect */}
                <div className="w-px">
                  <div className="h-full border-l border-dashed border-gray-300"></div>
                </div>
                
                {/* Right side - Controls */}
                <div className="flex items-center justify-center p-4 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm"
                      onClick={() => setBooking({ ...booking, kids: Math.max(0, booking.kids - 1) })}
                      disabled={booking.kids === 0}
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[1.5rem] text-center">{booking.kids}</span>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors text-sm"
                      style={{ backgroundColor: '#0279ca' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#025a9c'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0279ca'}
                      onClick={() => setBooking({ ...booking, kids: booking.kids + 1 })}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-4">
            <div className="fever-card p-3">
              {calendarType === 'big' ? (
                <Calendar
                  selectedDate={booking.selectedDate}
                  onDateSelect={(date, isBestPrice) => {
                    setBooking({ ...booking, selectedDate: date });
                  }}
                />
              ) : (
                <DateSelector
                  selectedDate={booking.selectedDate}
                  onDateSelect={(date) => setBooking({ ...booking, selectedDate: date })}
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {timeSlotOptions.map((option) => (
                <button
                  key={option.value}
                  className={`fever-card p-3 text-center transition-all ${
                    booking.timeSlot === option.value 
                      ? "border-2" 
                      : "hover:bg-muted border-border"
                  }`}
                  style={booking.timeSlot === option.value 
                    ? { backgroundColor: '#0279ca20', borderColor: '#0279ca' }
                    : {}
                  }
                  onClick={() => setBooking({ ...booking, timeSlot: option.value })}
                >
                  <div className="fever-body1 font-semibold text-sm">{option.label}</div>
                  <div className="fever-caption text-muted-foreground text-xs">{option.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'duration':
        return (
          <div className="space-y-3">
            {getActivityOptions().map((option) => (
              <label 
                key={option.value}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-all border rounded-lg border-border"
              >
                <input
                  type="radio"
                  name="gameType"
                  value={option.value}
                  checked={booking.gameType === option.value}
                  onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: '#0279ca' }}
                />
                <div className="flex-1">
                  <div className="fever-body1 font-semibold">{option.label}</div>
                  <div className="fever-caption text-muted-foreground">{option.duration}</div>
                </div>
                <div className="text-right">
                  <div className="fever-h2" style={{ color: '#363f49' }}>{option.price}€</div>
                  <div className="fever-caption text-muted-foreground">per person</div>
                </div>
              </label>
            ))}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-3">
            <div className="fever-caption text-muted-foreground">
              {booking.selectedDate?.toLocaleDateString("en-US", { 
                weekday: "long", 
                month: "long", 
                day: "numeric" 
              })} • {timeSlotOptions.find(t => t.value === booking.timeSlot)?.label}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {specificTimeSlots[booking.timeSlot as keyof typeof specificTimeSlots]?.map((time) => (
                <button
                  key={time}
                  className={`p-3 text-center transition-all border rounded-lg ${
                    booking.specificTimeSlot === time 
                      ? "border-2" 
                      : "hover:bg-muted border-border"
                  }`}
                  style={booking.specificTimeSlot === time 
                    ? { backgroundColor: '#0279ca20', borderColor: '#0279ca' }
                    : {}
                  }
                  onClick={() => setBooking({ ...booking, specificTimeSlot: time })}
                >
                  <div className="fever-body1 font-semibold text-sm">{time}</div>
                  <div className="fever-caption text-muted-foreground text-xs">
                    {booking.gameType === "one" ? "20 min" : 
                     booking.gameType === "two" ? "40 min" : "2 hours"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };



  return (
    <div className="bg-white">
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
        <div className="space-y-4">
          {/* People Section */}
          {renderSection('people', getSectionTitle('people'), <Users className="w-4 h-4" />)}
          
          {/* Date & Time Section */}
          {renderSection('datetime', getSectionTitle('datetime'), <CalendarIcon className="w-4 h-4" />)}
          
          {/* Duration Section */}
          {renderSection('duration', getSectionTitle('duration'), <Clock className="w-4 h-4" />)}

          {/* Time Slots Section */}
          {renderSection('time', getSectionTitle('time'), <Clock className="w-4 h-4" />)}
        </div>


      </div>
    </div>
  );
};

export default BookingWizardJaenToggle; 