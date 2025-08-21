import { useState, useEffect, useRef } from "react";
import { Star, MapPin, Clock, Users, Camera, Share, Heart, Play, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppBar from "@/components/AppBar";
import BookingWizardSegovia from "@/components/BookingWizardSegovia";
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

interface BowlingSegoviaProps {
  calendarType?: 'big' | 'small';
}

const BowlingSegovia = ({ calendarType = 'big' }: BowlingSegoviaProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInBookingSection, setIsInBookingSection] = useState(false);
  const [hasClickedTickets, setHasClickedTickets] = useState(false);
  const [showAdultInfo, setShowAdultInfo] = useState(false);
  const [showChildInfo, setShowChildInfo] = useState(false);
    const {
    trackFunnelStep,
    trackConversionGoal,
    trackTimeOnPage
  } = useMixpanelAnalytics();
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const bookingSectionRef = useRef<HTMLDivElement>(null);

  // Embedded ticket selector state
  const [booking, setBooking] = useState({
    adults: 2,
    kids: 0
  });

  // Media carousel data
  const mediaItems = [
    { type: 'image', src: bowling1, alt: 'Bowling lanes with neon lighting' },
    { type: 'image', src: bowling2, alt: 'Modern bowling facility interior' },
    { type: 'image', src: bowling3, alt: 'Group of friends bowling' },
    { type: 'image', src: bowling4, alt: 'Premium bowling shoes and equipment' }
  ];

  const handleBookingClick = () => {
    if (isInBookingSection) {
      // 📊 EVENTO 3: Booking Started - conversión crítica!
      trackConversionGoal('booking_started', 'segovia', booking.adults + booking.kids, {
        adults: booking.adults,
        children: booking.kids,
        total_value: (booking.adults * 12 + booking.kids * 8) // ejemplo pricing
      });
      
      setIsBookingOpen(true);
    } else {
      // Usuario hace scroll hacia booking - no trackeamos esto para ahorrar eventos
      setHasClickedTickets(true);
      if (bookingSectionRef.current) {
        const element = bookingSectionRef.current;
        const offsetTop = element.offsetTop - 350;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        setTimeout(() => {
          setIsInBookingSection(true);
        }, 500);
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
        setCurrentSlide((prev) => {
          const nextSlide = (prev + 1) % mediaItems.length;
          return nextSlide;
        });
      }, 4000);
    };

    startProgress();
    return () => {
      if (progressRef.current) clearTimeout(progressRef.current);
    };
  }, [currentSlide, mediaItems.length]);

  // Scroll detection for booking section
  useEffect(() => {
    // 📊 EVENTO 1: Page View - inicio del funnel
    trackFunnelStep('page_view', 'segovia', 1);

    const handleScroll = () => {
      if (bookingSectionRef.current && !hasClickedTickets) {
        const rect = bookingSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= 200 && rect.bottom >= 200;
        
        // 📊 EVENTO 2: Booking Section View - usuario llega al booking
        if (isVisible && !isInBookingSection) {
          trackFunnelStep('booking_section_view', 'segovia', 2);
        }
        
        setIsInBookingSection(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // 📊 EVENTO 4: Time on Page - para medir engagement
    const handleBeforeUnload = () => {
      trackTimeOnPage('segovia');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasClickedTickets]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const handleShare = () => {
    // Share functionality - no tracking para ahorrar eventos
    console.log('Share clicked');
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    // Solo like/unlike - no tracking para ahorrar eventos
  };

  const handleAdultChange = (increment: boolean) => {
    setBooking(prev => {
      const newAdults = increment ? prev.adults + 1 : Math.max(0, prev.adults - 1);
      // Sin tracking de cambios individuales para ahorrar eventos
      return {
        ...prev,
        adults: newAdults
      };
    });
  };

  const handleKidsChange = (increment: boolean) => {
    setBooking(prev => {
      const newKids = increment ? prev.kids + 1 : Math.max(0, prev.kids - 1);
      // Sin tracking de cambios individuales para ahorrar eventos
      return {
        ...prev,
        kids: newKids
      };
    });
  };

  const canContinue = () => {
    return booking.adults > 0 || booking.kids > 0;
  };

  const getCTALabel = () => {
    if (isInBookingSection) {
      return "Continue";
    }
    return "Tickets";
  };

  return (
    <div className="min-h-screen bg-white">
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
                    // Video sin tracking para ahorrar eventos
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
            <button 
              onClick={() => {
                // Camera click - sin tracking para ahorrar eventos
              }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Bowling Segovia - Centro Histórico</h1>
          
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
            <span className="text-sm text-gray-600">(2,847)</span>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-700 leading-relaxed mb-6 space-y-3">
              <p>⭐ <strong>Bowling Segovia Centro Histórico: The Ultimate Heritage Strike Experience!</strong> Step into Segovia's most charming bowling venue where UNESCO World Heritage meets precision strikes. Perfect for all ages and group types—friends, families, date nights, or co-workers. Are you ready to roll into history?</p>
              
              <p>🚨 <strong>Now open in Centro Histórico! Book now — lanes filling up quickly</strong> 🚨</p>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Highlights</p>
                <div className="space-y-1">
                  <div>⏱️ Up to 2 hours of bowling, stunning historic views, one adrenaline-fueled strike challenge</div>
                  <div>👥 Perfect for groups of 2 to 8—ideal for families, friends & co-workers</div>
                  <div>🏆 Compete with your team to achieve the highest score before time runs out</div>
                  <div>🥳 Perfect for any occasion! Birthday celebrations, team building & bachelor(ette) parties</div>
                  <div>🎳 Historic venue with modern lanes, automatic scoring and premium shoe rentals included</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">General Info</h3>
              <div>📅 <strong>Dates:</strong> select your date directly in the ticket selector.</div>
              <div>🕒 <strong>Time:</strong> 11:00 AM – 23:00 PM</div>
              <div>⏳ <strong>Duration:</strong> Up to 2 hours of bowling fun. We recommend 60–90 minutes for the full experience including shoe fitting and lane setup.</div>
              <div>📍 <strong>Location:</strong> Plaza Mayor 12, Segovia Centro</div>
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
                <Star className="w-4 h-4" style={{fill: '#df7b01', color: '#df7b01', clipPath: 'inset(0 5% 0 0)'}} />
                <span className="text-sm text-gray-600 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-600">based on 2,847 reviews</div>
            </div>
          </div>

          {/* Reviews Cards - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Review Card 1 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">María S.</div>
                  <div className="text-xs text-gray-500">Jun 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Amazing bowling experience in historic Segovia! The perfect combination of modern facilities and traditional charm. Great for families!
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Roberto L.</div>
                  <div className="text-xs text-gray-500">May 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Fantastic venue in the heart of Segovia! Premium lanes, great service, and the historic setting makes it truly special. Highly recommended!
              </p>
            </div>

            {/* Review Card 3 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Elena P.</div>
                  <div className="text-xs text-gray-500">Apr 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Great facilities and excellent location near the cathedral. Perfect activity after exploring the historic city center!
              </p>
            </div>

            {/* Review Card 4 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">David M.</div>
                  <div className="text-xs text-gray-500">Apr 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Unique bowling experience in a UNESCO World Heritage city! Modern equipment with historic charm - couldn't ask for more!
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
            <img src={bowling4} alt="Bowling Segovia venue" className="w-full h-32 object-cover" />
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-2">Bowling Segovia</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Experience bowling in the heart of UNESCO World Heritage city Segovia. Our historic venue combines traditional Spanish charm with modern entertainment technology, featuring 12 premium lanes with state-of-the-art scoring systems, all set within walking distance of the famous Alcázar and Roman Aqueduct.
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

      {/* Embedded Ticket Selector */}
      <div ref={bookingSectionRef} className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Select party size</span>
        </div>

        {/* Adults Ticket */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-4">
          <div className="relative flex">
            <div className="flex-1 p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Adults (18+)</h3>
                <button 
                  className="text-xs transition-colors"
                  style={{ color: '#0279ca' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#025a9c'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0279ca'}
                  onClick={() => {
                    const newState = !showAdultInfo;
                    setShowAdultInfo(newState);
                    // Info toggle - sin tracking para ahorrar eventos
                  }}
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
                €15.00
              </div>
            </div>
            <div className="w-px">
              <div className="h-full border-l border-dashed border-gray-300"></div>
            </div>
            <div className="flex items-center justify-center p-4 min-w-[120px]">
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm"
                  onClick={() => handleAdultChange(false)}
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
                  onClick={() => handleAdultChange(true)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Children Ticket */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-4">
          <div className="relative flex">
            <div className="flex-1 p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Youths (7-17)</h3>
                <button 
                  className="text-xs transition-colors"
                  style={{ color: '#0279ca' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#025a9c'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0279ca'}
                  onClick={() => {
                    const newState = !showChildInfo;
                    setShowChildInfo(newState);
                    // Info toggle - sin tracking para ahorrar eventos
                  }}
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
                €12.00
              </div>
            </div>
            <div className="w-px">
              <div className="h-full border-l border-dashed border-gray-300"></div>
            </div>
            <div className="flex items-center justify-center p-4 min-w-[120px]">
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm"
                  onClick={() => handleKidsChange(false)}
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
                  onClick={() => handleKidsChange(true)}
                >
                  +
                </button>
              </div>
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

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
        <Button
          onClick={handleBookingClick}
          disabled={!canContinue()}
          className="w-full text-white h-12 text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canContinue() ? '#0079ca' : '#cccccc',
            borderRadius: '6.25rem',
            boxShadow: '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)',
            fontWeight: '600',
            letterSpacing: '0.01em',
            transition: 'background-color 80ms cubic-bezier(0,0,0,0), transform 80ms cubic-bezier(0,0,0,0)',
            maxWidth: '32.875rem',
            margin: '0 auto'
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
              e.currentTarget.style.backgroundColor = '#0079ca';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)';
            }
          }}
        >
          {getCTALabel()}
        </Button>
      </div>

      {/* Booking Wizard */}
      <BookingWizardSegovia 
        calendarType={calendarType}
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)}
        prototypeId="segovia"
        venueName="Bowling Segovia"
        initialBooking={booking}
      />
      
      {/* Bottom padding for sticky CTA */}
      <div className="h-24" />
    </div>
  );
};

export default BowlingSegovia;