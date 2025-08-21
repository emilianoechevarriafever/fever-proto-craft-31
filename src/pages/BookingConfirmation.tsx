import { useState, useEffect } from "react";
import { CheckCircle, Calendar, Clock, Users, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useMixpanelAnalytics } from "@/hooks/use-mixpanel-analytics";

interface BookingData {
  adults: number;
  kids: number;
  selectedDate: Date;
  timeSlot: string;
  specificTimeSlot?: string;
  gameType: string;
  eventType?: string;
  totalPrice: number;
  prototypeId: string;
  venueName: string;
}

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackBookingCompleted } = useMixpanelAnalytics();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Get booking data from location state
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
      trackBookingCompleted(location.state.bookingData.prototypeId);
      
      // Show confirmation animation after a short delay
      setTimeout(() => {
        setShowConfirmation(true);
      }, 500);
    } else {
      // If no booking data, redirect to home
      navigate('/');
    }
  }, [location.state, navigate, trackBookingCompleted]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const getTimeSlotLabel = (timeSlot: string) => {
    const timeSlots = {
      morning: "Morning (12:00 - 16:00)",
      afternoon: "Afternoon (16:00 - 19:00)",
      evening: "Evening (19:00 - 22:00)"
    };
    return timeSlots[timeSlot as keyof typeof timeSlots] || timeSlot;
  };

  const getGameTypeLabel = (gameType: string) => {
    return gameType === "one" ? "1 Game" : "2 Games";
  };

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Confirmation</h1>
              <p className="text-gray-600">Your booking has been confirmed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className={`transition-all duration-1000 transform ${
            showConfirmation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}>
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking Confirmed!
            </h2>
            <p className="text-lg text-gray-600">
              Your booking has been processed successfully
            </p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h3>
          
          <div className="space-y-6">
            {/* Venue Info */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-gray-900">{bookingData.venueName}</div>
                <div className="text-sm text-gray-600">Location confirmed</div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-gray-900">
                  {bookingData.selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {getTimeSlotLabel(bookingData.timeSlot)}
                  {bookingData.specificTimeSlot && ` - ${bookingData.specificTimeSlot}`}
                </div>
              </div>
            </div>

            {/* People and Game Type */}
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-gray-900">
                  {bookingData.adults + bookingData.kids} person{(bookingData.adults + bookingData.kids) !== 1 ? 's' : ''}
                </div>
                <div className="text-sm text-gray-600">
                  {bookingData.adults > 0 && `${bookingData.adults} adult${bookingData.adults !== 1 ? 's' : ''}`}
                  {bookingData.kids > 0 && `${bookingData.adults > 0 ? ', ' : ''}${bookingData.kids} child${bookingData.kids !== 1 ? 'ren' : ''}`}
                </div>
              </div>
            </div>

            {/* Game Details */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-gray-900">
                  {getGameTypeLabel(bookingData.gameType)}
                </div>
                <div className="text-sm text-gray-600">
                  {bookingData.gameType === "one" ? "Approximately 20 minutes" : "Approximately 40 minutes"}
                </div>
              </div>
            </div>

            {/* Event Type if applicable */}
            {bookingData.eventType && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-primary flex items-center justify-center">
                  🎳
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {bookingData.eventType === "bowling" ? "Bowling" : "Birthday Party"}
                  </div>
                                      <div className="text-sm text-gray-600">Event type</div>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-primary">{bookingData.totalPrice},00€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
              <li>• You will receive a confirmation email in the next few minutes</li>
              <li>• Arrive 10 minutes before your reserved time</li>
              <li>• Don't forget to bring comfortable clothes to play</li>
              <li>• Bowling shoes are included</li>
            </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={handleContinueShopping}
            className="bg-primary hover:bg-primary-300 text-white fever-pill-button h-14 px-8 text-lg font-semibold"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 