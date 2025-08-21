import { useState } from "react";
import BottomSheet from "./BottomSheet";
import Calendar from "./Calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";

interface BookingState {
  adults: number;
  kids: number;
  selectedDate: Date | null;
  timeSlot: string;
  specificTimeSlot: string;
  gameType: string;
  eventType: string;
}

interface BookingWizardBarcelonaProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingWizardBarcelona = ({ isOpen, onClose }: BookingWizardBarcelonaProps) => {
  const [booking, setBooking] = useState<BookingState>({
    adults: 2,
    kids: 0,
    selectedDate: null,
    timeSlot: "afternoon",
    specificTimeSlot: "13:00",
    gameType: "one",
    eventType: "bowling"
  });

  const timeSlotOptions = [
    { label: "Mediodía", value: "morning", subtitle: "12:00 – 16:00" },
    { label: "Tarde", value: "afternoon", subtitle: "16:00 – 19:00" },
    { label: "Noche", value: "evening", subtitle: "19:00 – 22:00" }
  ];

  const specificTimeSlots = {
    morning: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"],
    afternoon: ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30"],
    evening: ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"]
  };

  const getTotalPrice = () => {
    const gamePrice = booking.gameType === "one" ? 15 : 25;
    const totalPeople = booking.adults + booking.kids;
    return gamePrice * totalPeople;
  };

  const handleComplete = () => {
    // Complete booking
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Selecciona fecha y sesión">
      <div className="flex flex-col space-y-6 pb-6">
        {/* Ticket Selection */}
        <div className="space-y-3">
          <div className="fever-card p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="fever-body1 font-semibold">Entrada general (+13 años)</div>
                <div className="fever-caption text-muted-foreground">Acceso completo</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  onClick={() => setBooking({ ...booking, adults: Math.max(0, booking.adults - 1) })}
                >
                  -
                </button>
                <span className="fever-h2 min-w-[2rem] text-center">{booking.adults}</span>
                <button
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  onClick={() => setBooking({ ...booking, adults: booking.adults + 1 })}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dashed border-border" />
          
          <div className="fever-card p-4 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="fever-body1 font-semibold">Entrada infantil (hasta 12 años)</div>
                <div className="fever-caption text-muted-foreground">Acceso completo</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  onClick={() => setBooking({ ...booking, kids: Math.max(0, booking.kids - 1) })}
                >
                  -
                </button>
                <span className="fever-h2 min-w-[2rem] text-center">{booking.kids}</span>
                <button
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  onClick={() => setBooking({ ...booking, kids: booking.kids + 1 })}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Type Selection */}
        <div className="space-y-3">
          <h3 className="fever-body1 font-semibold">Tipo de evento</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`fever-card p-4 text-center relative transition-all ${
                booking.eventType === "bowling" 
                  ? "fever-game-card-selected bg-accent" 
                  : "hover:bg-muted"
              }`}
              onClick={() => setBooking({ ...booking, eventType: "bowling" })}
            >
              {booking.eventType === "bowling" && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              <div className="text-2xl mb-2">🎳</div>
              <div className="fever-body1 font-semibold">Bolera</div>
            </button>
            <button
              className={`fever-card p-4 text-center relative transition-all ${
                booking.eventType === "birthday" 
                  ? "fever-game-card-selected bg-accent" 
                  : "hover:bg-muted"
              }`}
              onClick={() => setBooking({ ...booking, eventType: "birthday" })}
            >
              {booking.eventType === "birthday" && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              <div className="text-2xl mb-2">🎉</div>
              <div className="fever-body1 font-semibold">Fiesta de Cumpleaños</div>
              <div className="fever-caption text-muted-foreground">mínimo 4 personas</div>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-3">
          <h3 className="fever-body1 font-semibold">Fecha</h3>
          <Calendar
            selectedDate={booking.selectedDate}
            onDateSelect={(date) => setBooking({ ...booking, selectedDate: date })}
          />
        </div>

        {/* Time Slot Selection */}
        <div className="space-y-3">
          <h3 className="fever-body1 font-semibold">Horario</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 flex gap-2">
              {timeSlotOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex-1 fever-card p-3 text-center transition-all ${
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
            <button className="p-2 hover:bg-muted rounded-full">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Type Selection */}
        <div className="space-y-3">
          <h3 className="fever-body1 font-semibold">Duración</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 fever-card p-4 cursor-pointer hover:bg-muted transition-all">
              <input
                type="radio"
                name="gameType"
                value="one"
                checked={booking.gameType === "one"}
                onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="fever-body1 font-semibold">1 Partida</div>
                <div className="fever-caption text-muted-foreground">aprox. 20 min</div>
              </div>
              <div className="fever-h2 text-primary">15,00€</div>
            </label>
            
            <label className="flex items-center gap-3 fever-card p-4 cursor-pointer hover:bg-muted transition-all">
              <input
                type="radio"
                name="gameType"
                value="two"
                checked={booking.gameType === "two"}
                onChange={(e) => setBooking({ ...booking, gameType: e.target.value })}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="fever-body1 font-semibold">2 Partidas</div>
                <div className="fever-caption text-muted-foreground">aprox. 40 min</div>
              </div>
              <div className="fever-h2 text-primary">25,00€</div>
            </label>
          </div>
        </div>

        {/* Specific Time Selection */}
        <div className="space-y-3">
          <h3 className="fever-body1 font-semibold">Hora exacta</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 flex gap-2 overflow-x-auto">
              {specificTimeSlots[booking.timeSlot as keyof typeof specificTimeSlots]?.map((time) => (
                <button
                  key={time}
                  className={`flex-shrink-0 fever-card p-3 text-center transition-all ${
                    booking.specificTimeSlot === time 
                      ? "fever-game-card-selected bg-accent" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setBooking({ ...booking, specificTimeSlot: time })}
                >
                  <div className="fever-body1 font-semibold">{time}</div>
                </button>
              ))}
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price Info */}
        <div className="fever-card p-4">
          <div className="text-center text-sm text-muted-foreground mb-2">
            Todos los precios se muestran en euros
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-red-500 rounded"></div>
              <span>Baja disponibilidad</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-blue-500 rounded"></div>
              <span>El mejor precio este mes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 flex-shrink-0">
        <Button
          onClick={handleComplete}
          disabled={booking.adults === 0 || !booking.selectedDate}
          className="w-full bg-primary hover:bg-primary-300 text-white fever-pill-button h-14 text-lg font-semibold"
        >
          {getTotalPrice()},00€ - Comprar ahora
        </Button>
      </div>
    </BottomSheet>
  );
};

export default BookingWizardBarcelona; 