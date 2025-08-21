# PostHog Analytics for Lovable Deployment 🚀

Your PostHog analytics are now configured to track interactions on your Lovable deployment at **https://preview--fever-proto-craft.lovable.app/**

## ✅ Configuration Complete

Your analytics system now includes:

### 🎯 **Environment Detection**
- **Local Development** (`localhost:8080`) - Debug mode enabled
- **Lovable Preview** (`*.lovable.app`) - Full tracking with session recording
- **Production** - Complete analytics suite

### 📊 **Enhanced Tracking for Lovable**
- **Secure Cookies** - Automatically enabled for HTTPS
- **Cross-subdomain Tracking** - Works across Lovable's subdomain system
- **Session Recording** - Enabled on Lovable deployment
- **Environment Tagging** - All events tagged with deployment type

## 🔍 **Testing on Lovable**

1. **Visit your Lovable app**: https://preview--fever-proto-craft.lovable.app/
2. **Open browser console** (`F12`) to see PostHog initialization
3. **Navigate through prototypes** and interact with elements
4. **Check PostHog dashboard** for real-time events

## 📈 **Events You'll Track**

### Automatic Events
- **Page Views** with prototype identification
- **Environment tagging** (lovable_preview, local_dev, production)
- **Domain tracking** for each deployment

### User Interactions
- **Booking Flow**: Complete funnel tracking
- **Media Engagement**: Video/image carousel interactions
- **Button Clicks**: All CTA and interaction buttons
- **Ticket Selection**: Adult/child quantity changes
- **Social Actions**: Like, share, camera clicks

## 🛠 **Environment Properties**

Each event includes:
```javascript
{
  deployment_environment: "lovable_preview",
  domain: "preview--fever-proto-craft.lovable.app",
  prototype_id: "segovia",
  // ... other properties
}
```

## 📊 **PostHog Dashboard Setup**

### Recommended Insights:
1. **Funnel Analysis**: Page View → Booking Started → Booking Completed
2. **Environment Comparison**: Compare local vs Lovable vs production metrics
3. **Prototype Performance**: Which bowling locations perform best
4. **User Journey**: Session recordings on Lovable deployment

### Filters to Create:
- `deployment_environment = "lovable_preview"` - Lovable-specific metrics
- `prototype_id = "segovia"` - Per-prototype analysis
- `domain contains "lovable.app"` - All Lovable deployments

## 🚀 **Ready to Go!**

Your PostHog analytics are now fully configured for:
- ✅ **Local development** tracking
- ✅ **Lovable deployment** tracking  
- ✅ **Production** ready
- ✅ **Environment differentiation**
- ✅ **Session recordings** on Lovable
- ✅ **EU compliance** ready

Visit your Lovable app and start seeing analytics flow in real-time! 📊

## 🔗 **Quick Links**
- **Lovable App**: https://preview--fever-proto-craft.lovable.app/
- **PostHog Dashboard**: https://app.posthog.com/ (EU region)
- **Project ID**: 81902
- **API Key**: `phc_iAsCGriRDNPlK3m9TVQpJ4JbnWLhwDtExipoS9I64rz`
