import { createContext, useContext, useEffect, ReactNode } from 'react'
import { initPostHog, posthog, isPostHogInitialized } from '@/lib/posthog'

interface PostHogContextType {
  posthog: typeof posthog
  isInitialized: boolean
}

const PostHogContext = createContext<PostHogContextType | null>(null)

interface PostHogProviderProps {
  children: ReactNode
}

export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    // Initialize PostHog when the provider mounts
    initPostHog()
  }, [])

  const value: PostHogContextType = {
    posthog,
    isInitialized: isPostHogInitialized()
  }

  return (
    <PostHogContext.Provider value={value}>
      {children}
    </PostHogContext.Provider>
  )
}

export const usePostHog = () => {
  const context = useContext(PostHogContext)
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider')
  }
  return context
}
