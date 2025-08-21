import { useState } from "react";
import BottomSheet from "./BottomSheet";
import Calendar from "./Calendar";
import DateSelector from "./DateSelector";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, X, Users, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingState {
  adults: number;
  kids: number;
  eventType: string;
  selectedDate: Date;
  timeSlot: string;
  specificTimeSlot: string;
  gameType: string;
}

interface BookingWizardSegoviaProps {
  calendarType?: 'big' | 'small';
  isOpen: boolean;
  onClose: () => void;
  prototypeId: string;
  venueName: string;
  initialBooking?: {
    adults: number;
    kids: number;
  };
}

const BookingWizardSegovia = ({ calendarType = 'big', isOpen, onClose, prototypeId, venueName, initialBooking }: BookingWizardSegoviaProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showAdultInfo, setShowAdultInfo] = useState(false);
  const [showChildInfo, setShowChildInfo] = useState(false);
  
  // Get first available date (tomorrow)
  const getFirstAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  
  const [booking, setBooking] = useState<BookingState>({
    adults: initialBooking?.adults || 2,
    kids: initialBooking?.kids || 0,
    eventType: "", // Start empty, will be set based on party size
    selectedDate: getFirstAvailableDate(),
    timeSlot: "afternoon", // Default to afternoon
    specificTimeSlot: "16:00", // Default time slot
    gameType: "one" // Default to 1 game
  });

  const timeSlotOptions = [
    { label: "Morning", value: "morning", subtitle: "12:00 – 16:00" },
    { label: "Afternoon", value: "afternoon", subtitle: "16:00 – 19:00" },
    { label: "Evening", value: "evening", subtitle: "19:00 – 22:00" }
  ];

  const getSpecificTimeSlots = () => {
    const baseSlots = {
      morning: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
      afternoon: ["16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45"],
      evening: ["19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45"]
    };
    return baseSlots[booking.timeSlot as keyof typeof baseSlots] || [];
  };

  const getTotalSteps = () => {
    return 3;
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return <CalendarIcon className="w-4 h-4" />;
      case 2: return <Star className="w-4 h-4" />;
      case 3: return <Clock className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getDisplayStep = () => {
    return step;
  };

  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return booking.selectedDate && booking.timeSlot !== "";
      case 2: return booking.gameType !== "";
      case 3: return booking.specificTimeSlot !== "";
      default: return false;
    }
  };

  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    
    for (let i = 1; i < stepNumber; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  };

  const navigateToStep = (targetStep: number) => {
    if (isStepAccessible(targetStep)) {
      if (targetStep > step) {
        const newBooking = { ...booking };
        
        if (step <= 1 && targetStep > 1) {
          if (newBooking.timeSlot === "") {
            newBooking.timeSlot = "afternoon";
          }
        }
        
        if (step <= 2 && targetStep > 2) {
          if (newBooking.gameType === "") {
            newBooking.gameType = "one";
          }
        }
        
        if (step <= 3 && targetStep > 3) {
          if (newBooking.specificTimeSlot === "") {
            newBooking.specificTimeSlot = "16:00";
          }
        }
        
        setBooking(newBooking);
      }
      
      setStep(targetStep);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Select date and part of the day";
      case 2: return "Choose your activity";
      case 3: return "Select the entry time";
      default: return "Booking";
    }
  };

  const handleNext = () => {
    if (step < getTotalSteps()) {
        setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
        setStep(step - 1);
    }
  };

  const scrollToTimeSlots = () => {
    // Find the scrollable container and scroll to time slots
    setTimeout(() => {
      const scrollContainer = document.querySelector('[data-scrollable-container="true"]');
      if (scrollContainer) {
        // Scroll to show the time slot selection
        const timeSlotElement = scrollContainer.querySelector('[data-time-slots="true"]');
        if (timeSlotElement) {
          timeSlotElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    }, 100);
  };

  const handleComplete = () => {
    const totalPeople = booking.adults + booking.kids;
    const totalPrice = booking.gameType === "one" 
      ? (booking.adults * 15 + booking.kids * 12)
      : (booking.adults * 25 + booking.kids * 20);

    const bookingData = {
      adults: booking.adults,
      kids: booking.kids,
      selectedDate: booking.selectedDate,
      timeSlot: booking.timeSlot,
      specificTimeSlot: booking.specificTimeSlot,
      gameType: booking.gameType,
      eventType: booking.eventType,
          totalPrice,
      prototypeId,
      venueName
    };

    // Close the modal before navigating to ensure scroll is restored
    onClose();
    
    // Small delay to ensure modal cleanup is complete
    setTimeout(() => {
      navigate("/confirmation", { 
        state: { bookingData }
      });
    }, 100);
  };

  const canContinue = () => {
    switch (step) {
      case 1: return booking.selectedDate && booking.timeSlot !== "";
      case 2: return booking.gameType !== "";
      case 3: return booking.gameType === "birthday" || booking.specificTimeSlot !== "";
      default: return false;
    }
  };

        const getSummaryText = () => {
      const totalPeople = booking.adults + booking.kids;
      const peopleText = totalPeople === 1 ? '1 person' : `${totalPeople} people`;
      const gameText = booking.gameType === "one" ? "1 game" : 
                      booking.gameType === "two" ? "2 games" : 
                      booking.gameType === "birthday" ? "Birthday Package" : "1 game";
      
      switch (step) {
        case 1:
          return { people: peopleText };
        case 2:
          const dateText = booking.selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          return { 
            people: peopleText,
            date: `${dateText} • ${booking.timeSlot}`
          };
        case 3:
          const dateText2 = booking.selectedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          return { 
            people: `${peopleText} • ${gameText}`,
            date: `${dateText2} • ${booking.timeSlot}`
          };
        default:
          return { people: peopleText };
      }
    };

    const getTotalPrice = () => {
    const totalPeople = booking.adults + booking.kids;
    if (totalPeople === 0) return 0;

    if (booking.gameType === "one") {
      return (booking.adults * 15 + booking.kids * 12);
    } else if (booking.gameType === "two") {
      return (booking.adults * 25 + booking.kids * 20);
    } else if (booking.gameType === "birthday") {
      return (booking.adults * 35 + booking.kids * 30);
    } else {
      return (booking.adults * 15 + booking.kids * 12);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBooking({
      adults: initialBooking?.adults || 2,
      kids: initialBooking?.kids || 0,
      eventType: "",
      selectedDate: getFirstAvailableDate(),
      timeSlot: "afternoon", // Reset to default
      specificTimeSlot: "16:00", // Reset to default
      gameType: "one" // Reset to default
    });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 pb-3 relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Header */}
          <div className="text-center mb-3">
            <h2 className="text-base font-semibold text-gray-900">{getStepTitle()}</h2>
          </div>

          {/* Progress Stepper */}
          <div className="mb-3">
            <div className="flex items-center justify-center">
              {Array.from({ length: getTotalSteps() }, (_, index) => {
                const stepNumber = index + 1;
                
                const isActive = step === stepNumber;
                const isCompleted = isStepCompleted(stepNumber);
                const isAccessible = isStepAccessible(stepNumber);
                
                const shouldShowBlue = isActive || (isCompleted && stepNumber < step);
                
                return (
                  <div key={stepNumber} className="flex items-center">
                    <button
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                      } ${
                        shouldShowBlue
                          ? 'text-white shadow-sm'
                          : isAccessible
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                      style={
                        shouldShowBlue
                          ? { backgroundColor: '#0279ca' }
                          : {}
                      }
                      onClick={() => navigateToStep(stepNumber)}
                      disabled={!isAccessible}
                    >
                      {getStepIcon(stepNumber)}
                    </button>
                    
                    {stepNumber < getTotalSteps() && (
                      <div 
                        className="w-12 h-px mx-2 transition-colors duration-300"
                        style={{
                          backgroundColor: (isCompleted && stepNumber < step) ? '#0279ca' : '#e5e7eb'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 px-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }} data-scrollable-container="true">
          {step === 1 && (
            <div className="space-y-4 py-4">
              {/* Date and Time period selection - compact */}
              <div className="space-y-3">
                <div className="fever-card p-3">
                  {calendarType === 'big' ? (
                    <Calendar
                      selectedDate={booking.selectedDate}
                      onDateSelect={(date, isBestPrice) => {
                        setBooking({ ...booking, selectedDate: date });
                        scrollToTimeSlots();
                      }}
                    />
                  ) : (
                  <DateSelector
                    selectedDate={booking.selectedDate}
                      onDateSelect={(date) => {
                        setBooking({ ...booking, selectedDate: date });
                        scrollToTimeSlots();
                      }}
                  />
                  )}
                </div>
              </div>

              {/* Time period selection */}
              <div className="space-y-2" data-time-slots="true">
                <div className="grid grid-cols-3 gap-2">
                  {timeSlotOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`p-3 text-center transition-all border rounded-lg ${
                        booking.timeSlot === option.value 
                          ? "border-2" 
                          : "hover:bg-muted border-border"
                      }`}
                      style={{
                        borderColor: booking.timeSlot === option.value ? '#0279ca' : '#e5e7eb',
                        backgroundColor: booking.timeSlot === option.value ? '#f0f9ff' : 'white'
                      }}
                      onClick={() => setBooking({ ...booking, timeSlot: option.value })}
                    >
                      <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 py-4">
                <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-all border rounded-lg border-border">
                  <input
                    type="radio"
                    name="gameType"
                    value="one"
                    checked={booking.gameType === "one"}
                    onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="text-base font-semibold">1 Game</div>
                    <div className="text-xs text-muted-foreground">approx. 20 min</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{color: '#363f49'}}>12€</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-all border rounded-lg border-border">
                  <input
                    type="radio"
                    name="gameType"
                    value="two"
                    checked={booking.gameType === "two"}
                    onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <div className="text-base font-semibold">2 Games</div>
                    <div className="text-xs text-muted-foreground">approx. 40 min</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{color: '#363f49'}}>20€</div>
                    <div className="text-xs text-muted-foreground">per person</div>
                  </div>
                </label>

                {/* Birthday Package - Only show if 8 or more kids */}
                {booking.kids >= 8 && (
                  <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-all border rounded-lg border-border">
                    <input
                      type="radio"
                      name="gameType"
                      value="birthday"
                      checked={booking.gameType === "birthday"}
                      onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <div className="text-base font-semibold">Birthday Package</div>
                      <div className="text-xs text-muted-foreground">Two bowling games + one hour birthday room with finger food</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{color: '#363f49'}}>30€</div>
                      <div className="text-xs text-muted-foreground">per person</div>
                    </div>
                  </label>
                )}
            </div>
          )}

          {step === 3 && (
            <div className="py-4">
              <div 
                className="overflow-y-auto pr-1" 
                style={{ scrollbarWidth: 'thin' }}
                data-scrollable="true"
              >
                <div className="grid grid-cols-2 gap-2 pb-2">
                {getSpecificTimeSlots().map((time) => (
                  <button
                    key={time}
                    className={`p-3 text-center transition-all border rounded-lg flex-shrink-0 ${
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
                    <div className="text-base font-semibold">{time}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.gameType === "one" ? "20 min" : 
                       booking.gameType === "two" ? "40 min" : 
                       booking.gameType === "birthday" ? "120 min" : "20 min"}
                    </div>
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-4">
              <div 
                className="overflow-y-auto pr-1" 
                style={{ scrollbarWidth: 'thin' }}
                data-scrollable="true"
              >
                <div className="grid grid-cols-2 gap-2 pb-2">
                {getSpecificTimeSlots().map((time) => (
                  <button
                    key={time}
                    className={`p-3 text-center transition-all border rounded-lg flex-shrink-0 ${
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
                    <div className="text-base font-semibold">{time}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.gameType === "one" ? "20 min" : 
                       booking.gameType === "two" ? "40 min" : 
                       booking.gameType === "birthday" ? "120 min" : "20 min"}
                </div>
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Fixed CTA Button - Airbnb Style */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between w-full h-16">
            {/* Summary Section - Left Side */}
            {step >= 1 && (
              <div className="flex-1 mr-4 flex flex-col justify-center items-center">
                <div className="space-y-1 pl-4">
                  {(() => {
                    const summary = getSummaryText();
                    return (
                      <>
                        <div className="text-base font-semibold text-gray-900">
                          {summary.people}
                        </div>
                        {summary.date && (
                          <div className="text-sm font-medium text-gray-600">
                            {summary.date}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
            
            {/* Button Section - Right Side */}
            <div className="flex-shrink-0 pr-4" style={{ width: step >= 1 ? '45%' : '100%' }}>
          <Button
            onClick={handleNext}
            disabled={!canContinue()}
                  className="text-white font-semibold h-12 text-base transition-all duration-300 w-full"
            style={{
                    backgroundColor: canContinue() ? 'rgb(0, 121, 202)' : '#9ca3af',
              borderRadius: '6.25rem',
                    boxShadow: canContinue() ? 'rgba(6, 35, 44, 0.24) 0px 0.25rem 0.25rem' : '0 0.25rem 0.25rem rgba(156, 163, 175, 0.24)',
                    fontWeight: '600',
                    letterSpacing: '0.01em',
                    transition: 'background-color 80ms cubic-bezier(0, 0, 0, 0), transform 80ms cubic-bezier(0, 0, 0, 0)',
                    maxWidth: '32.875rem',
                    margin: '0px auto',
                    transform: 'scale(1)',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              if (canContinue()) {
                    e.currentTarget.style.backgroundColor = '#025a9e';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0.5rem 0.5rem rgba(6, 35, 44, 0.24)';
              }
            }}
            onMouseLeave={(e) => {
              if (canContinue()) {
                    e.currentTarget.style.backgroundColor = 'rgb(0, 121, 202)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'rgba(6, 35, 44, 0.24) 0px 0.25rem 0.25rem';
              }
            }}
          >
            {step === getTotalSteps() ? (
              <div className="font-semibold">
                    €{getTotalPrice()} - Get it
              </div>
            ) : (
              <div className="font-semibold">Continue</div>
            )}
          </Button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default BookingWizardSegovia;