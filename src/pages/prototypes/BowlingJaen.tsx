import { useState, useEffect, useRef } from "react";
import { Star, MapPin, Clock, Users, Camera, Share, Heart, Play, Info, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppBar from "@/components/AppBar";
import BookingWizardJaenToggle from "@/components/BookingWizardJaenToggle";
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

interface BowlingJaenProps {
  calendarType?: 'big' | 'small';
}

const BowlingJaen = ({ calendarType = 'big' }: BowlingJaenProps) => {
  const [isInBookingSection, setIsInBookingSection] = useState(false);
  const [isBookingCompleted, setIsBookingCompleted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(20);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { trackFunnelStep, trackConversionGoal, trackTimeOnPage } = useMixpanelAnalytics();
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Media carousel data
  const mediaItems = [
    { type: 'image', src: bowling1, alt: 'Bowling lanes with neon lighting' },
    { type: 'image', src: bowling2, alt: 'Modern bowling facility interior' },
    { type: 'image', src: bowling3, alt: 'Group of friends bowling' },
    { type: 'image', src: bowling4, alt: 'Premium bowling shoes and equipment' }
  ];

  const handleFloatingButtonClick = () => {
    if (!isInBookingSection) {
      // Scroll to booking section
      // 📊 EVENTO 3: Booking Started - conversión crítica Jaen!
      trackConversionGoal('booking_started', 'jaen', 2, {
        adults: 2, // ejemplo
        children: 0,
        total_value: 20 // ejemplo pricing Jaen
      });
      bookingSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Dispatch custom event for the booking component to handle
      window.dispatchEvent(new CustomEvent('floatingButtonClick'));
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
      }, 4000);
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
        title: 'Bowling Jaén',
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

  // Detect if user is in booking section + Analytics
  useEffect(() => {
    // 📊 EVENTO 1: Page View - inicio del funnel Jaen
    trackFunnelStep('page_view', 'jaen', 1);

    const handleScroll = () => {
      if (bookingSectionRef.current) {
        const rect = bookingSectionRef.current.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.5;
        
        // 📊 EVENTO 2: Booking Section View - usuario llega al booking
        if (isInView && !isInBookingSection) {
          trackFunnelStep('booking_section_view', 'jaen', 2);
        }
        
        setIsInBookingSection(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    // 📊 EVENTO 4: Time on Page - para medir engagement
    const handleBeforeUnload = () => {
      trackTimeOnPage('jaen');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Listen for booking updates
  useEffect(() => {
    const handleBookingUpdate = (event: CustomEvent) => {
      setIsBookingCompleted(event.detail.isCompleted);
      setTotalPrice(event.detail.totalPrice);
    };

    window.addEventListener('bookingUpdate', handleBookingUpdate as EventListener);
    return () => window.removeEventListener('bookingUpdate', handleBookingUpdate as EventListener);
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Bowling Jaén - Centro</h1>
          
          {/* Selling Fast Tag */}
          <div className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
            🔥 Tickets selling fast
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-bold text-gray-900">4.6</span>
            <div className="flex items-center gap-0.5">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" style={{fill: '#df7b01', color: '#df7b01'}} />
              ))}
              <Star className="w-3.5 h-3.5" style={{fill: '#df7b01', color: '#df7b01', clipPath: 'inset(0 40% 0 0)'}} />
            </div>
            <span className="text-sm text-gray-600">(423)</span>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-700 leading-relaxed mb-6 space-y-3">
              <p>⭐ <strong>Bowling Jaén Centro: The Ultimate Andalusian Strike Experience!</strong> Step into Jaén's most authentic bowling venue where Andalusian warmth meets precision strikes. Perfect for all ages and group types—friends, families, date nights, or co-workers. Are you ready to roll into adventure?</p>
              
              <p>🚨 <strong>Now open in Centro! Book now — lanes filling up quickly</strong> 🚨</p>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">Highlights</p>
                <div className="space-y-1">
                  <div>⏱️ Up to 2 hours of bowling, stunning city views, one adrenaline-fueled strike challenge</div>
                  <div>👥 Perfect for groups of 2 to 8—ideal for families, friends & co-workers</div>
                  <div>🏆 Compete with your team to achieve the highest score before time runs out</div>
                  <div>🥳 Perfect for any occasion! Birthday celebrations, team building & bachelor(ette) parties</div>
                  <div>🎳 Authentic Andalusian venue with modern lanes, automatic scoring and premium shoe rentals included</div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">General Info</h3>
              <div>📅 <strong>Dates:</strong> select your date directly in the ticket selector.</div>
              <div>🕒 <strong>Time:</strong> 12:00 PM – 22:00 PM</div>
              <div>⏳ <strong>Duration:</strong> Up to 2 hours of bowling fun. We recommend 60–90 minutes for the full experience including shoe fitting and lane setup.</div>
              <div>📍 <strong>Location:</strong> Calle Bernabé Soriano 15, Jaén Centro</div>
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
            <div className="text-3xl font-bold text-gray-900">4.6</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{fill: '#df7b01', color: '#df7b01'}} />
                ))}
                <Star className="w-4 h-4" style={{fill: '#df7b01', color: '#df7b01', clipPath: 'inset(0 40% 0 0)'}} />
                <span className="text-sm text-gray-600 ml-1">/5</span>
              </div>
              <div className="text-sm text-gray-600">based on 423 reviews</div>
            </div>
          </div>

          {/* Reviews Cards - Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Review Card 1 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Carmen L.</div>
                  <div className="text-xs text-gray-500">Jun 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                ¡Fantástico! A wonderful bowling experience in the heart of Jaén. Great for families and the Andalusian hospitality is exceptional!
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Antonio R.</div>
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
                Great bowling venue with modern facilities. Perfect location in Jaén centro and very friendly staff. Good value for money!
              </p>
            </div>

            {/* Review Card 3 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Isabel M.</div>
                  <div className="text-xs text-gray-500">Apr 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Perfect for a fun evening out! The authentic Andalusian atmosphere combined with modern bowling makes it truly special.
              </p>
            </div>

            {/* Review Card 4 */}
            <div className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">Francisco G.</div>
                  <div className="text-xs text-gray-500">Mar 2025</div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{fill: '#df7b01', color: '#df7b01'}} />
                  ))}
                  <Star className="w-3 h-3 text-gray-300" />
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Nice bowling alley in Jaén! Good equipment and reasonable prices. Great for groups and celebrations.
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
            <img src={bowling4} alt="Bowling Jaén venue" className="w-full h-32 object-cover" />
          </div>
          
          <h3 className="font-bold text-lg text-gray-900 mb-2">Bowling Jaén</h3>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            Discover authentic Andalusian hospitality at Jaén's premier bowling destination. Located in the heart of this historic olive oil capital, our venue combines traditional Spanish warmth with modern entertainment, featuring 10 well-maintained lanes with automatic scoring systems and a welcoming atmosphere that embodies the spirit of Jaén.
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

      {/* Booking Section */}
      <div ref={bookingSectionRef} className="bg-background">
        <BookingWizardJaenToggle 
          calendarType={calendarType}
          prototypeId="jaen"
          venueName="Bowling Jaén"
          isInBookingSection={isInBookingSection}
        />
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

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-30">
        <Button
          onClick={handleFloatingButtonClick}
          className="w-full text-white h-12 text-base font-semibold transition-all duration-300"
          style={{
            backgroundColor: '#0279ca',
            borderRadius: '6.25rem',
            boxShadow: '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)',
            fontWeight: '600',
            letterSpacing: '0.01em',
            transition: 'background-color 80ms cubic-bezier(0,0,0,0), transform 80ms cubic-bezier(0,0,0,0)',
            maxWidth: '32.875rem',
            margin: '0 auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#025a9c';
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0.5rem 0.5rem rgba(6, 35, 44, 0.24)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0279ca';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0.25rem 0.25rem rgba(6, 35, 44, 0.24)';
          }}
        >
          {isInBookingSection && isBookingCompleted ? `${totalPrice}€ - Buy now` : isInBookingSection ? 'Continue' : 'Tickets'}
        </Button>
      </div>
      
      {/* Bottom padding for floating CTA */}
      <div className="h-24" />
    </div>
  );
};

export default BowlingJaen; 