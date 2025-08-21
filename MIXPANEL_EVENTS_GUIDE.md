# 📊 Guía Completa de Eventos de Mixpanel

## 🎯 Eventos Implementados para Analytics Avanzados

Esta guía describe todos los eventos de tracking implementados para crear dashboards poderosos en Mixpanel, incluyendo funneles de conversión, análisis de comportamiento, y métricas de rendimiento.

---

## 🔥 **EVENTOS CORE DE FUNNEL DE CONVERSIÓN**

### 1. `funnel_step`
**Propósito:** Trackear el progreso del usuario a través del funnel de booking
```javascript
trackFunnelStep('page_view', 'segovia', 1, { 
  page_type: 'prototype_landing',
  prototype_version: 'v1'
});
```

**Propiedades clave:**
- `funnel_step`: Nombre del paso del funnel
- `step_number`: Número secuencial del paso (1-7)
- `funnel_type`: 'booking'
- `session_duration`: Tiempo desde inicio de sesión
- `user_intent`: 'low', 'medium', 'high'

**Pasos del funnel:**
1. `page_view` - Usuario llega a la página
2. `booking_section_view` - Usuario ve la sección de booking
3. `scroll_to_booking` - Usuario hace scroll hacia booking
4. `booking_continue` - Usuario procede con booking
5. `booking_initiated` - Usuario inicia el proceso de booking
6. `payment_started` - Usuario inicia pago
7. `booking_completed` - Conversión completa

### 2. `conversion_goal`
**Propósito:** Marcar objetivos de conversión alcanzados
```javascript
trackConversionGoal('booking_start', 'segovia', 2, {
  conversion_value: 28,
  user_configuration: '2A_0C',
  signal_strength: 'high'
});
```

**Tipos de goals:**
- `engagement_signal` - Usuario muestra engagement (like, video completion)
- `booking_start` - Usuario inicia proceso de booking
- `booking_flow_entry` - Usuario entra al flujo de booking
- `video_completion` - Usuario completa visualización de video

---

## 🕐 **EVENTOS DE TIEMPO Y ENGAGEMENT**

### 3. `time_on_page`
**Propósito:** Medir tiempo de permanencia y nivel de engagement
```javascript
trackTimeOnPage('segovia', 45000);
```

**Propiedades:**
- `time_spent_ms`: Tiempo en milisegundos
- `time_spent_seconds`: Tiempo en segundos
- `engagement_level`: 'low', 'medium', 'high', 'very_high'
- `scroll_depth`: Profundidad máxima de scroll
- `interactions`: Número de interacciones

### 4. `session_duration`
**Propósito:** Trackear duración total de la sesión
```javascript
trackSessionDuration('segovia');
```

### 5. `scroll_milestone`
**Propósito:** Trackear progreso de scroll en la página
```javascript
// Se dispara automáticamente en 25%, 50%, 75%, 90%
```

---

## 🎮 **EVENTOS DE INTERACCIÓN DETALLADOS**

### 6. `ui_interaction`
**Propósito:** Trackear todas las interacciones con elementos de la UI
```javascript
trackUIInteraction('click', 'heart_button', 'segovia', {
  engagement_type: 'emotional_response',
  action_result: 'liked'
});
```

**Tipos de interacción:**
- `click` - Clics en botones/elementos
- `hover` - Hovers significativos
- `focus` - Focus en campos de formulario
- `scroll` - Scroll dirigido

### 7. `form_interaction`
**Propósito:** Trackear interacciones específicas con formularios
```javascript
trackFormInteraction('date_picker', 'change', 'segovia', {
  selected_value: '2024-01-15'
});
```

**Acciones de formulario:**
- `focus`, `blur`, `change`, `error`, `submit`

---

## 📱 **EVENTOS DE EXPERIENCIA DE DISPOSITIVO**

### 8. `device_interaction`
**Propósito:** Capturar información detallada del dispositivo del usuario
```javascript
trackDeviceInteraction('segovia');
```

**Información capturada:**
- Tipo de dispositivo (mobile/tablet/desktop)
- Dimensiones de pantalla y viewport
- Pixel ratio, orientación
- Soporte táctil
- Tipo de conexión

### 9. `performance_metric`
**Propósito:** Trackear métricas de rendimiento
```javascript
trackPerformanceMetric('load_time', 2500, 'segovia', {
  metric_type: 'page_load',
  connection_type: '4g'
});
```

