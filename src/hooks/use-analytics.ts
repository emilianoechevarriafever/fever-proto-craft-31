import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '@/lib/posthog';

interface AnalyticsEvent {
  event: string;
  prototypeId?: string;
  timestamp: number;
  path: string;
  userAgent: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    // PostHog will be initialized in the PostHogProvider
    console.log('Analytics initialized with PostHog');
    this.isInitialized = true;
  }

  track(event: string, prototypeId?: string, additionalProperties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      prototypeId,
      timestamp: Date.now(),
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    this.events.push(analyticsEvent);
    
    // Send to PostHog with enhanced properties
    if (typeof window !== 'undefined' && posthog.__loaded) {
      const isLovablePreview = window.location.hostname.includes('lovable.app')
      const isLocalDev = window.location.hostname === 'localhost'
      
      const properties = {
        prototype_id: prototypeId,
        page_path: window.location.pathname,
        timestamp: analyticsEvent.timestamp,
        user_agent: navigator.userAgent,
        deployment_environment: isLovablePreview ? 'lovable_preview' : isLocalDev ? 'local_dev' : 'production',
        domain: window.location.hostname,
        ...additionalProperties
      };
      
      posthog.capture(event, properties);
      console.log('PostHog Event:', event, properties);
    } else {
      console.log('PostHog not loaded, event stored locally:', analyticsEvent);
    }
  }

  // Track page views with PostHog
  trackPageView(prototypeId?: string) {
    this.track('page_view', prototypeId);
    
    // Also capture pageview in PostHog with environment info
    if (typeof window !== 'undefined' && posthog.__loaded) {
      const isLovablePreview = window.location.hostname.includes('lovable.app')
      const isLocalDev = window.location.hostname === 'localhost'
      
      posthog.capture('$pageview', {
        prototype_id: prototypeId,
        $current_url: window.location.href,
        deployment_environment: isLovablePreview ? 'lovable_preview' : isLocalDev ? 'local_dev' : 'production',
        domain: window.location.hostname
      });
    }
  }

  // Identify user (for when you have user data)
  identify(userId: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.identify(userId, properties);
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>) {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.setPersonProperties(properties);
    }
  }

  getEvents() {
    return this.events;
  }

  getPrototypeEvents(prototypeId: string) {
    return this.events.filter(event => event.prototypeId === prototypeId);
  }

  getPrototypeStats(prototypeId: string) {
    const events = this.getPrototypeEvents(prototypeId);
    const pageViews = events.filter(e => e.event === 'page_view').length;
    const bookings = events.filter(e => e.event === 'booking_started').length;
    const completions = events.filter(e => e.event === 'booking_completed').length;
    
    return {
      prototypeId,
      pageViews,
      bookings,
      completions,
      conversionRate: pageViews > 0 ? (bookings / pageViews) * 100 : 0,
      completionRate: bookings > 0 ? (completions / bookings) * 100 : 0,
    };
  }
}

// Instancia global de analíticas
export const analytics = new Analytics();

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar analíticas
    analytics.init();
  }, []);

  useEffect(() => {
    // Trackear cambios de página
    const path = location.pathname;
    const prototypeId = path.startsWith('/prototype/') 
      ? path.split('/')[2] 
      : undefined;
    
    analytics.trackPageView(prototypeId);
  }, [location]);

  const trackEvent = (event: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track(event, prototypeId, additionalProperties);
  };

  const trackBookingStarted = (prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('booking_started', prototypeId, {
      category: 'booking',
      action: 'started',
      ...additionalProperties
    });
  };

  const trackBookingCompleted = (prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('booking_completed', prototypeId, {
      category: 'booking',
      action: 'completed',
      ...additionalProperties
    });
  };

  const trackPrototypeSelected = (prototypeId: string, additionalProperties?: Record<string, any>) => {
    analytics.track('prototype_selected', prototypeId, {
      category: 'prototype',
      action: 'selected',
      ...additionalProperties
    });
  };

  // Enhanced tracking methods for different user interactions
  const trackButtonClick = (buttonName: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('button_click', prototypeId, {
      category: 'engagement',
      action: 'click',
      button_name: buttonName,
      ...additionalProperties
    });
  };

  const trackMediaInteraction = (mediaType: 'video' | 'image', action: 'play' | 'pause' | 'view', prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('media_interaction', prototypeId, {
      category: 'media',
      action,
      media_type: mediaType,
      ...additionalProperties
    });
  };

  const trackUserEngagement = (engagementType: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('user_engagement', prototypeId, {
      category: 'engagement',
      engagement_type: engagementType,
      ...additionalProperties
    });
  };

  const trackBookingStepProgression = (step: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('booking_step_progression', prototypeId, {
      category: 'booking',
      action: 'step_progression',
      step,
      ...additionalProperties
    });
  };

  const trackTicketSelection = (ticketType: string, quantity: number, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('ticket_selection', prototypeId, {
      category: 'booking',
      action: 'ticket_selection',
      ticket_type: ticketType,
      quantity,
      ...additionalProperties
    });
  };

  const trackDateSelection = (selectedDate: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('date_selection', prototypeId, {
      category: 'booking',
      action: 'date_selection',
      selected_date: selectedDate,
      ...additionalProperties
    });
  };

  const trackTimeSelection = (selectedTime: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    analytics.track('time_selection', prototypeId, {
      category: 'booking',
      action: 'time_selection',
      selected_time: selectedTime,
      ...additionalProperties
    });
  };

  // Identify user (for when you have user data)
  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    analytics.identify(userId, properties);
  };

  // Set user properties
  const setUserProperties = (properties: Record<string, any>) => {
    analytics.setUserProperties(properties);
  };

  return {
    trackEvent,
    trackBookingStarted,
    trackBookingCompleted,
    trackPrototypeSelected,
    trackButtonClick,
    trackMediaInteraction,
    trackUserEngagement,
    trackBookingStepProgression,
    trackTicketSelection,
    trackDateSelection,
    trackTimeSelection,
    identifyUser,
    setUserProperties,
    getStats: analytics.getPrototypeStats.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
  };
}; 