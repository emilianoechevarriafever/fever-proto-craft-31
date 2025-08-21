# PostHog Analytics Setup for Prototype Tracking

This document outlines how PostHog analytics has been integrated into the fever-proto-craft application to track user interactions across all bowling prototypes.

## 🚀 Quick Start

### 1. Get Your PostHog API Key

1. Log into your PostHog dashboard (EU region: https://eu.i.posthog.com)
2. Go to Project Settings
3. Copy your Project API Key
4. Create a `.env` file in the root directory:

```bash
# .env
VITE_POSTHOG_KEY=your-actual-posthog-api-key-here
```

### 2. Environment Configuration

The PostHog configuration is set up for EU region by default. If you need to change this, edit `/src/lib/posthog.ts`:

```typescript
const POSTHOG_HOST = 'https://eu.i.posthog.com' // Change if needed
```

### 3. Development vs Production

- **Development**: PostHog debug mode is enabled, session recording is disabled
- **Production**: Full tracking enabled including session recordings and surveys

## 📊 What's Being Tracked

### Automatic Tracking
- **Page Views**: Every route change and prototype visit
- **Prototype Identification**: Each prototype (segovia, barcelona, madrid, etc.) is tracked separately

### User Interactions
- **Booking Flow**: Start, progression, and completion
- **Media Interactions**: Video plays, image views, carousel navigation
- **Button Clicks**: All CTA buttons, social actions (like, share, camera)
- **Ticket Selection**: Adult/child ticket quantity changes
- **Info Toggles**: Expanding/collapsing additional information

### Enhanced Properties
Each event includes:
- **Prototype ID**: Which bowling location
- **User Context**: Browser info, current URL, timestamp
- **Interaction Details**: Button names, media types, quantities
- **User Journey**: Booking progression steps

## 🎯 Event Examples

### Page View
```javascript
{
  event: "$pageview",
  properties: {
    prototype_id: "segovia",
    $current_url: "https://yourapp.com/prototype/segovia"
  }
}
```

### Booking Started
```javascript
{
  event: "booking_started",
  properties: {
    prototype_id: "segovia",
    category: "booking",
    action: "started",
    adult_tickets: 2,
    children_tickets: 1,
    total_tickets: 3,
    button_action: "Tickets"
  }
}
```

### Media Interaction
```javascript
{
  event: "media_interaction",
  properties: {
    prototype_id: "segovia",
    category: "media",
    action: "view",
    media_type: "video",
    slide_index: 0,
    auto_advance: true
  }
}
```

### Ticket Selection
```javascript
{
  event: "ticket_selection",
  properties: {
    prototype_id: "segovia",
    category: "booking",
    action: "ticket_selection",
    ticket_type: "adults",
    quantity: 3,
    action: "increase",
    previous_count: 2,
    current_kids: 1
  }
}
```

## 🛠 Implementation Details

### Architecture
1. **PostHog Provider** (`/src/components/PostHogProvider.tsx`): Initializes PostHog
2. **Analytics Hook** (`/src/hooks/use-analytics.ts`): Provides tracking methods
3. **PostHog Config** (`/src/lib/posthog.ts`): Core configuration

### Key Components
- **Enhanced Analytics Class**: Combines local tracking with PostHog
- **React Hook Integration**: Easy-to-use tracking methods in components
- **Provider Pattern**: Ensures PostHog is initialized before tracking

### Usage in Components
```typescript
import { useAnalytics } from '@/hooks/use-analytics';

const { trackButtonClick, trackBookingStarted, trackTicketSelection } = useAnalytics();

// Track button clicks
trackButtonClick('CTA Button', 'segovia', { additional: 'properties' });

// Track booking events
trackBookingStarted('segovia', { adult_tickets: 2, children_tickets: 1 });

// Track ticket changes
trackTicketSelection('adults', newCount, 'segovia', { action: 'increase' });
```

## 📈 PostHog Dashboard Insights

Once tracking is active, you can analyze:

### Funnel Analysis
1. **Page Views** → **Booking Started** → **Booking Completed**
2. Conversion rates by prototype
3. Drop-off points in the booking flow

### User Behavior
- **Most Engaged Prototypes**: Which locations get the most interaction
- **Media Performance**: Video vs image engagement
- **Ticket Preferences**: Adult vs child ticket patterns

### A/B Testing Ready
- Compare different calendar types (`big` vs `small`)
- Test different CTA button texts
- Analyze media carousel effectiveness

## 🔧 Advanced Configuration

### User Identification
When you have user data (login, email, etc.), identify users:

```typescript
const { identifyUser, setUserProperties } = useAnalytics();

// Identify user
identifyUser('user123', { email: 'user@example.com' });

// Set additional properties
setUserProperties({ 
  subscription_type: 'premium',
  preferred_location: 'madrid' 
});
```

### Custom Events
Add new tracking events:

```typescript
const { trackEvent } = useAnalytics();

trackEvent('custom_event_name', 'prototype_id', {
  custom_property: 'value',
  another_property: 123
});
```

### Privacy Compliance
PostHog is configured to:
- Respect "Do Not Track" browser settings
- Only create user profiles for identified users
- Allow for GDPR compliance

## 🚨 Troubleshooting

### Common Issues

1. **Events not appearing in PostHog**
   - Check your API key in `.env`
   - Verify network requests in browser dev tools
   - Ensure PostHog script loads before tracking calls

2. **Development tracking**
   - Events are logged to console in development
   - Check browser console for PostHog initialization messages

3. **Missing events**
   - Verify component is wrapped by PostHogProvider
   - Check useAnalytics hook is imported correctly

### Debug Mode
In development, PostHog debug mode shows detailed logs:

```javascript
// In browser console, you'll see:
// "PostHog initialized in development mode"
// "PostHog Event: event_name { properties... }"
```

## 📝 Next Steps

1. **Add your PostHog API key** to the `.env` file
2. **Deploy and test** tracking in your environment
3. **Set up PostHog dashboard** with relevant insights and funnels
4. **Extend tracking** to other prototype components as needed

## 🔗 Related Files

- `/src/lib/posthog.ts` - PostHog configuration
- `/src/components/PostHogProvider.tsx` - React provider
- `/src/hooks/use-analytics.ts` - Analytics hook
- `/src/pages/prototypes/BowlingSegovia.tsx` - Example implementation
- `.env` - Environment variables (create this file)

---

**Ready to track! 🎳📊** Your prototype analytics are now powered by PostHog.
