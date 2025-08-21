import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mixpanel, waitForMixpanel, isMixpanelInitialized } from '@/lib/mixpanel';

interface AnalyticsEvent {
  event: string;
  prototypeId?: string;
  timestamp: number;
  path: string;
  userAgent: string;
}

class MixpanelAnalytics {
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;
  private sessionStartTime = Date.now();
  private pageStartTime = Date.now();
  private scrollDepth = 0;
  private maxScrollDepth = 0;
  private interactionCount = 0;

  init() {
    if (this.isInitialized) return;
    
    console.log('Analytics initialized with Mixpanel');
    this.isInitialized = true;
    this.sessionStartTime = Date.now();
    this.setupScrollTracking();
    this.setupVisibilityTracking();
  }

  async track(event: string, prototypeId?: string, additionalProperties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      prototypeId,
      timestamp: Date.now(),
      path: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    this.events.push(analyticsEvent);
    
    // Esperar a que Mixpanel esté listo antes de enviar eventos
    if (typeof window !== 'undefined') {
      try {
        await waitForMixpanel();
        
        if (isMixpanelInitialized()) {
          const isLovablePreview = window.location.hostname.includes('lovable.app')
          const isLocalDev = window.location.hostname === 'localhost'
          
          const properties = {
            prototype_id: prototypeId,
            page_path: window.location.pathname,
            timestamp: analyticsEvent.timestamp,
            user_agent: navigator.userAgent,
            deployment_environment: isLovablePreview ? 'lovable_preview' : isLocalDev ? 'local_dev' : 'production',
            domain: window.location.hostname,
            $current_url: window.location.href,
            ...additionalProperties
          };
          
          mixpanel.track(event, properties);
          console.log('Mixpanel Event:', event, properties);
        } else {
          console.log('Mixpanel not initialized, event stored locally:', analyticsEvent);
        }
      } catch (error) {
        console.error('Error tracking Mixpanel event:', error);
        console.log('Event stored locally:', analyticsEvent);
      }
    }
  }

