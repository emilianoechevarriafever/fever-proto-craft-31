# 🎯 Comparación de Funneles de Conversión

## 📊 **FUNNEL IMPLEMENTADO EN TODOS LOS PROTOTIPOS**

### **✅ Eventos Consistentes en Los 5 Prototipos:**

#### **🎯 EVENTO 1: `funnel_step('page_view')`**
**Paso:** Usuario llega a la página
**Step Number:** 1
**Prototipos:** segovia, barcelona, madrid, cadiz, jaen

#### **🎯 EVENTO 2: `funnel_step('booking_section_view')`**
**Paso:** Usuario ve la sección de booking (scroll down)
**Step Number:** 2
**Prototipos:** segovia, barcelona, madrid, cadiz, jaen

#### **🎯 EVENTO 3: `conversion_goal('booking_started')`**
**Paso:** Usuario inicia proceso de booking (¡CONVERSIÓN!)
**Prototipos:** segovia, barcelona, madrid, cadiz, jaen
**Valores estimados:**
- **Segovia:** €28 (2A + 2K)
- **Barcelona:** €24 (2A + 0K)  
- **Madrid:** €26 (2A + 0K)
- **Cadiz:** €22 (2A + 0K)
- **Jaen:** €20 (2A + 0K)

#### **🎯 EVENTO 4: `time_on_page`**
**Paso:** Tiempo total en página (al salir)
**Propósito:** Medir engagement
**Prototipos:** segovia, barcelona, madrid, cadiz, jaen

---

## 🎯 **FUNNEL DE CONVERSIÓN UNIFICADO:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   page_view     │ →  │booking_section_ │ →  │ booking_started │
│     (100%)      │    │   view (??%)    │    │     (??%)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      STEP 1                  STEP 2                 STEP 3
   Todos llegan          ¿Cuántos ven           ¿Cuántos inician
                        la sección?               booking?
```

---

## 📈 **COMPARACIONES QUE PODRÁS HACER:**

### **🏆 1. Conversión Global por Prototipo**
```
Segovia:   page_view → booking_started = ?%
Barcelona: page_view → booking_started = ?%
Madrid:    page_view → booking_started = ?%
Cadiz:     page_view → booking_started = ?%
Jaen:      page_view → booking_started = ?%
```

### **👀 2. Engagement (Scroll to Booking)**
```
Segovia:   page_view → booking_section_view = ?%
Barcelona: page_view → booking_section_view = ?%
Madrid:    page_view → booking_section_view = ?%
Cadiz:     page_view → booking_section_view = ?%
Jaen:      page_view → booking_section_view = ?%
```

### **⚡ 3. Conversión de Booking Section**
```
Segovia:   booking_section_view → booking_started = ?%
Barcelona: booking_section_view → booking_started = ?%
Madrid:    booking_section_view → booking_started = ?%
Cadiz:     booking_section_view → booking_started = ?%
Jaen:      booking_section_view → booking_started = ?%
```

### **⏱️ 4. Tiempo hasta Conversión**
```
Tiempo promedio hasta booking_started:
- Segovia: ? minutos
- Barcelona: ? minutos  
- Madrid: ? minutos
- Cadiz: ? minutos
- Jaen: ? minutos
```

---

## 🔍 **ANÁLISIS QUE DESCUBRIRÁS:**

### **📉 Drop-off Analysis**
**¿Dónde se caen más usuarios?**
- **Entre page_view y booking_section_view:** Problema de engagement inicial
- **Entre booking_section_view y booking_started:** Problema en UX de booking

### **🏅 Performance por Ciudad**
**Ejemplo de insights que obtendrás:**
- *"Madrid tiene mejor engagement (75% ve booking) pero peor conversión (12%)"*
- *"Jaen tiene menor engagement (45% ve booking) pero mejor conversión (25%)"*
- *"Segovia es el más equilibrado: 65% engagement, 18% conversión"*

### **⚡ Quick Wins**
**Acciones inmediatas basadas en datos:**
- **Si Madrid tiene buen engagement pero mala conversión:** Mejorar UX de booking
- **Si Cadiz tiene mal engagement:** Mejorar contenido above-the-fold
- **Si Barcelona convierte bien:** Aplicar sus elementos a otros prototipos

---

## 📊 **DASHBOARDS EN MIXPANEL:**

### **🎯 1. Funnel Principal (CRÍTICO)**
```
Crear Funnel con:
Step 1: funnel_step (page_view)
Step 2: funnel_step (booking_section_view) 
Step 3: conversion_goal (booking_started)
```

**Filtros:**
- Por `prototype_id` (segovia, barcelona, madrid, cadiz, jaen)
- Por timeframe (último día/semana/mes)

### **📈 2. Comparación de Prototipos**
```
Crear Insights con:
- Eventos: conversion_goal (booking_started)
- Breakdown: prototype_id
- Métrica: Count of events
```

### **⏱️ 3. Tiempo de Conversión**
```
Crear Insights con:
- Eventos: time_on_page
- Filtro: Usuarios que también hicieron conversion_goal
- Breakdown: prototype_id
- Métrica: Average de time_spent_seconds
```

### **💰 4. Valor por Prototipo**
```
Crear Insights con:
- Eventos: conversion_goal
- Breakdown: prototype_id  
- Métrica: Sum de total_value
```

---

## 🚨 **ALERTAS IMPORTANTES A CONFIGURAR:**

### **📉 1. Drop en Conversión**
```
Si conversion_goal (booking_started) baja >20% vs semana anterior
→ Investigar qué prototipo está fallando
```

### **⚠️ 2. Prototipo Underperforming**
```
Si algún prototype_id tiene conversión <50% del promedio
→ Revisar ese prototipo específico
```

### **🎯 3. Oportunidades**
```
Si booking_section_view está alto pero booking_started bajo
→ Problema en UX de booking, acción inmediata
```

---

## 🔥 **PREGUNTAS QUE PODRÁS RESPONDER:**

### **🏆 Performance**
- ¿Qué prototipo convierte mejor?
- ¿Cuál tiene mejor engagement inicial?
- ¿Cuál pierde más usuarios en booking?

### **🕐 Comportamiento**
- ¿Cuánto tiempo necesitan los usuarios para decidir?
- ¿Los usuarios rápidos o lentos convierten más?
- ¿Qué ciudades generan más engagement?

### **💡 Optimización**
- ¿Qué elementos de Segovia aplicar a Barcelona?
- ¿Cómo mejorar el engagement de Cadiz?
- ¿Por qué Madrid no convierte bien en booking?

---

## 🎯 **PRÓXIMOS PASOS:**

1. **Despliega a Lovable** - Los eventos empezarán a fluir
2. **Visita cada prototipo** - Genera data inicial
3. **Ve a Mixpanel** - Crea los dashboards principales
4. **Analiza los primeros datos** - Identifica patterns
5. **Optimiza el peor performer** - Quick wins

---

**🎳 Con este sistema tienes visibilidad COMPLETA del funnel de cada prototipo y puedes optimizar basándote en datos reales, no suposiciones!**

**📊 Ahora sabrás exactamente dónde se caen los usuarios en cada ciudad y qué hacer para mejorar! 🚀**
