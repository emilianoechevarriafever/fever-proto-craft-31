import { useState } from "react";
import BottomSheet from "./BottomSheet";
import Calendar from "./Calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingState {
  adults: number;
  kids: number;
  selectedDate: Date | null;
  timeSlot: string;
  gameType: string;
}

interface BookingWizardJaenProps {
  isOpen: boolean;
  onClose: () => void;
  prototypeId: string;
  venueName: string;
}

const BookingWizardJaen = ({ isOpen, onClose, prototypeId, venueName }: BookingWizardJaenProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<BookingState>({
    adults: 2,
    kids: 0,
    selectedDate: null,
    timeSlot: "afternoon",
    gameType: "one"
  });

  const timeSlotOptions = [
    { label: "Morning", value: "morning", subtitle: "10:00 – 14:00" },
    { label: "Afternoon", value: "afternoon", subtitle: "14:00 – 18:00" },
    { label: "Evening", value: "evening", subtitle: "18:00 – 22:00" }
  ];

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Quick booking";
      case 2: return "Confirm booking";
      default: return "Booking";
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1: return booking.adults > 0 && booking.selectedDate !== null;
      default: return true;
    }
  };

  const getTotalPrice = () => {
    const gamePrice = booking.gameType === "one" ? 10 : 18;
    const totalPeople = booking.adults + booking.kids;
    return gamePrice * totalPeople;
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete booking and navigate to confirmation
      const bookingData = {
        adults: booking.adults,
        kids: booking.kids,
        selectedDate: booking.selectedDate!,
        timeSlot: booking.timeSlot,
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
          <div className="flex flex-col space-y-6 pb-6">
            {/* Quick Selection */}
            <div className="space-y-4">
              <h3 className="fever-body1 font-semibold">How many people?</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    className={`fever-card p-4 text-center transition-all ${
                      booking.adults === num 
                        ? "fever-game-card-selected bg-accent" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setBooking({ ...booking, adults: num, kids: 0 })}
                  >
                    <div className="text-2xl mb-1">👥</div>
                    <div className="fever-body2 font-semibold">{num}</div>
                    <div className="fever-caption">person{num !== 1 ? 's' : ''}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <h3 className="fever-body1 font-semibold">When do you want to play?</h3>
              <Calendar
                selectedDate={booking.selectedDate}
                onDateSelect={(date) => setBooking({ ...booking, selectedDate: date })}
              />
            </div>

            {/* Time Slot */}
            <div className="space-y-4">
              <h3 className="fever-body1 font-semibold">What time?</h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlotOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`fever-card p-3 text-center transition-all ${
                      booking.timeSlot === option.value 
                        ? "fever-game-card-selected bg-accent" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setBooking({ ...booking, timeSlot: option.value })}
                  >
                    <div className="fever-body2 font-semibold">{option.label}</div>
                    <div className="fever-caption text-muted-foreground">{option.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Game Type */}
            <div className="space-y-4">
              <h3 className="fever-body1 font-semibold">How many games?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`fever-card p-4 text-center transition-all ${
                    booking.gameType === "one" 
                      ? "fever-game-card-selected bg-accent" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setBooking({ ...booking, gameType: "one" })}
                >
                  <div className="text-2xl mb-2">🎳</div>
                  <div className="fever-body1 font-semibold">1 Game</div>
                  <div className="fever-caption">20 min</div>
                  <div className="fever-h2 text-primary mt-2">10€</div>
                </button>
                <button
                  className={`fever-card p-4 text-center transition-all ${
                    booking.gameType === "two" 
                      ? "fever-game-card-selected bg-accent" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setBooking({ ...booking, gameType: "two" })}
                >
                  <div className="text-2xl mb-2">🎳🎳</div>
                  <div className="fever-body1 font-semibold">2 Games</div>
                  <div className="fever-caption">40 min</div>
                  <div className="fever-h2 text-primary mt-2">18€</div>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col justify-center pb-6">
            <div className="fever-card p-6 space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎳</div>
                <h3 className="fever-h2 mb-2">Booking confirmed!</h3>
                <p className="fever-body2 text-muted-foreground">
                  Your lane is ready for you
                </p>
              </div>
              
              <div className="space-y-4">
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
                      {timeSlotOptions.find(t => t.value === booking.timeSlot)?.label}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="fever-body1 font-semibold">
                      {booking.adults} person{booking.adults !== 1 ? 's' : ''}
                    </div>
                    <div className="fever-body2">
                      {booking.gameType === "one" ? "1 Game" : "2 Games"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
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
          {[1, 2].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full transition-colors ${
                stepNumber <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="fever-fade-in flex-1 flex flex-col overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-6 flex-shrink-0">
        {step > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1 h-14">
          Back
        </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canProceedToNext()}
          className={`bg-primary hover:bg-primary-300 text-white fever-pill-button h-14 ${
            step === 1 ? "w-full" : "flex-1"
          }`}
        >
          {step === 2 ? "Perfect!" : "Continue"}
        </Button>
      </div>
    </BottomSheet>
  );
};

export default BookingWizardJaen; 