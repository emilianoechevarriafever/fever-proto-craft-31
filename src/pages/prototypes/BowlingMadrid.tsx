import { useState, useEffect, useRef } from "react";
import { Star, MapPin, Clock, Users, Camera, ChevronRight, Info, Phone, Globe, Share, Heart, Play, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppBar from "@/components/AppBar";
import StepperControl from "@/components/StepperControl";
import Calendar from "@/components/Calendar";
import DateSelector from "@/components/DateSelector";
import GameCard from "@/components/GameCard";
import { useNavigate } from "react-router-dom";
import { useMixpanelAnalytics } from "@/hooks/use-mixpanel-analytics";
import bowling1 from "@/assets/bowling1.jpg";
import bowling2 from "@/assets/bowling2.jpg";
import bowling3 from "@/assets/bowling3.jpeg";
import bowling4 from "@/assets/bowling4.jpg";
import users1 from "@/assets/users1.jpg";
import users2 from "@/assets/users2.jpg";
import users3 from "@/assets/users3.jpg";
import users4 from "@/assets/users4.jpg";

import feverLogoWhite from "@/assets/fever-logo-white.png";

interface BowlingMadridProps {
  calendarType?: 'big' | 'small';
}

const BowlingMadrid = ({ calendarType = 'big' }: BowlingMadridProps) => {
  const navigate = useNavigate();
  const { trackFunnelStep, trackConversionGoal, trackTimeOnPage } = useMixpanelAnalytics();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInBookingSection, setIsInBookingSection] = useState(false);
  const [hasStartedBooking, setHasStartedBooking] = useState(false);
  const [showAdultInfo, setShowAdultInfo] = useState(false);
  const [showChildInfo, setShowChildInfo] = useState(false);
  const [step, setStep] = useState(1);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  // Get first available date (tomorrow)
  const getFirstAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const [booking, setBooking] = useState({
    adults: 2,
    kids: 0,
    eventType: "", // Start empty, will be set based on party size
    selectedDate: getFirstAvailableDate(),
    timeSlot: "afternoon",
    specificTimeSlot: "16:00",
    gameType: "one"
  });

  // Media carousel data
  const mediaItems = [
    { type: 'image', src: bowling1, alt: 'Bowling lanes with neon lighting' },
    { type: 'image', src: bowling2, alt: 'Modern bowling facility interior' },
    { type: 'image', src: bowling3, alt: 'Group of friends bowling' },
    { type: 'image', src: bowling4, alt: 'Premium bowling shoes and equipment' }
  ];

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

  const getTotalPrice = () => {
    const gamePrice = booking.gameType === "one" ? 12 : 
                     booking.gameType === "two" ? 20 : 
                     booking.gameType === "birthday" ? 30 : 12;
    const totalPeople = booking.adults + booking.kids;
    return gamePrice * totalPeople;
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
        return { people: peopleText }; // Solo muestra personas (del step anterior)
      case 3:
        const dateText = booking.selectedDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        return { 
          people: peopleText,
          date: `${dateText} • ${booking.timeSlot}`
        };
      case 4:
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

  // Helper function to determine if step 2 should be shown
  // Helper function to get total number of steps
  const getTotalSteps = () => {
    return 4;
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return <Users className="w-4 h-4" />;
      case 2: return <CalendarIcon className="w-4 h-4" />;
      case 3: return <Star className="w-4 h-4" />;
      case 4: return <Clock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  // Helper function to get adjusted step number for display
  const getDisplayStep = () => {
    return step;
  };

  // Check if a step is completed (has been visited and has valid data)
  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return booking.adults > 0 || booking.kids > 0;
      case 2: return booking.selectedDate && booking.timeSlot !== "";
      case 3: return booking.gameType !== "";
      case 4: return booking.specificTimeSlot !== "";
      default: return false;
    }
  };

  // Check if a step is accessible (can be navigated to)
  const isStepAccessible = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    
    // Check if all previous steps are completed
    for (let i = 1; i < stepNumber; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  };



  // Navigate to a specific step
  const navigateToStep = (targetStep: number) => {
    if (isStepAccessible(targetStep)) {
      // Auto-fill intermediate steps with default values when jumping ahead
      if (targetStep > step) {
        const newBooking = { ...booking };
        
        // Fill step 1 if jumping from step 1
        if (step === 1 && targetStep > 1) {
          if (newBooking.adults === 0 && newBooking.kids === 0) {
            newBooking.adults = 2; // Default to 2 adults
          }
        }
        
        // Fill step 2 if jumping over it
        if (step <= 2 && targetStep > 2) {
          if (newBooking.timeSlot === "") {
            newBooking.timeSlot = "afternoon"; // Default time slot
          }
        }
        
        // Fill step 3 if jumping over it
        if (step <= 3 && targetStep > 3) {
          if (newBooking.gameType === "") {
            newBooking.gameType = "one"; // Default to 1 game
          }
        }
        
        setBooking(newBooking);
      }
      
      setStep(targetStep);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Select Party Size";
      case 2: return "Select date and part of the day";
      case 3: return "Choose your activity";
      case 4: return "Select the entry time";
      default: return "Booking";
    }
  };

  const handleFloatingButtonClick = () => {
    if (isInBookingSection) {
      if (step < getTotalSteps()) {
        setStep(step + 1);
        // Activate the booking started state when moving from step 1 to step 2
        if (step === 1) {
          // Add a small delay to make the transition smoother
          setTimeout(() => {
            setHasStartedBooking(true);
          }, 150);
        }
      } else {
        // Complete booking
        const bookingData = {
          adults: booking.adults,
          kids: booking.kids,
          eventType: booking.eventType,
          selectedDate: booking.selectedDate,
          timeSlot: booking.timeSlot,
          specificTimeSlot: booking.specificTimeSlot,
          gameType: booking.gameType,
          totalPrice: getTotalPrice(),
          prototypeId: 'madrid',
          venueName: 'Bowling Madrid - Gran Vía'
        };
        
        navigate('/confirmation', { state: { bookingData } });
      }
    } else {
      // User is not in booking section, scroll to it
      // 📊 EVENTO 3: Booking Started - conversión crítica Madrid!
      trackConversionGoal('booking_started', 'madrid', 2, {
        adults: 2, // ejemplo
        children: 0,
        total_value: 26 // ejemplo pricing Madrid
      });
      if (bookingSectionRef.current) {
        const element = bookingSectionRef.current;
        const offsetTop = element.offsetTop - 0; // Less offset = more scroll down
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Detect when we're past the stepper (in booking section) + Analytics
  useEffect(() => {
    // 📊 EVENTO 1: Page View - inicio del funnel Madrid
    trackFunnelStep('page_view', 'madrid', 1);

    const handleScroll = () => {
      if (bookingSectionRef.current) {
        const rect = bookingSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= 200; // Consider visible when top is 200px from viewport top (earlier detection)
        
        // 📊 EVENTO 2: Booking Section View - usuario llega al booking
        if (isVisible && !isInBookingSection) {
          trackFunnelStep('booking_section_view', 'madrid', 2);
        }
        
        setIsInBookingSection(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // 📊 EVENTO 4: Time on Page - para medir engagement
    const handleBeforeUnload = () => {
      trackTimeOnPage('madrid');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const startProgress = () => {
      if (progressRef.current) clearTimeout(progressRef.current);
      progressRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
      }, 4000); // 4 seconds per slide
    };

    startProgress();
    return () => {
      if (progressRef.current) clearTimeout(progressRef.current);
    };
  }, [currentSlide, mediaItems.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bowling Madrid Centro',
        text: 'Check out this amazing bowling experience!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      {/* Hero Carousel Section */}
      <div className="relative">
        <div className="relative h-80 overflow-hidden">
          {/* Media Carousel */}
          <div className="relative w-full h-full">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.type === 'video' ? (
                  <video
                    className="w-full h-full object-cover"
                    poster={item.poster}
                    muted
                    loop
                    playsInline
                    autoPlay={index === currentSlide}
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLike}
              className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bars - Bottom */}
          <div className="absolute bottom-8 left-4 right-4 flex gap-1">
            {mediaItems.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-100 ${
                    index === currentSlide ? 'animate-progress' : index < currentSlide ? 'w-full' : 'w-0'
                  }`}
                  style={{
                    animation: index === currentSlide ? 'progress 4s linear forwards' : 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-2xl -mt-4 relative shadow-[0_-0.5rem_1rem_rgba(6,35,44,0.24)] pt-4">
        {/* Title and Basic Info */}
        <div className="px-6 py-6">
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">Bowling Madrid - Gran Vía</h1>
          
          {/* Selling Fast Tag */}
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            🔥 Tickets selling fast
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-bold text-gray-900">4.8</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-600">(840)</span>
          </div>
          


          <div className="mb-6">
            <div className="text-sm text-gray-700 leading-relaxed mb-6 space-y-3">
              <p>⭐ <strong>Bowling Madrid Gran Vía: The Ultimate Strike Experience!</strong> Step into Madrid's most vibrant bowling venue where city lights meet precision strikes. Perfect for all ages and group types—friends, families, date nights, or co-workers. Are you ready to roll into adventure?</p>
              
              <p>🚨 <strong>Now open on Gran Vía! Book now — lanes filling up quickly</strong> 🚨</p>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Highlights</p>
                <div className="space-y-1">
                  <div>⏱️ Up to 2 hours of bowling, stunning city views, one adrenaline-fueled strike challenge</div>
                  <div>👥 Perfect for groups of 2 to 8—ideal for families, friends & co-workers</div>
                  <div>🏆 Compete with your team to achieve the highest score before time runs out</div>
                  <div>🥳 Perfect for any occasion! Birthday celebrations, team building & bachelor(ette) parties</div>
                  <div>🎳 State-of-the-art lanes with automatic scoring and premium shoe rentals included</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">General Info</h3>
              <div>📅 <strong>Dates:</strong> select your date directly in the ticket selector.</div>
              <div>🕒 <strong>Time:</strong> 12:00 PM – 22:00 PM</div>
              <div>⏳ <strong>Duration:</strong> Up to 2 hours of bowling fun. We recommend 60–90 minutes for the full experience including shoe fitting and lane setup.</div>
              <div>📍 <strong>Location:</strong> Calle Gran Vía 45, Madrid Centro</div>
              <div>👤 <strong>Age requirement:</strong> all ages are welcome!</div>
              <div>♿ <strong>Accessibility:</strong> the venue is fully accessible with ramps and accessible restrooms</div>
            </div>
          </div>
        </div>

        {/* User Photo Gallery */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">User Photo Gallery</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
              <img src={users1} alt="User photo" className="w-full h-full object-cover" />
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
              <img src={users2} alt="User photo" className="w-full h-full object-cover" />
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
              <img src={users3} alt="User photo" className="w-full h-full object-cover" />
            </div>
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
              <img src={users4} alt="User photo" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* User Reviews */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">User reviews</span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold text-gray-900">4.5</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" style={{clipPath: 'inset(0 50% 0 0)'}} />
                <span className="text-sm text-gray-600 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-600">based on 854 reviews</div>
            </div>
          </div>

          {/* Reviews Cards - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Review Card 1 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Janet M.</div>
                  <div className="text-xs text-gray-500">Jun 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Fantastic bowling experience in the heart of Madrid! The lanes are modern, staff is friendly, and the atmosphere is perfect for a fun night out. Highly recommended!
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Melissa N.</div>
                  <div className="text-xs text-gray-500">Jun 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Amazing bowling experience! The lanes are top-notch and the atmosphere is electric. Perfect for groups and date nights. Will definitely come back!
              </p>
            </div>

            {/* Review Card 3 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Carlos R.</div>
                  <div className="text-xs text-gray-500">May 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Great facilities and friendly staff. The automatic scoring system works perfectly. Had a blast with my friends celebrating a birthday!
              </p>
            </div>

            {/* Review Card 4 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Ana L.</div>
                  <div className="text-xs text-gray-500">May 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Best bowling alley in Madrid! The neon lights create such a cool vibe and the music selection is on point. Highly recommend for any occasion!
              </p>
            </div>
          </div>

          {/* View All Reviews Button */}
          <div className="mt-6">
            <button className="w-full bg-white border border-gray-300 rounded-full py-3 px-6 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
              View all reviews
            </button>
          </div>
        </div>

        {/* About the venue */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">About the venue</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg overflow-hidden mb-4">
            <img src={bowling4} alt="Bowling Madrid Centro venue" className="w-full h-32 object-cover" />
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-2">Bowling Madrid Centro</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Premium bowling experience in the heart of Madrid. Our modern facility features 12 state-of-the-art lanes with automatic scoring, premium sound system, and vibrant LED lighting. Perfect for all skill levels, from beginners to seasoned players.
          </p>
          

        </div>

        {/* Additional venue info */}
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-sm text-gray-900">Need help?</div>
              <div className="text-xs text-gray-600">Contact Support here</div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section - Stepper with Fixed Height */}
      <div ref={bookingSectionRef} className="bg-white relative">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
          </div>

          {/* Progress Stepper */}
          <div className="mb-6">
            <div className="flex items-center justify-center">
              {Array.from({ length: getTotalSteps() }, (_, index) => {
                const stepNumber = index + 1;
                
                const isActive = step === stepNumber;
                const isCompleted = isStepCompleted(stepNumber);
                const isAccessible = isStepAccessible(stepNumber);
                
                // Only show blue for current step and completed steps
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
                    
                    {/* Connector line - don't show after last step */}
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

          {/* Step Content Container - Fixed Height */}
          <div className="relative h-[70vh] mb-6 max-w-2xl mx-auto">
            <div className="absolute inset-0 fever-fade-in flex flex-col overflow-y-auto">
              {step === 1 && (
                <div className="flex flex-col justify-center space-y-4 pb-6 h-full">
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
                          €{booking.gameType === 'one' ? '15.00' : '25.00'}
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
                          €{booking.gameType === 'one' ? '12.00' : '20.00'}
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
              )}

              {step === 2 && (
                <div className="space-y-6 pb-6">
                  {/* Date selection */}
                  <div>
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

                  {/* Time period selection */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlotOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`p-3 text-center transition-all border rounded-lg ${
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
                          <div className="fever-body2 font-semibold">{option.label}</div>
                          <div className="fever-caption text-muted-foreground">{option.subtitle}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <div className="space-y-3">
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
                          <div className="fever-body1 font-semibold">1 Game</div>
                          <div className="fever-caption text-muted-foreground">approx. 20 min</div>
                        </div>
                        <div className="text-right">
                          <div className="fever-h2" style={{color: '#363f49'}}>12€</div>
                          <div className="fever-caption text-muted-foreground">per person</div>
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
                          <div className="fever-body1 font-semibold">2 Games</div>
                          <div className="fever-caption text-muted-foreground">approx. 40 min</div>
                        </div>
                        <div className="text-right">
                          <div className="fever-h2" style={{color: '#363f49'}}>20€</div>
                          <div className="fever-caption text-muted-foreground">per person</div>
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
                            <div className="fever-body1 font-semibold">Birthday Package</div>
                            <div className="fever-caption text-muted-foreground">Two bowling games + one hour birthday room with finger food</div>
                          </div>
                          <div className="text-right">
                            <div className="fever-h2" style={{color: '#363f49'}}>30€</div>
                            <div className="fever-caption text-muted-foreground">per person</div>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 pb-6">
                  <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    <div className="grid grid-cols-2 gap-2 pb-2">
                      {getSpecificTimeSlots().map((time, index) => (
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
                          <div className="fever-body1 font-semibold">{time}</div>
                          <div className="fever-caption text-muted-foreground">
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
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-12">
          <div className="px-6 py-8">

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* About Fever */}
              <div>
                <h3 className="font-semibold text-white mb-4">About Fever</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>Press</li>
                  <li>We are hiring!</li>
                  <li>Gift Cards</li>
                  <li>Help Center</li>
                </ul>
              </div>

              {/* Partner with us */}
              <div>
                <h3 className="font-semibold text-white mb-4">Partner with us</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>Fever Zone</li>
                  <li>List your event</li>
                  <li>Corporate events & benefits</li>
                  <li>Affiliate Program</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Fever for Business */}
              <div>
                <h3 className="font-semibold text-white mb-4">Fever for Business</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>Private events & group tickets</li>
                  <li>Corporate benefits</li>
                  <li>Corporate gift cards & vouchers</li>
                </ul>
              </div>

              {/* Follow us */}
              <div>
                <h3 className="font-semibold text-white mb-4">Follow us</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>Facebook</li>
                  <li>X (Twitter)</li>
                  <li>Instagram</li>
                  <li>TikTok</li>
                  <li>LinkedIn</li>
                  <li>YouTube</li>
                </ul>
              </div>
            </div>



            {/* Bottom Links */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                <span>Terms of Use</span>
                <span>Privacy Policy</span>
                <span>Do Not Sell My Personal Information / Cookies</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={feverLogoWhite} alt="Fever" className="h-8 w-auto" />
                  <p className="text-xs text-gray-500">
                    Copyright © 2024 Fever Labs Inc. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      {/* Floating CTA Button - Full Width */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4">
        {hasStartedBooking ? (
          /* Airbnb Style CTA with Summary */
          <div className="bg-white shadow-lg border border-gray-200 px-6 py-4 transition-all duration-500 ease-in-out" style={{ borderRadius: '80px' }}>
            <div className="flex items-center justify-between w-full">
              {/* Summary Section - Left Side */}
              <div className="flex-1 mr-4 flex flex-col justify-center">
                <div className="space-y-1">
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
              
              {/* Button Section - Right Side */}
              <div className="flex-shrink-0" style={{ width: '40%' }}>
                <Button
                  onClick={handleFloatingButtonClick}
                  className="text-white font-semibold h-11 text-base transition-all duration-300 w-full"
                  style={{
                    backgroundColor: step === getTotalSteps() ? 'rgb(0, 121, 202)' : 'rgb(0, 121, 202)',
                    borderRadius: '6.25rem',
                    boxShadow: 'rgba(6, 35, 44, 0.24) 0px 0.25rem 0.25rem',
                    fontWeight: '600',
                    letterSpacing: '0.01em',
                    transition: 'background-color 80ms cubic-bezier(0, 0, 0, 0), transform 80ms cubic-bezier(0, 0, 0, 0)',
                    maxWidth: '32.875rem',
                    margin: '0px auto',
                    transform: 'scale(1)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#025a9e';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0.5rem 0.5rem rgba(6, 35, 44, 0.24)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(0, 121, 202)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'rgba(6, 35, 44, 0.24) 0px 0.25rem 0.25rem';
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
        ) : (
          /* Regular Full Width CTA */
          <Button
            onClick={handleFloatingButtonClick}
            className="w-full text-white h-12 text-base font-semibold transition-all duration-500 ease-in-out"
            style={{
              backgroundColor: '#0079ca',
              borderRadius: '6.25rem',
              boxShadow: '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)',
              fontWeight: '600',
              letterSpacing: '0.01em',
              transition: 'background-color 80ms cubic-bezier(0,0,0,0), transform 80ms cubic-bezier(0,0,0,0)',
              maxWidth: '32.875rem',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#025a9e';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0.5rem 0.5rem rgba(6, 35, 44, 0.24)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0079ca';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)';
            }}
          >
            {isInBookingSection ? (step === getTotalSteps() ? `${getTotalPrice()}€ - Get it` : 'Continue') : 'Tickets'}
          </Button>
        )}
      </div>
      
      {/* Bottom padding for floating CTA */}
      <div className="h-24" />
      </div>
    );
  };

export default BowlingMadrid; 