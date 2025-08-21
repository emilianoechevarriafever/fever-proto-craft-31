# Configuración de Analytics con Mixpanel 🚀

Tu sistema de analytics ahora está configurado con **Mixpanel** para trackear interacciones en tus prototipos de bowling, incluyendo tu deployment de Lovable en **https://preview--fever-proto-craft.lovable.app/**

## ✅ **Configuración Completada**

Tu sistema de analytics ahora incluye:

### 🎯 **Detección de Entorno**
- **Desarrollo Local** (`localhost:8080`) - Modo debug habilitado
- **Lovable Preview** (`*.lovable.app`) - Tracking completo con propiedades de entorno
- **Producción** - Suite completa de analytics

### 📊 **Tracking Mejorado para Mixpanel**
- **Cookies Seguras** - Habilitadas automáticamente para HTTPS
- **Tracking Cross-subdomain** - Funciona en el sistema de subdominio de Lovable
- **Propiedades Super** - Propiedades que se incluyen en todos los eventos
- **Perfiles de Usuario** - Tracking avanzado de usuarios identificados

## 🔍 **Configuración Rápida**

### 1. **Obtén tu Token de Mixpanel**

1. Ve a tu dashboard de Mixpanel: https://mixpanel.com/
2. Ve a Project Settings → Project Token
3. Copia tu Project Token
4. Actualiza el archivo `.env`:

```bash
# .env
VITE_MIXPANEL_TOKEN=350cae4fcd00f9d40cb750d44d6fe69d
```

### 2. **Configuración del Entorno**

El sistema está configurado para detectar automáticamente el entorno:
- **Desarrollo**: Debug habilitado, logs en consola
- **Lovable**: Tracking completo con propiedades de deployment
- **Producción**: Tracking optimizado para performance

## 📈 **Eventos que se Están Trackeando**

### Eventos Automáticos
- **Page View** - Cada cambio de ruta y visita a prototype
- **Identificación de Prototypes** - Cada prototipo (segovia, barcelona, madrid, etc.) se trackea por separado

### Interacciones del Usuario
- **Booking Flow**: Inicio, progresión y finalización del booking
- **Media Interactions**: Reproducciones de video, views de imágenes, navegación del carousel
- **Button Clicks**: Todos los botones CTA, acciones sociales (like, share, camera)
- **Ticket Selection**: Cambios en cantidades de tickets adultos/niños
- **Info Toggles**: Expandir/contraer información adicional

### Propiedades Mejoradas
Cada evento incluye:
- **Prototype ID**: Qué ubicación de bowling
- **Contexto del Usuario**: Info del navegador, URL actual, timestamp
- **Detalles de Interacción**: Nombres de botones, tipos de media, cantidades
- **Journey del Usuario**: Pasos de progresión del booking

## 🎯 **Ejemplos de Eventos**

### Page View
```javascript
{
  event: "Page View",
  properties: {
    prototype_id: "segovia",
    deployment_environment: "lovable_preview",
    domain: "preview--fever-proto-craft.lovable.app"
  }
}
```

### Booking Started
```javascript
{
  event: "Booking Started",
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
  event: "Media Interaction",
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
  event: "Ticket Selection",
  properties: {
    prototype_id: "segovia",
    category: "booking",
    action: "ticket_selection",
    ticket_type: "adults",
    quantity: 3,
    action: "increase",
    previous_count: 2
  }
}
```

## 🛠 **Detalles de Implementación**

### Arquitectura
1. **Mixpanel Provider** (`/src/components/MixpanelProvider.tsx`): Inicializa Mixpanel
2. **Analytics Hook** (`/src/hooks/use-mixpanel-analytics.ts`): Proporciona métodos de tracking
3. **Mixpanel Config** (`/src/lib/mixpanel.ts`): Configuración principal

### Componentes Clave
- **Clase Enhanced Analytics**: Combina tracking local con Mixpanel
- **Integración con React Hook**: Métodos fáciles de usar en componentes
- **Patrón Provider**: Asegura que Mixpanel se inicialice antes del tracking

