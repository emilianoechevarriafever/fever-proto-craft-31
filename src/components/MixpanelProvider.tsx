import { createContext, useContext, useEffect, ReactNode } from 'react'
import { initMixpanel, mixpanel, isMixpanelInitialized } from '@/lib/mixpanel'

interface MixpanelContextType {
  mixpanel: typeof mixpanel
  isInitialized: boolean
}

const MixpanelContext = createContext<MixpanelContextType | null>(null)

interface MixpanelProviderProps {
  children: ReactNode
}

export const MixpanelProvider = ({ children }: MixpanelProviderProps) => {
  useEffect(() => {
    // Inicializar Mixpanel de forma asíncrona
    const initializeAsync = async () => {
      try {
        await initMixpanel()
        console.log('Mixpanel provider: initialization complete')
      } catch (error) {
        console.error('Mixpanel provider: initialization failed', error)
      }
    }
    
    initializeAsync()
  }, [])

  const value: MixpanelContextType = {
    mixpanel,
    isInitialized: isMixpanelInitialized()
  }

  return (
    <MixpanelContext.Provider value={value}>
      {children}
    </MixpanelContext.Provider>
  )
}

export const useMixpanel = () => {
  const context = useContext(MixpanelContext)
  if (!context) {
    throw new Error('useMixpanel must be used within a MixpanelProvider')
  }
  return context
}


