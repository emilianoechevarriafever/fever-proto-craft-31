import { useState } from "react";
import BottomSheet from "./BottomSheet";
import StepperControl from "./StepperControl";
import DateSelector from "./DateSelector";
import SegmentedControl from "./SegmentedControl";
import GameCard from "./GameCard";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingState {
  adults: number;
  kids: number;
  eventType: string; // "bowling" | "birthday"
  selectedDate: Date | null;
  timeSlot: string;
  specificTimeSlot: string;
  gameType: string;
}

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  prototypeId: string;
  venueName: string;
}

const BookingWizard = ({ isOpen, onClose, prototypeId, venueName }: BookingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>({
    adults: 2,
    kids: 0,
    eventType: "bowling", // Por defecto bolera
    selectedDate: new Date(), // Por defecto hoy
    timeSlot: "afternoon",
    specificTimeSlot: "16:00", // Por defecto 16:00
    gameType: "one"
  });

  const timeSlotOptions = [
    { label: "Morning", value: "morning", subtitle: "12:00 – 16:00" },
    { label: "Afternoon", value: "afternoon", subtitle: "16:00 – 19:00" },
    { label: "Evening", value: "evening", subtitle: "19:00 – 22:00" }
  ];

  const getSpecificTimeSlots = () => {
    const baseSlots = {
      morning: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "15:45"],
      afternoon: ["16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45"],
      evening: ["19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45"]
    };
    return baseSlots[booking.timeSlot as keyof typeof baseSlots] || [];
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Who's playing?";
      case 2: return "Event type";
      case 3: return "Date & time";
      case 4: return "Duration";
      case 5: return "Exact time";
      case 6: return "Confirm booking";
      default: return "Booking";
    }
  };

  const getStepButtonText = () => {
    if (step === 6) {
      return `${getTotalPrice()}€ - Buy now`;
    }
    return "Continue";
  };

  const canProceedToNext = () => {
    // Siempre permitir continuar porque tenemos valores por defecto
    return true;
  };

  const getTotalPrice = () => {
    const gamePrice = booking.gameType === "one" ? 12 : 20;
    const totalPeople = booking.adults + booking.kids;
    return gamePrice * totalPeople;
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Complete booking and navigate to confirmation
      const bookingData = {
        adults: booking.adults,
        kids: booking.kids,
        eventType: booking.eventType,
        selectedDate: booking.selectedDate!,
        timeSlot: booking.timeSlot,
        specificTimeSlot: booking.specificTimeSlot,
        gameType: booking.gameType,
        totalPrice: getTotalPrice(),
        prototypeId,
        venueName
      };
      
      onClose();
      navigate('/confirmation', { state: { bookingData } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col justify-center space-y-4 pb-6">
            <StepperControl
              label="General admission (+13 years)"
              value={booking.adults}
              onChange={(value) => setBooking({ ...booking, adults: value })}
            />
            <div className="border-t border-dashed border-border" />
            <StepperControl
              label="Child admission (up to 12 years)"
              value={booking.kids}
              onChange={(value) => setBooking({ ...booking, kids: value })}
            />
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col justify-center space-y-6 pb-6">
            <div className="space-y-3">
              <h3 className="fever-body1 font-semibold">What type of event do you want to organize?</h3>
              <div className="space-y-3">
                <GameCard
                  title="Bowling"
                  subtitle="Traditional bowling game"
                  price=""
                  isSelected={booking.eventType === "bowling"}
                  onClick={() => setBooking({ ...booking, eventType: "bowling" })}
                />
                <GameCard
                  title="Birthday party"
                  subtitle="Celebration with resource booking"
                  price=""
                  isSelected={booking.eventType === "birthday"}
                  onClick={() => setBooking({ ...booking, eventType: "birthday" })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col justify-center space-y-4 pb-6">
            {/* Date and Time period selection - compact */}
            <div className="space-y-3">
              <h3 className="fever-body1 font-semibold">Date and period</h3>
              <div className="fever-card p-3">
                <DateSelector
                  selectedDate={booking.selectedDate}
                  onDateSelect={(date) => setBooking({ ...booking, selectedDate: date })}
                />
              </div>
            </div>

            {/* Time period selection */}
            <div className="space-y-2">
              <h3 className="fever-body1 font-semibold">Time of day</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlotOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`fever-card p-2 text-center transition-all ${
                      booking.timeSlot === option.value 
                        ? "fever-game-card-selected bg-accent" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setBooking({ ...booking, timeSlot: option.value })}
                  >
                    <div className="fever-body1 font-semibold text-sm">{option.label}</div>
                    <div className="fever-caption text-muted-foreground text-xs">{option.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col justify-center space-y-6 pb-6">
            <div className="space-y-3">
              <h3 className="fever-body1 font-semibold">Game duration</h3>
              <div className="space-y-3">
                <GameCard
                  title="1 Game"
                  subtitle="approx. 20 min"
                  price="12€"
                  isSelected={booking.gameType === "one"}
                  onClick={() => setBooking({ ...booking, gameType: "one" })}
                />
                <GameCard
                  title="2 Games"
                  subtitle="approx. 40 min"
                  price="20€"
                  isSelected={booking.gameType === "two"}
                  onClick={() => setBooking({ ...booking, gameType: "two" })}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col justify-center space-y-4 pb-6 flex-1">
            <div className="space-y-3 flex-1 flex flex-col">
              <h3 className="fever-body1 font-semibold">Available times</h3>
              <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
                {getSpecificTimeSlots().map((time, index) => (
                  <button
                    key={time}
                    className={`fever-card p-3 text-center transition-all ${
                      booking.specificTimeSlot === time 
                        ? "fever-game-card-selected bg-accent" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setBooking({ ...booking, specificTimeSlot: time })}
                  >
                    <div className="fever-body1 font-semibold">{time}</div>
                    <div className="fever-caption text-muted-foreground">
                      {booking.gameType === "one" ? "20 min" : "40 min"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col justify-center pb-6">
            <div className="fever-card p-4 space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <div>
                  <div className="fever-body1 font-semibold">
                    {booking.selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    })}
                  </div>
                  <div className="fever-body2">
                    {booking.specificTimeSlot} - {timeSlotOptions.find(t => t.value === booking.timeSlot)?.label}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="fever-body1">
                    {booking.adults + booking.kids} person{(booking.adults + booking.kids) !== 1 ? 's' : ''}
                  </span>
                  <span className="fever-body1 font-semibold">
                    {booking.gameType === "one" ? "1 Game" : "2 Games"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="fever-h2">Total</span>
                  <span className="fever-h2 text-primary">{getTotalPrice()}€</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={getStepTitle()}>
      {/* Progress Indicator */}
      <div className="flex justify-center mb-6 flex-shrink-0">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-2 h-2 rounded-full transition-colors ${
                stepNumber <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content - Takes available space */}
      <div className="fever-fade-in flex-1 flex flex-col overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="flex gap-3 pt-6 flex-shrink-0">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="w-12 h-14 p-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceedToNext()}
          className={`bg-primary hover:bg-primary-300 text-white fever-pill-button h-14 text-lg font-semibold ${
            step === 1 ? "w-full" : "flex-1"
          }`}
        >
          {getStepButtonText()}
        </Button>
      </div>
    </BottomSheet>
  );
};

export default BookingWizard;