  // Tracking de scroll y engagement
  private setupScrollTracking() {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      this.scrollDepth = scrollPercent;
      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;
        
        // Track milestone de scroll
        if (scrollPercent >= 25 && scrollPercent < 50) {
          this.track('scroll_milestone', undefined, { milestone: '25%', scroll_depth: scrollPercent });
        } else if (scrollPercent >= 50 && scrollPercent < 75) {
          this.track('scroll_milestone', undefined, { milestone: '50%', scroll_depth: scrollPercent });
        } else if (scrollPercent >= 75 && scrollPercent < 90) {
          this.track('scroll_milestone', undefined, { milestone: '75%', scroll_depth: scrollPercent });
        } else if (scrollPercent >= 90) {
          this.track('scroll_milestone', undefined, { milestone: '90%', scroll_depth: scrollPercent });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Tracking de visibilidad de página
  private setupVisibilityTracking() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Date.now() - this.pageStartTime;
        this.track('page_hidden', undefined, { 
          time_on_page: timeOnPage,
          max_scroll_depth: this.maxScrollDepth,
          interactions: this.interactionCount 
        });
      } else if (document.visibilityState === 'visible') {
        this.pageStartTime = Date.now();
        this.track('page_visible', undefined, { timestamp: Date.now() });
      }
    });
  }

  // Trackear page views con Mixpanel
  async trackPageView(prototypeId?: string) {
    await this.track('page_view', prototypeId);
    
    // También capturar pageview específico con manejo de errores
    if (typeof window !== 'undefined') {
      try {
        await waitForMixpanel();
        
        if (isMixpanelInitialized()) {
          const isLovablePreview = window.location.hostname.includes('lovable.app')
          const isLocalDev = window.location.hostname === 'localhost'
          
          mixpanel.track('$pageview', {
            prototype_id: prototypeId,
            $current_url: window.location.href,
            deployment_environment: isLovablePreview ? 'lovable_preview' : isLocalDev ? 'local_dev' : 'production',
            domain: window.location.hostname
          });
        }
      } catch (error) {
        console.error('Error tracking Mixpanel pageview:', error);
      }
    }
  }

  // Identificar usuario (para cuando tengas datos del usuario)
  identify(userId: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && mixpanel.get_config) {
      mixpanel.identify(userId);
      if (properties) {
        mixpanel.people.set(properties);
      }
    }
  }

  // Establecer propiedades del usuario
  setUserProperties(properties: Record<string, any>) {
    if (typeof window !== 'undefined' && mixpanel.get_config) {
      mixpanel.people.set(properties);
    }
  }

  // Registrar propiedades super (se incluyen en todos los eventos)
  registerSuperProperties(properties: Record<string, any>) {
    if (typeof window !== 'undefined' && mixpanel.get_config) {
      mixpanel.register(properties);
    }
  }

  // Crear alias para un usuario
  alias(userId: string) {
    if (typeof window !== 'undefined' && mixpanel.get_config) {
      mixpanel.alias(userId);
    }
  }

  // 🎯 EVENTOS DE FUNNEL DE CONVERSIÓN
  async trackFunnelStep(step: string, prototypeId?: string, stepNumber?: number, additionalData?: Record<string, any>) {
    await this.track('funnel_step', prototypeId, {
      funnel_step: step,
      step_number: stepNumber,
      funnel_type: 'booking',
      session_duration: Date.now() - this.sessionStartTime,
      ...additionalData
    });
  }

  async trackConversionGoal(goalType: string, prototypeId?: string, value?: number, additionalData?: Record<string, any>) {
    await this.track('conversion_goal', prototypeId, {
      goal_type: goalType,
      goal_value: value,
      conversion_time: Date.now() - this.sessionStartTime,
      page_interactions: this.interactionCount,
      scroll_completion: this.maxScrollDepth,
      ...additionalData
    });
  }

  // 🕐 EVENTOS DE TIEMPO Y ENGAGEMENT
  async trackTimeOnPage(prototypeId?: string, timeSpent?: number) {
    const actualTimeSpent = timeSpent || (Date.now() - this.pageStartTime);
    await this.track('time_on_page', prototypeId, {
      time_spent_ms: actualTimeSpent,
      time_spent_seconds: Math.round(actualTimeSpent / 1000),
      engagement_level: this.calculateEngagementLevel(actualTimeSpent),
      scroll_depth: this.maxScrollDepth,
      interactions: this.interactionCount
    });
  }

  async trackSessionDuration(prototypeId?: string) {
    const sessionDuration = Date.now() - this.sessionStartTime;
    await this.track('session_duration', prototypeId, {
      session_duration_ms: sessionDuration,
      session_duration_minutes: Math.round(sessionDuration / 60000),
      total_interactions: this.interactionCount,
      pages_visited: this.getUniquePages().length
    });
  }

  // 🎮 EVENTOS DE INTERACCIÓN DETALLADOS
  async trackUIInteraction(interactionType: string, elementId: string, prototypeId?: string, additionalData?: Record<string, any>) {
    this.interactionCount++;
    await this.track('ui_interaction', prototypeId, {
      interaction_type: interactionType,
      element_id: elementId,
      interaction_count: this.interactionCount,
      time_since_page_load: Date.now() - this.pageStartTime,
      scroll_position: this.scrollDepth,
      ...additionalData
    });
  }

  async trackFormInteraction(formField: string, action: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('form_interaction', prototypeId, {
      form_field: formField,
      form_action: action, // focus, blur, change, error, submit
      form_completion_time: Date.now() - this.pageStartTime,
      ...additionalData
    });
  }

  // 📱 EVENTOS DE EXPERIENCIA MOBILE/DESKTOP
  async trackDeviceInteraction(prototypeId?: string) {
    const deviceInfo = this.getDeviceInfo();
    await this.track('device_interaction', prototypeId, deviceInfo);
  }

  async trackPerformanceMetric(metricType: string, value: number, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('performance_metric', prototypeId, {
      metric_type: metricType, // load_time, interaction_delay, render_time
      metric_value: value,
      device_type: this.getDeviceType(),
      connection_type: this.getConnectionType(),
      ...additionalData
    });
  }

  // 🛍️ EVENTOS ESPECÍFICOS DE BOOKING FLOW
  async trackBookingIntent(prototypeId?: string, intentStrength?: 'low' | 'medium' | 'high') {
    await this.track('booking_intent', prototypeId, {
      intent_strength: intentStrength || 'medium',
      time_to_intent: Date.now() - this.pageStartTime,
      scroll_before_intent: this.maxScrollDepth,
      interactions_before_intent: this.interactionCount
    });
  }

  async trackBookingAbandonment(step: string, reason: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('booking_abandonment', prototypeId, {
      abandonment_step: step,
      abandonment_reason: reason,
      time_before_abandonment: Date.now() - this.pageStartTime,
      progress_percentage: this.calculateBookingProgress(step),
      ...additionalData
    });
  }

  async trackBookingError(errorType: string, errorMessage: string, step: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('booking_error', prototypeId, {
      error_type: errorType,
      error_message: errorMessage,
      error_step: step,
      retry_count: additionalData?.retryCount || 0,
      time_since_start: Date.now() - this.pageStartTime,
      ...additionalData
    });
  }

  // 🎥 EVENTOS DE CONTENIDO Y MEDIA
  async trackContentEngagement(contentType: string, contentId: string, engagementType: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('content_engagement', prototypeId, {
      content_type: contentType, // video, image, text, carousel
      content_id: contentId,
      engagement_type: engagementType, // view, click, share, like, comment
      time_engaged: additionalData?.timeEngaged || 0,
      content_position: additionalData?.position || 0,
      ...additionalData
    });
  }

  async trackVideoInteraction(videoId: string, action: string, currentTime: number, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('video_interaction', prototypeId, {
      video_id: videoId,
      video_action: action, // play, pause, seek, end, fullscreen
      video_time: currentTime,
      video_completion_rate: additionalData?.completionRate || 0,
      watch_duration: additionalData?.watchDuration || 0,
      ...additionalData
    });
  }

  // 🎯 EVENTOS DE TARGETING Y SEGMENTACIÓN
  async trackUserSegment(segmentType: string, segmentValue: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('user_segment', prototypeId, {
      segment_type: segmentType, // demographic, behavioral, geographic, psychographic
      segment_value: segmentValue,
      confidence_score: additionalData?.confidence || 1.0,
      ...additionalData
    });
  }

  async trackABTestParticipation(testName: string, variant: string, prototypeId?: string, additionalData?: Record<string, any>) {
    await this.track('ab_test_participation', prototypeId, {
      test_name: testName,
      test_variant: variant,
      test_group: additionalData?.group || 'treatment',
      ...additionalData
    });
  }

  // 🔧 MÉTODOS HELPER PRIVADOS
  private calculateEngagementLevel(timeSpent: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (timeSpent < 10000) return 'low'; // < 10 segundos
    if (timeSpent < 30000) return 'medium'; // < 30 segundos
    if (timeSpent < 120000) return 'high'; // < 2 minutos
    return 'very_high'; // > 2 minutos
  }

  private calculateBookingProgress(step: string): number {
    const steps = ['view', 'select_date', 'select_time', 'select_tickets', 'checkout', 'payment', 'confirmation'];
    const stepIndex = steps.indexOf(step);
    return stepIndex >= 0 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 0;
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return {};
    
    return {
      device_type: this.getDeviceType(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      pixel_ratio: window.devicePixelRatio || 1,
      orientation: window.screen.orientation?.type || 'unknown',
      touch_support: 'ontouchstart' in window
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getUniquePages(): string[] {
    return [...new Set(this.events.map(event => event.path))];
  }

  getEvents() {
    return this.events;
  }

  getPrototypeEvents(prototypeId: string) {
    return this.events.filter(event => event.prototypeId === prototypeId);
  }

  getPrototypeStats(prototypeId: string) {
    const events = this.getPrototypeEvents(prototypeId);
    const pageViews = events.filter(e => e.event === 'Page View').length;
    const bookings = events.filter(e => e.event === 'Booking Started').length;
    const completions = events.filter(e => e.event === 'Booking Completed').length;
    
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

// Instancia global de analíticas Mixpanel
export const mixpanelAnalytics = new MixpanelAnalytics();

export const useMixpanelAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar analíticas
    mixpanelAnalytics.init();
  }, []);

  useEffect(() => {
    // Trackear cambios de página de forma asíncrona
    const trackPageViewAsync = async () => {
      const path = location.pathname;
      const prototypeId = path.startsWith('/prototype/') 
        ? path.split('/')[2] 
        : undefined;
      
      await mixpanelAnalytics.trackPageView(prototypeId);
    };

    trackPageViewAsync();
  }, [location]);

  const trackEvent = (event: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track(event, prototypeId, additionalProperties);
  };

  const trackBookingStarted = (prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Booking Started', prototypeId, {
      category: 'booking',
      action: 'started',
      ...additionalProperties
    });
  };

  const trackBookingCompleted = (prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Booking Completed', prototypeId, {
      category: 'booking',
      action: 'completed',
      ...additionalProperties
    });
  };

  const trackPrototypeSelected = (prototypeId: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Prototype Selected', prototypeId, {
      category: 'prototype',
      action: 'selected',
      ...additionalProperties
    });
  };

  // Métodos de tracking mejorados para diferentes interacciones del usuario
  const trackButtonClick = (buttonName: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Button Click', prototypeId, {
      category: 'engagement',
      action: 'click',
      button_name: buttonName,
      ...additionalProperties
    });
  };

  const trackMediaInteraction = (mediaType: 'video' | 'image', action: 'play' | 'pause' | 'view', prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Media Interaction', prototypeId, {
      category: 'media',
      action,
      media_type: mediaType,
      ...additionalProperties
    });
  };

  const trackUserEngagement = (engagementType: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('User Engagement', prototypeId, {
      category: 'engagement',
      engagement_type: engagementType,
      ...additionalProperties
    });
  };

  const trackBookingStepProgression = (step: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Booking Step Progression', prototypeId, {
      category: 'booking',
      action: 'step_progression',
      step,
      ...additionalProperties
    });
  };

  const trackTicketSelection = (ticketType: string, quantity: number, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Ticket Selection', prototypeId, {
      category: 'booking',
      action: 'ticket_selection',
      ticket_type: ticketType,
      quantity,
      ...additionalProperties
    });
  };

  const trackDateSelection = (selectedDate: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Date Selection', prototypeId, {
      category: 'booking',
      action: 'date_selection',
      selected_date: selectedDate,
      ...additionalProperties
    });
  };

  const trackTimeSelection = (selectedTime: string, prototypeId?: string, additionalProperties?: Record<string, any>) => {
    mixpanelAnalytics.track('Time Selection', prototypeId, {
      category: 'booking',
      action: 'time_selection',
      selected_time: selectedTime,
      ...additionalProperties
    });
  };

  // Identificar usuario (para cuando tengas datos del usuario)
  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    mixpanelAnalytics.identify(userId, properties);
  };

  // Establecer propiedades del usuario
  const setUserProperties = (properties: Record<string, any>) => {
    mixpanelAnalytics.setUserProperties(properties);
  };

  // Registrar propiedades super
  const registerSuperProperties = (properties: Record<string, any>) => {
    mixpanelAnalytics.registerSuperProperties(properties);
  };

  // Crear alias
  const aliasUser = (userId: string) => {
    mixpanelAnalytics.alias(userId);
  };

  // Nuevos métodos avanzados de tracking
  const trackFunnelStep = async (step: string, prototypeId?: string, stepNumber?: number, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackFunnelStep(step, prototypeId, stepNumber, additionalData);
  };

  const trackConversionGoal = async (goalType: string, prototypeId?: string, value?: number, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackConversionGoal(goalType, prototypeId, value, additionalData);
  };

  const trackTimeOnPage = async (prototypeId?: string, timeSpent?: number) => {
    await mixpanelAnalytics.trackTimeOnPage(prototypeId, timeSpent);
  };

  const trackUIInteraction = async (interactionType: string, elementId: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackUIInteraction(interactionType, elementId, prototypeId, additionalData);
  };

  const trackFormInteraction = async (formField: string, action: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackFormInteraction(formField, action, prototypeId, additionalData);
  };

  const trackDeviceInteraction = async (prototypeId?: string) => {
    await mixpanelAnalytics.trackDeviceInteraction(prototypeId);
  };

  const trackPerformanceMetric = async (metricType: string, value: number, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackPerformanceMetric(metricType, value, prototypeId, additionalData);
  };

  const trackBookingIntent = async (prototypeId?: string, intentStrength?: 'low' | 'medium' | 'high') => {
    await mixpanelAnalytics.trackBookingIntent(prototypeId, intentStrength);
  };

  const trackBookingAbandonment = async (step: string, reason: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackBookingAbandonment(step, reason, prototypeId, additionalData);
  };

  const trackBookingError = async (errorType: string, errorMessage: string, step: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackBookingError(errorType, errorMessage, step, prototypeId, additionalData);
  };

  const trackContentEngagement = async (contentType: string, contentId: string, engagementType: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackContentEngagement(contentType, contentId, engagementType, prototypeId, additionalData);
  };

  const trackVideoInteraction = async (videoId: string, action: string, currentTime: number, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackVideoInteraction(videoId, action, currentTime, prototypeId, additionalData);
  };

  const trackUserSegment = async (segmentType: string, segmentValue: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackUserSegment(segmentType, segmentValue, prototypeId, additionalData);
  };

  const trackABTestParticipation = async (testName: string, variant: string, prototypeId?: string, additionalData?: Record<string, any>) => {
    await mixpanelAnalytics.trackABTestParticipation(testName, variant, prototypeId, additionalData);
  };

  return {
    // Métodos básicos existentes
    trackEvent, trackBookingStarted, trackBookingCompleted, trackPrototypeSelected,
    trackButtonClick, trackMediaInteraction, trackUserEngagement, trackBookingStepProgression,
    trackTicketSelection, trackDateSelection, trackTimeSelection,
    identifyUser, setUserProperties, registerSuperProperties, aliasUser,
    
    // Nuevos métodos avanzados de tracking
    trackFunnelStep, trackConversionGoal, trackTimeOnPage, trackUIInteraction,
    trackFormInteraction, trackDeviceInteraction, trackPerformanceMetric,
    trackBookingIntent, trackBookingAbandonment, trackBookingError,
    trackContentEngagement, trackVideoInteraction, trackUserSegment, trackABTestParticipation,
    
    // Métodos de datos
    getStats: mixpanelAnalytics.getPrototypeStats.bind(mixpanelAnalytics),
    getEvents: mixpanelAnalytics.getEvents.bind(mixpanelAnalytics),
  };
};