---

## 🛍️ **EVENTOS ESPECÍFICOS DE BOOKING**

### 10. `booking_intent`
**Propósito:** Trackear la intención de booking del usuario
```javascript
trackBookingIntent('segovia', 'high');
```

**Niveles de intención:**
- `low` - Usuario explora casualmente
- `medium` - Usuario muestra interés
- `high` - Usuario está listo para reservar

### 11. `booking_abandonment`
**Propósito:** Analizar puntos de abandono en el funnel
```javascript
trackBookingAbandonment('payment', 'payment_error', 'segovia', {
  progress_percentage: 85,
  time_before_abandonment: 120000
});
```

### 12. `booking_error`
**Propósito:** Trackear errores en el proceso de booking
```javascript
trackBookingError('validation_error', 'Invalid credit card', 'payment', 'segovia', {
  retry_count: 2
});
```

---

## 🎥 **EVENTOS DE CONTENIDO Y MEDIA**

### 13. `content_engagement`
**Propósito:** Trackear engagement con diferentes tipos de contenido
```javascript
trackContentEngagement('video', 'bowling_hero_video', 'play', 'segovia', {
  engagement_quality: 'high',
  content_position: 'above_fold'
});
```

### 14. `video_interaction`
**Propósito:** Trackear interacciones específicas con videos
```javascript
trackVideoInteraction('bowling_hero_video', 'play', 0, 'segovia', {
  video_position: 'hero_carousel',
  auto_play: true
});
```

**Acciones de video:**
- `play`, `pause`, `seek`, `end`, `fullscreen`

---

## 🎯 **EVENTOS DE SEGMENTACIÓN Y TESTING**

### 15. `user_segment`
**Propósito:** Asignar usuarios a segmentos para análisis
```javascript
trackUserSegment('behavioral', 'high_intent_user', 'segovia', {
  confidence: 0.85
});
```

### 16. `ab_test_participation`
**Propósito:** Trackear participación en tests A/B
```javascript
trackABTestParticipation('booking_button_color', 'variant_red', 'segovia', {
  test_group: 'treatment'
});
```

---

## 📊 **DASHBOARDS RECOMENDADOS EN MIXPANEL**

### 🎯 **1. Funnel de Conversión Principal**
```
page_view → booking_section_view → booking_initiated → booking_completed
```

### 📈 **2. Análisis de Engagement**
- Tiempo promedio en página por prototipo
- Distribución de `engagement_level`
- Tasa de interacción con videos
- Profundidad de scroll vs conversiones

### 🔍 **3. Análisis de Abandono**
- Puntos de abandono más comunes
- Razones de abandono por paso
- Tiempo hasta abandono por funnel step

### 📱 **4. Segmentación por Dispositivo**
- Conversiones por tipo de dispositivo
- Tiempo de carga por connection_type
- Patrones de uso mobile vs desktop

### 🎬 **5. Análisis de Contenido**
- Engagement con videos por posición
- Efectividad de contenido por tipo
- Correlación entre media engagement y conversiones

---

## 🚀 **MÉTRICAS CLAVE A MONITOREAR**

### Conversión
- **Tasa de conversión global:** `booking_completed` / `page_view`
- **Tasa de intención:** `booking_intent` (high) / `page_view`
- **Tiempo hasta conversión:** Promedio desde `page_view` hasta `booking_completed`

### Engagement
- **Score de engagement:** Basado en tiempo, scroll, interacciones
- **Tasa de video completion:** `video_interaction` (end) / `video_interaction` (play)
- **Profundidad de engagement:** Usuarios que alcanzan scroll 75%+

### Experiencia
- **Tiempo de carga promedio:** `performance_metric` (load_time)
- **Tasa de error:** `booking_error` / `booking_initiated`
- **Satisfacción por dispositivo:** Conversiones por device_type

---

## 🔧 **CONFIGURACIÓN DE ALERTAS**

1. **Drop en conversión > 20%** - Alerta crítica
2. **Aumento en booking_abandonment** - Investigar UX
3. **Errores de booking > 5%** - Revisar sistema
4. **Tiempo de carga > 3s** - Optimizar performance

---

**¡Con estos eventos tendrás visibilidad completa del comportamiento del usuario y podrás optimizar cada punto del funnel! 🎳📊**
