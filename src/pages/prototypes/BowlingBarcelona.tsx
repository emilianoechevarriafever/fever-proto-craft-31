import { useState, useRef, useEffect } from "react";
import { Star, MapPin, Clock, Users, ChevronLeft, ChevronRight, Camera, Share, Heart, Play, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppBar from "@/components/AppBar";
import Calendar from "@/components/Calendar";
import DateSelector from "@/components/DateSelector";
import bowling1 from "@/assets/bowling1.jpg";
import bowling2 from "@/assets/bowling2.jpg";
import bowling3 from "@/assets/bowling3.jpeg";
import bowling4 from "@/assets/bowling4.jpg";
import users1 from "@/assets/users1.jpg";
import users2 from "@/assets/users2.jpg";
import users3 from "@/assets/users3.jpg";
import users4 from "@/assets/users4.jpg";

import feverLogoWhite from "@/assets/fever-logo-white.png";
import { useMixpanelAnalytics } from "@/hooks/use-mixpanel-analytics";
import { useNavigate } from "react-router-dom";

interface BowlingBarcelonaProps {
  calendarType?: 'big' | 'small';
}

const BowlingBarcelona = ({ calendarType = 'big' }: BowlingBarcelonaProps) => {
  const navigate = useNavigate();
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const { trackFunnelStep, trackConversionGoal, trackTimeOnPage } = useMixpanelAnalytics();
  const [isInBookingSection, setIsInBookingSection] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showAdultInfo, setShowAdultInfo] = useState(false);
  const [showChildInfo, setShowChildInfo] = useState(false);
  const [hasBestPriceDate, setHasBestPriceDate] = useState(false);
  const [canScrollTimeLeft, setCanScrollTimeLeft] = useState(false);
  const [canScrollTimeRight, setCanScrollTimeRight] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Get first available date (tomorrow)
  const getFirstAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Media carousel data
  const mediaItems = [
    { type: 'image', src: bowling1, alt: 'Bowling lanes with neon lighting' },
    { type: 'image', src: bowling2, alt: 'Modern bowling facility interior' },
    { type: 'image', src: bowling3, alt: 'Group of friends bowling' },
    { type: 'image', src: bowling4, alt: 'Premium bowling shoes and equipment' }
  ];

  const [booking, setBooking] = useState({
    adults: 2,
    kids: 0,
    selectedDate: getFirstAvailableDate(), // First available date
    timeSlot: "afternoon",
    specificTimeSlot: "15:00",
    gameType: "one",
    eventType: "bowling"
  });

  const timeSlotOptions = [
    { label: "Morning", value: "morning", subtitle: "10:00 – 15:00" },
    { label: "Afternoon", value: "afternoon", subtitle: "15:00 – 19:00" },
    { label: "Evening", value: "evening", subtitle: "19:00 – 23:00" }
  ];

  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const specificTimeSlots = {
    morning: generateTimeSlots(10, 15),    // 10:00 to 14:45
    afternoon: generateTimeSlots(15, 19),  // 15:00 to 18:45
    evening: generateTimeSlots(19, 23)     // 19:00 to 22:45
  };

  // Simulate realistic capacity for August 22, 2025 (Saturday evening birthday party scenario)
  // 25% of slots have capacity for 8+ people, 75% are more limited
  const getTimeSlotCapacity = (timeSlot: string, date: Date) => {
    // Only apply this logic for August 22, 2025
    if (date.getDate() === 22 && date.getMonth() === 7 && date.getFullYear() === 2025) {
      // Define which time slots can accommodate 8+ people (roughly 25%)
      const highCapacitySlots = [
        '15:00', '16:30', '18:15',           // Afternoon (3 slots) - moved one closer to end
        '19:00', '19:45',                    // Early evening (2 slots)
        '21:30', '22:00'                     // Late evening (2 slots)
      ];
      
      return highCapacitySlots.includes(timeSlot) ? 12 : 6; // 12 max or 6 max
    }
    
    // Default capacity for other dates
    return 12;
  };

  // Filter time slots based on current group size
  const getAvailableTimeSlots = (timeSlotType: string) => {
    const allSlots = specificTimeSlots[timeSlotType as keyof typeof specificTimeSlots] || [];
    const totalPeople = booking.adults + booking.kids;
    
    return allSlots.filter(slot => {
      const capacity = getTimeSlotCapacity(slot, booking.selectedDate);
      return totalPeople <= capacity;
    });
  };

  // Check if current time slot is still available when people count changes
  const handlePeopleCountChange = (newAdults: number, newKids: number) => {
    const newBooking = { ...booking, adults: newAdults, kids: newKids };
    const availableSlots = getAvailableTimeSlots(booking.timeSlot);
    
    // If current time slot is no longer available, select the first available one
    if (availableSlots.length > 0 && !availableSlots.includes(booking.specificTimeSlot)) {
      newBooking.specificTimeSlot = availableSlots[0];
    }
    
    setBooking(newBooking);
  };

  // Time slot scroll functions
  const scrollSpecificTimes = (direction: 'left' | 'right') => {
    const container = document.querySelector('.specific-times-container');
    if (container) {
      const scrollAmount = 150;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkTimeScrollPosition, 100);
    }
  };

  const checkTimeScrollPosition = () => {
    const container = document.querySelector('.specific-times-container');
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const tolerance = 2; // Reduced tolerance for more precise detection
      const maxScroll = scrollWidth - clientWidth;
      
      setCanScrollTimeLeft(scrollLeft > tolerance);
      setCanScrollTimeRight(scrollLeft < maxScroll - tolerance);
    }
  };

  const getTotalPrice = () => {
    // Calculate adults price
    let adultPrice;
    if (booking.gameType === 'birthday') {
      adultPrice = 35;
    } else if (booking.gameType === 'one') {
      adultPrice = 15;
    } else {
      adultPrice = 25;
    }
    
    // Calculate youth price
    let youthPrice;
    if (booking.gameType === 'birthday') {
      youthPrice = 25;
    } else if (booking.gameType === 'one') {
      youthPrice = 12;
    } else {
      youthPrice = 20;
    }
    
    // Apply best price discount (20% off)
    if (hasBestPriceDate) {
      adultPrice = Math.round(adultPrice * 0.8);
      youthPrice = Math.round(youthPrice * 0.8);
    }
    
    return (adultPrice * booking.adults) + (youthPrice * booking.kids);
  };

  const calculateDuration = (games: number) => {
    const totalPlayers = booking.adults + booking.kids;
    const playersPerLane = Math.min(totalPlayers, 5); // Max 5 players per lane
    
    // 15 minutes per person per game
    const totalMinutes = playersPerLane * 15 * games;
    
    return totalMinutes;
  };

  const handleFloatingButtonClick = () => {
    if (isInBookingSection) {
      // User is in booking section, complete the purchase
      const bookingData = {
        adults: booking.adults,
        kids: booking.kids,
        selectedDate: booking.selectedDate,
        timeSlot: booking.timeSlot,
        specificTimeSlot: booking.specificTimeSlot,
        gameType: booking.gameType,
        eventType: booking.eventType,
        totalPrice: getTotalPrice(),
        prototypeId: 'barcelona',
        venueName: 'Bowling Barcelona'
      };
      
      navigate('/confirmation', { state: { bookingData } });
    } else {
      // User is not in booking section, scroll to it
      // 📊 EVENTO 3: Booking Started - conversión crítica Barcelona!
      trackConversionGoal('booking_started', 'barcelona', 2, {
        adults: 2, // ejemplo
        children: 0,
        total_value: 24 // ejemplo pricing Barcelona
      });
      if (bookingSectionRef.current) {
        const element = bookingSectionRef.current;
        const offsetTop = element.offsetTop - 0; // Add 80px offset to show header properly
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
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
        title: 'Bowling Barcelona',
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

  // Detect when we're in the booking section + Analytics
  useEffect(() => {
    // 📊 EVENTO 1: Page View - inicio del funnel Barcelona
    trackFunnelStep('page_view', 'barcelona', 1);

    const handleScroll = () => {
      if (bookingSectionRef.current) {
        const rect = bookingSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= 100; // Consider visible when top is 100px from viewport top
        
        // 📊 EVENTO 2: Booking Section View - usuario llega al booking
        if (isVisible && !isInBookingSection) {
          trackFunnelStep('booking_section_view', 'barcelona', 2);
        }
        
        setIsInBookingSection(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // 📊 EVENTO 4: Time on Page - para medir engagement
    const handleBeforeUnload = () => {
      trackTimeOnPage('barcelona');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Setup time slot scroll listeners
  useEffect(() => {
    const checkAndSetupScrollListeners = () => {
      const timeContainer = document.querySelector('.specific-times-container');
      if (timeContainer) {
        checkTimeScrollPosition();
        timeContainer.addEventListener('scroll', checkTimeScrollPosition);
        
        // Add scrollend event if supported for more accurate detection
        if ('onscrollend' in timeContainer) {
          timeContainer.addEventListener('scrollend', checkTimeScrollPosition);
        }
      }

      return () => {
        if (timeContainer) {
          timeContainer.removeEventListener('scroll', checkTimeScrollPosition);
          if ('onscrollend' in timeContainer) {
            timeContainer.removeEventListener('scrollend', checkTimeScrollPosition);
          }
        }
      };
    };

    // Set up immediately
    const cleanup = checkAndSetupScrollListeners();
    
    // Also check after a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      checkTimeScrollPosition();
    }, 100);

    return () => {
      if (cleanup) cleanup();
      clearTimeout(timeoutId);
    };
  }, [booking.timeSlot]); // Re-run when timeSlot changes to reset scroll position

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
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">Bowling Barcelona - Waterfront</h1>
          
          {/* Selling Fast Tag */}
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            🔥 Tickets selling fast
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-bold text-gray-900">4.9</span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" style={{fill: '#df7b01', color: '#df7b01'}} />
              ))}
            </div>
            <span className="text-sm text-gray-600">(1,240)</span>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-700 leading-relaxed mb-6 space-y-3">
              <p>⭐ <strong>Bowling Barcelona Waterfront: The Ultimate Strike Experience!</strong> Step into Barcelona's most vibrant bowling venue where Mediterranean vibes meet precision strikes. Perfect for all ages and group types—friends, families, date nights, or co-workers. Are you ready to roll into adventure?</p>
              
              <p>🚨 <strong>Now open at Port Olímpic! Book now — lanes filling up quickly</strong> 🚨</p>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Highlights</p>
                <div className="space-y-1">
                  <div>⏱️ Up to 2 hours of bowling, stunning waterfront views, one adrenaline-fueled strike challenge</div>
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
              <div>🕒 <strong>Time:</strong> 10:00 AM – 24:00 PM</div>
              <div>⏳ <strong>Duration:</strong> Up to 2 hours of bowling fun. We recommend 60–90 minutes for the full experience including shoe fitting and lane setup.</div>
              <div>📍 <strong>Location:</strong> Port Olímpic, Barcelona Waterfront</div>
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
            <div className="text-3xl font-bold text-gray-900">4.9</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{fill: '#df7b01', color: '#df7b01'}} />
                ))}
                <Star className="w-4 h-4" style={{fill: '#df7b01', color: '#df7b01', clipPath: 'inset(0 10% 0 0)'}} />
                <span className="text-sm text-gray-600 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-600">based on 1,240 reviews</div>
            </div>
          </div>

          {/* Reviews Cards - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Review Card 1 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Carlos M.</div>
                  <div className="text-xs text-gray-500">Jun 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Amazing bowling experience in Barcelona! The atmosphere is electric and the lanes are top-notch. Perfect for groups!
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Laura R.</div>
                  <div className="text-xs text-gray-500">May 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Best bowling venue in Barcelona! Modern facilities, great music, and the staff is incredibly friendly. Highly recommended!
              </p>
            </div>

            {/* Review Card 3 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Miguel S.</div>
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
                Great waterfront location with amazing views. The bowling experience is fantastic and the atmosphere is unbeatable!
              </p>
            </div>

            {/* Review Card 4 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Sofia T.</div>
                  <div className="text-xs text-gray-500">Apr 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Perfect for date nights! The combination of bowling and sea views creates such a romantic and fun atmosphere.
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
            <img src={bowling4} alt="Bowling Barcelona venue" className="w-full h-32 object-cover" />
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-2">Bowling Barcelona</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Experience bowling like never before at Barcelona's premier waterfront entertainment destination. Our stunning location features 16 championship lanes with the latest technology, panoramic Mediterranean views, and an atmosphere that captures the vibrant spirit of Barcelona's coastal lifestyle.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Need help?</div>
                <div className="text-xs text-gray-600">Contact Support here</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section - Integrated in page */}
      <div ref={bookingSectionRef} className="bg-white py-12">
        <div className="max-w-2xl mx-auto px-5">


          {/* Header: Select Party Size */}
          <div className="border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">1. Select Party Size</h2>
          </div>
          
          {/* Ticket Selection */}
          <div className="space-y-4 mb-8">
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
                  <div style={{color: '#363f49'}}>
                    <div className="text-base font-medium leading-tight">From</div>
                    <div className="text-base font-bold leading-tight">
                      ${(() => {
                        let basePrice = 12; // Lowest youth price for 1 game
                        if (hasBestPriceDate) {
                          basePrice = Math.round(basePrice * 0.8);
                        }
                        return basePrice;
                      })()}.00
                    </div>
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
                      onClick={() => handlePeopleCountChange(Math.max(0, booking.adults - 1), booking.kids)}
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
                      onClick={() => handlePeopleCountChange(booking.adults + 1, booking.kids)}
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
                        <p><strong>Age requirement:</strong> 7-17 years old, or students with valid ID</p>
                        <p><strong>Includes:</strong> Lane access, shoe rental, automatic scoring</p>
                        <p><strong>Duration:</strong> Up to 2 hours of play</p>
                        <p><strong>Note:</strong> Children under 12 must be accompanied by an adult</p>
                      </div>
                    )}
                  </div>
                  <div style={{color: '#363f49'}}>
                    <div className="text-base font-medium leading-tight">From</div>
                    <div className="text-base font-bold leading-tight">
                      ${(() => {
                        let basePrice = 12; // Lowest youth price for 1 game
                        if (hasBestPriceDate) {
                          basePrice = Math.round(basePrice * 0.8);
                        }
                        return basePrice;
                      })()}.00
                    </div>
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
                      onClick={() => handlePeopleCountChange(booking.adults, Math.max(0, booking.kids - 1))}
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
                      onClick={() => handlePeopleCountChange(booking.adults, booking.kids + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Header: Select date and part of the day */}
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">2. Select date and part of the day</h2>
            </div>
            
            {/* Calendar */}
            <div className="space-y-3">
              {calendarType === 'big' ? (
                <Calendar
                  selectedDate={booking.selectedDate}
                  onDateSelect={(date, isBestPrice) => {
                    setBooking({ ...booking, selectedDate: date });
                    setHasBestPriceDate(isBestPrice || false);
                  }}
                />
              ) : (
                <DateSelector
                  selectedDate={booking.selectedDate}
                  onDateSelect={(date) => {
                    setBooking({ ...booking, selectedDate: date });
                    // Para small calendar, simular best price en algunos días
                    const isBestPrice = date.getDate() === 6 || date.getDate() === 13;
                    setHasBestPriceDate(isBestPrice);
                  }}
                />
              )}
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {timeSlotOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-3 text-center transition-all border rounded-lg ${
                      booking.timeSlot === option.value 
                        ? "fever-game-card-selected bg-accent border-primary" 
                        : "hover:bg-muted border-border"
                    }`}
                    onClick={() => setBooking({ ...booking, timeSlot: option.value })}
                  >
                    <div className="fever-body2 font-semibold">{option.label}</div>
                    <div className="fever-caption text-muted-foreground">{option.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Header: Choose your activity */}
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">3. Choose your activity</h2>
            </div>
            
            {/* Game Type Selection */}
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
                    <div className="fever-caption text-muted-foreground">approx. {calculateDuration(1)} min</div>
                  </div>
                  <div className="text-right">
                    <div className="fever-h2" style={{color: '#363f49'}}>
                      €{hasBestPriceDate ? Math.round(15 * 0.8) : 15} / €{hasBestPriceDate ? Math.round(12 * 0.8) : 12}
                    </div>
                    <div className="fever-caption text-muted-foreground">Adult / Youth</div>
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
                    <div className="fever-caption text-muted-foreground">approx. {calculateDuration(2)} min</div>
                  </div>
                  <div className="text-right">
                    <div className="fever-h2" style={{color: '#363f49'}}>
                      €{hasBestPriceDate ? Math.round(25 * 0.8) : 25} / €{hasBestPriceDate ? Math.round(20 * 0.8) : 20}
                    </div>
                    <div className="fever-caption text-muted-foreground">Adult / Youth</div>
                  </div>
                </label>

                {/* Birthday Party - Only show if 6 or more total people */}
                {(booking.adults + booking.kids) >= 6 && (
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
                      <div className="fever-body1 font-semibold">Birthday Party</div>
                      <div className="fever-caption text-muted-foreground">2 Games + Private Room</div>
                    </div>
                    <div className="text-right">
                      <div className="fever-h2" style={{color: '#363f49'}}>
                        €{hasBestPriceDate ? Math.round(35 * 0.8) : 35} / €{hasBestPriceDate ? Math.round(25 * 0.8) : 25}
                      </div>
                      <div className="fever-caption text-muted-foreground">Adult / Youth</div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Header: Select the entry time */}
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">4. Select the entry time</h2>
            </div>
            
            {/* Specific Time Selection */}
            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-1">
                {canScrollTimeLeft && (
                  <button 
                    className="p-1 hover:bg-muted rounded-full flex-shrink-0"
                    onClick={() => scrollSpecificTimes('left')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide specific-times-container">
                  {getAvailableTimeSlots(booking.timeSlot)?.map((time) => (
                    <button
                      key={time}
                      className={`flex-shrink-0 p-3 text-center transition-all min-w-[80px] border rounded-lg ${
                        booking.specificTimeSlot === time 
                          ? "fever-game-card-selected bg-accent border-primary" 
                          : "hover:bg-muted border-border"
                      }`}
                      onClick={() => setBooking({ ...booking, specificTimeSlot: time })}
                    >
                      <div className="fever-body1 font-semibold">{time}</div>
                    </button>
                  ))}
                </div>
                {canScrollTimeRight && (
                  <button 
                    className="p-1 hover:bg-muted rounded-full flex-shrink-0"
                    onClick={() => scrollSpecificTimes('right')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>



          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white">
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
        <Button
          onClick={handleFloatingButtonClick}
          className="w-full text-white h-12 text-base font-semibold transition-all duration-300"
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
                          {isInBookingSection ? `${getTotalPrice()},00€ - Get it` : 'Tickets'}
        </Button>
      </div>
      
      {/* Bottom padding for floating CTA */}
      <div className="h-24" />
    </div>
  );
};

export default BowlingBarcelona; 