### Uso en Componentes
```typescript
import { useMixpanelAnalytics } from '@/hooks/use-mixpanel-analytics';

const { trackButtonClick, trackBookingStarted, trackTicketSelection } = useMixpanelAnalytics();

// Trackear clicks de botones
trackButtonClick('CTA Button', 'segovia', { additional: 'properties' });

// Trackear eventos de booking
trackBookingStarted('segovia', { adult_tickets: 2, children_tickets: 1 });

// Trackear cambios de tickets
trackTicketSelection('adults', newCount, 'segovia', { action: 'increase' });
```

## 📊 **Configuración del Dashboard de Mixpanel**

### Insights Recomendados:
1. **Análisis de Funnel**: Page View → Booking Started → Booking Completed
2. **Comparación de Entornos**: Comparar métricas de local vs Lovable vs producción
3. **Performance de Prototipos**: Qué ubicaciones de bowling funcionan mejor
4. **User Journey**: Grabaciones y análisis de comportamiento

### Filtros para Crear:
- `deployment_environment = "lovable_preview"` - Métricas específicas de Lovable
- `prototype_id = "segovia"` - Análisis por prototipo
- `domain contains "lovable.app"` - Todos los deployments de Lovable

## 🚀 **¡Listo para Usar!**

Tu analytics de Mixpanel están completamente configurados para:
- ✅ **Tracking de desarrollo local**
- ✅ **Tracking de deployment de Lovable**  
- ✅ **Listo para producción**
- ✅ **Diferenciación de entornos**
- ✅ **Perfiles de usuario avanzados**
- ✅ **Cumplimiento de privacidad**

## 🔧 **Configuración Avanzada**

### Identificación de Usuarios
Cuando tengas datos de usuario (login, email, etc.), identifica usuarios:

```typescript
const { identifyUser, setUserProperties } = useMixpanelAnalytics();

// Identificar usuario
identifyUser('user123', { email: 'user@example.com' });

// Establecer propiedades adicionales
setUserProperties({ 
  subscription_type: 'premium',
  preferred_location: 'madrid' 
});
```

### Eventos Personalizados
Agregar nuevos eventos de tracking:

```typescript
const { trackEvent } = useMixpanelAnalytics();

trackEvent('Custom Event Name', 'prototype_id', {
  custom_property: 'value',
  another_property: 123
});
```

### Propiedades Super
Establecer propiedades que se incluyen en todos los eventos:

```typescript
const { registerSuperProperties } = useMixpanelAnalytics();

registerSuperProperties({
  app_version: '1.0.0',
  user_segment: 'beta_tester'
});
```

## 🚨 **Solución de Problemas**

### Problemas Comunes

1. **Eventos no aparecen en Mixpanel**
   - Verifica tu token en `.env`
   - Revisa las requests de red en las herramientas de desarrollo del navegador
   - Asegúrate de que el script de Mixpanel se carga antes de las llamadas de tracking

2. **Tracking de desarrollo**
   - Los eventos se logean en la consola en desarrollo
   - Verifica la consola del navegador para mensajes de inicialización de Mixpanel

3. **Eventos faltantes**
   - Verifica que el componente esté envuelto por MixpanelProvider
   - Comprueba que el hook useMixpanelAnalytics se importe correctamente

### Modo Debug
En desarrollo, el modo debug de Mixpanel muestra logs detallados:

```javascript
// En la consola del navegador, verás:
// "Mixpanel initialized in development mode"
// "Mixpanel Event: event_name { properties... }"
```

## 📝 **Próximos Pasos**

1. **Agrega tu token de Mixpanel** al archivo `.env`
2. **Despliega y prueba** el tracking en tu entorno
3. **Configura tu dashboard de Mixpanel** con insights y funnels relevantes
4. **Extiende el tracking** a otros componentes de prototipos según sea necesario

## 🔗 **Enlaces Relacionados**

- `/src/lib/mixpanel.ts` - Configuración de Mixpanel
- `/src/components/MixpanelProvider.tsx` - Proveedor de React
- `/src/hooks/use-mixpanel-analytics.ts` - Hook de analytics
- `/src/pages/prototypes/BowlingSegovia.tsx` - Implementación de ejemplo
- `.env` - Variables de entorno (crear este archivo)

---

**¡Listo para trackear con Mixpanel! 🎳📊** Tus analytics de prototipo ahora están potenciados por Mixpanel.
