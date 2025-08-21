import posthog from 'posthog-js'

const isProduction = import.meta.env.PROD
const isDev = import.meta.env.DEV

// PostHog configuration
export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    // PostHog configuration for Lovable deployment
    const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_iAsCGriRDNPlK3m9TVQpJ4JbnWLhwDtExipoS9I64rz'
    const POSTHOG_HOST = 'https://eu.posthog.com'
    
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // We'll handle pageviews manually
      capture_pageleave: true, // Capture when users leave pages
      
      // EU compliance settings
      respect_dnt: true,
      
      // Lovable deployment optimizations
      secure_cookie: window.location.protocol === 'https:',
      
      // Development vs Production settings
      disable_session_recording: isDev, // Enable in Lovable production
      disable_surveys: isDev, // Enable surveys in Lovable production
      
      // Person profiles
      person_profiles: 'identified_only', // Only create profiles for identified users
      
      // Cross-domain tracking (useful for Lovable subdomains)
      cross_subdomain_cookie: true,
      
      // Session and event configuration
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true
        }
      },
      
      // Debug and initialization callback
      loaded: (posthog) => {
        const isLovablePreview = window.location.hostname.includes('lovable.app')
        
        if (isDev || window.location.hostname === 'localhost') {
          posthog.debug(true)
          console.log('PostHog initialized in development mode')
        } else if (isLovablePreview) {
          console.log('PostHog initialized for Lovable preview:', window.location.hostname)
          // Set additional properties for Lovable environment
          posthog.setPersonProperties({
            deployment_type: 'lovable_preview',
            preview_domain: window.location.hostname
          })
        } else {
          console.log('PostHog loaded successfully in production')
        }
      }
    })
  }
}

// Helper to check if PostHog is initialized
export const isPostHogInitialized = (): boolean => {
  return typeof window !== 'undefined' && Boolean(posthog.__loaded)
}

// Export the posthog instance
export { posthog }
export default posthog
