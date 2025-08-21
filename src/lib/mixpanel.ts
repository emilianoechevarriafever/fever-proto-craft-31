import mixpanel from 'mixpanel-browser'

const isDev = import.meta.env.DEV
let isInitialized = false
let initializationPromise: Promise<void> | null = null

// Mixpanel configuration con inicialización asíncrona
export const initMixpanel = (): Promise<void> => {
  if (initializationPromise) {
    return initializationPromise
  }

  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  initializationPromise = new Promise((resolve, reject) => {
    try {
      const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '350cae4fcd00f9d40cb750d44d6fe69d'
      
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: isDev,
        track_pageview: false,
        persistence: 'localStorage',
        cross_subdomain_cookie: false,
        loaded: (mixpanel) => {
          try {
            const isLovablePreview = window.location.hostname.includes('lovable.app')
            const isLocalDev = window.location.hostname === 'localhost'
            
            console.log('Analytics initialized with Mixpanel')
            
            if (isLovablePreview) {
              console.log('Mixpanel initialized for Lovable preview:', window.location.hostname)
              mixpanel.register({
                deployment_environment: 'lovable_preview',
                domain: window.location.hostname
              })
            } else if (isLocalDev) {
              console.log('Mixpanel initialized in development mode')
            } else {
              console.log('Mixpanel loaded successfully in production')
            }
            
            isInitialized = true
            resolve()
          } catch (error) {
            console.error('Error in Mixpanel loaded callback:', error)
            reject(error)
          }
        }
      })
    } catch (error) {
      console.error('Error initializing Mixpanel:', error)
      reject(error)
    }
  })

  return initializationPromise
}

// Helper para verificar si Mixpanel está inicializado
export const isMixpanelInitialized = (): boolean => {
  return isInitialized && typeof window !== 'undefined' && Boolean(mixpanel.get_config)
}

// Helper para esperar a que Mixpanel esté listo
export const waitForMixpanel = async (): Promise<void> => {
  if (initializationPromise) {
    await initializationPromise
  }
}

// Export de la instancia de mixpanel
export { mixpanel }
export default mixpanel


