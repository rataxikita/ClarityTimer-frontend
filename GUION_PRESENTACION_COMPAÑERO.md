# 🎨 Guión Detallado - Compañero (Parte Visual/Simple)
## ClarityTimer - Presentación de Interfaz de Usuario

**Duración Total:** 3-4 minutos

---

## 📋 CONTEXTO IMPORTANTE

### Presentación Total:
- **Total:** 10 minutos + 5 minutos Q&A
- **Felipe (Parte Compleja):** 6-7 minutos
- **Tú (Parte Visual):** 3-4 minutos

### Tu Responsabilidad:
- Mostrar los componentes de interfaz y páginas básicas
- **Enfócate en CÓMO SE VE, no en cómo funciona**

---

## 📋 MIN 0:00-0:30 | TU INTRODUCCIÓN

### Lo que DICES:

> "Hola, ahora voy a mostrarles los componentes de interfaz de usuario de ClarityTimer.
> 
> Mientras Felipe les mostró la arquitectura técnica compleja, yo me enfocaré en las partes visuales: los componentes con los que el usuario interactúa directamente, las páginas principales, y cómo diseñamos la interfaz para que sea intuitiva y responsive."

### Lo que MUESTRAS:
- **Pantalla:** App en la página principal (Timer)
- **Acción:** Un vistazo rápido sin detenerte

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 0:30-1:30 | COMPONENTES BÁSICOS UI

### Lo que DICES:

> "Empecemos con los componentes básicos de UI. Estos son componentes presentacionales, es decir, solo muestran información visualmente sin lógica compleja."

---

### 1. Character.tsx - Tarjeta de Personaje (20 segundos)

**[ABRIR: `components/Character.tsx` - MOSTRAR el JSX/return]**

**Decir:**
> "Este es el componente Character, que muestra la tarjeta de un personaje Sanrio.
> 
> **[SEÑALAR el código visual]**
> 
> Recibe como props el nombre, la imagen, la descripción y el precio del personaje.
> 
> Y simplemente los muestra de forma visual: la imagen arriba, el nombre como título, la descripción, y el precio en puntos.
> 
> Es un componente presentacional puro: recibe datos y los renderiza. No tiene lógica compleja."

---

### 2. PuntosWidget.tsx - Display de Puntos (20 segundos)

**[ABRIR: `components/PuntosWidget.tsx`]**

**Decir:**
> "El PuntosWidget muestra los puntos disponibles del usuario en la esquina superior de la aplicación.
> 
> **[SEÑALAR en la app funcionando]**
> 
> Aquí ven el widget en acción. Lee del contexto de autenticación cuántos puntos tiene el usuario y los muestra con un ícono de diamante y el número.
> 
> **[SEÑALAR el código]**
> 
> El código es simple: obtiene `user.puntosDisponibles` del contexto y lo muestra con estilos de gradiente."

---

### 3. GlobalStatusIndicator.tsx (20 segundos)

**[ABRIR: `components/GlobalStatusIndicator.tsx`]**

**Decir:**
> "Y el GlobalStatusIndicator es un indicador visual que muestra si estás en modo trabajo o descanso.
> 
> **[MOSTRAR en la app]**
> 
> Cuando el timer está corriendo, aparece este indicador flotante. Cambia de color según el estado: azul para trabajo, verde para descanso.
> 
> Lee del TimerContext si estamos en break o no, y cambia el color y el emoji automáticamente. Es puramente visual."

### ⏱️ Timing: 1 minuto total

---

## 📋 MIN 1:30-2:15 | PÁGINAS DE AUTENTICACIÓN

### Lo que DICES:

> "Ahora las páginas de autenticación."

---

### Login.tsx (20 segundos)

**[ABRIR: `pages/Login.tsx` - ENFÓCATE EN EL JSX/VISUAL]**

**Decir:**
> "La página de Login es un formulario simple con dos campos: username y password, y un botón de submit.
> 
> **[SEÑALAR los inputs en el código]**
> 
> Los estilos están hechos con CSS Modules, que les mostraré en un momento. Si hay errores de validación, se muestran debajo de los campos en rojo.
> 
> **[MOSTRAR en la app]**
> 
> Así se ve en la aplicación: limpio, simple, y directo."

---

### Register.tsx (25 segundos)

**[ABRIR: `pages/Register.tsx` - PARTE VISUAL]**

**Decir:**
> "El Register es similar pero con más campos: username, email, password, confirmar password, nombre y apellido.
> 
> **[SEÑALAR los inputs]**
> 
> Cada input tiene validación visual. Si las contraseñas no coinciden, muestra un error. Si el email no es válido, también.
> 
> **[SEÑALAR el link a login]**
> 
> Y abajo tiene un link para volver al login si ya tienes cuenta.
> 
> **[MOSTRAR en la app]**
> 
> Aquí está en acción."

### ⏱️ Timing: 45 segundos total

---

## 📋 MIN 2:15-3:00 | PÁGINAS PRINCIPALES

### Lo que DICES:

> "Ahora las páginas principales de la aplicación."

---

### Timer.tsx (15 segundos)

**[ABRIR: `components/Timer.tsx` - COMPONENTE VISUAL]**

**[MOSTRAR en la app]**

**Decir:**
> "La página del Timer muestra el reloj grande con minutos y segundos.
> 
> Tiene tres botones: Iniciar, Pausar, y Resetear. Muestra en qué sesión vas, y si estás en modo trabajo o descanso.
> 
> El tiempo y la lógica vienen del TimerContext que Felipe explicó. Yo solo muestro visualmente esos datos."

---

### Settings.tsx (15 segundos)

**[ABRIR: `components/Settings.tsx` - FORMULARIO]**

**[MOSTRAR en la app]**

**Decir:**
> "Settings es un formulario para ajustar las preferencias del timer.
> 
> Inputs numéricos para tiempo de trabajo, tiempo de descanso, y número de sesiones. Checkboxes para modo automático y sonido. Un selector de tema. Y un botón para guardar.
> 
> Todo se guarda automáticamente en localStorage."

---

### TiendaPersonajes.tsx (10 segundos)

**[ABRIR: `components/TiendaPersonajes.tsx`]**

**[MOSTRAR en la app]**

**Decir:**
> "La Tienda muestra un grid de personajes disponibles para comprar.
> 
> Usa el componente Character.tsx que vimos antes. Cada tarjeta muestra el precio en puntos y un botón 'Adoptar'."

---

### Inventario.tsx (10 segundos)

**[MOSTRAR en la app]**

**Decir:**
> "El Inventario muestra los personajes que ya adoptaste.
> 
> Grid similar a la tienda, pero con un botón para ver el certificado de adopción.
> 
> Si no tienes personajes, muestra un mensaje: 'Aún no tienes personajes'."

---

### Statistics.tsx (10 segundos)

**[MOSTRAR en la app]**

**Decir:**
> "Y Statistics muestra tus estadísticas: total de sesiones de trabajo y descanso, puntos ganados, y un historial de sesiones.
> 
> Todo presentado con tarjetas y números grandes para fácil lectura."

### ⏱️ Timing: 1 minuto total (ajustable)

---

## 📋 MIN 3:00-3:30 | ESTILOS - INLINE STYLES

### Lo que DICES:

**[ABRIR: `components/Timer.tsx` - SEÑALAR los objetos de estilo]**

**Decir:**
> "Rápidamente, los estilos. Usamos estilos inline con objetos de JavaScript.
> 
> **[SEÑALAR un ejemplo de estilo inline en el código]**
> 
> Cada componente define sus estilos como objetos dentro del JSX. Por ejemplo, aquí ven `style={{ padding: '20px', borderRadius: '15px' }}`.
> 
> Esto tiene ventajas: los estilos están co-localizados con el componente, es fácil ver qué estilos aplican a cada elemento, y no hay conflictos de nombres porque cada objeto es único.
> 
> **[SEÑALAR estilos condicionales]**
> 
> También podemos usar estilos condicionales basados en props o estado. Por ejemplo, el color cambia según si estamos en break o no: `color: isBreak ? '#ff6b6b' : '#4ecdc4'`.
> 
> Para responsive design, usamos media queries en estilos globales o calculamos valores dinámicamente según el tamaño de pantalla."

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 3:30-4:00 | DEMO - PARTE VISUAL

### Lo que DICES y HACES:

> "Ahora una demo rápida de la parte visual."

---

### 1. Navegación por la App (30 segundos)

**[NAVEGAR mostrando cada página]**

**Decir:**
> "Voy a navegar rápidamente por todas las páginas para que vean cómo se ve todo junto.
> 
> **[CLICK en Timer]** Timer: el reloj grande, botones claros.
> 
> **[CLICK en Settings]** Settings: formulario limpio y organizado.
> 
> **[CLICK en Tienda]** Tienda: grid de personajes, todo visual.
> 
> **[CLICK en Inventario]** Inventario: mis personajes adoptados.
> 
> **[CLICK en Estadísticas]** Estadísticas: números y progreso visual."

---

### 2. Responsive Design (30 segundos)

**[ABRIR: DevTools → Toggle Device Toolbar (Ctrl+Shift+M)]**

**[CAMBIAR entre Mobile, Tablet, Desktop]**

**Decir:**
> "Y ahora el diseño responsive.
> 
> **[MOSTRAR en Mobile]** En móvil: todo en una columna, botones grandes para fácil toque.
> 
> **[MOSTRAR en Tablet]** En tablet: grid de 2 columnas.
> 
> **[MOSTRAR en Desktop]** En desktop: grid de 3 a 4 columnas, aprovecha el espacio.
> 
> Todo se adapta automáticamente gracias a las media queries en CSS."

### ⏱️ Timing: 1 minuto total

---

## 📋 MIN 4:00-4:15 | CIERRE

### Lo que DICES:

> "Para resumir, estos son los componentes visuales de ClarityTimer:
> 
> - **Componentes presentacionales:** Character, PuntosWidget, StatusIndicator - solo muestran datos.
> - **Formularios:** Login, Register, Settings - inputs y validación visual.
> - **Páginas principales:** Timer, Tienda, Inventario, Estadísticas - toda la interfaz de usuario.
> - **Estilos inline** - co-localizados con componentes, sin conflictos.
> - **Responsive design** - se adapta a móvil, tablet y desktop.
> 
> Todo diseñado para ser intuitivo y fácil de usar.
> 
> Ahora podemos responder sus preguntas. Gracias."

### ⏱️ Timing: 15 segundos

---

## 📁 ARCHIVOS QUE DEBES TENER ABIERTOS

### En orden de presentación:

1. ✅ **`components/Character.tsx`**
2. ✅ **`components/PuntosWidget.tsx`**
3. ✅ **`components/GlobalStatusIndicator.tsx`**
4. ✅ **`pages/Login.tsx`**
5. ✅ **`pages/Register.tsx`**
6. ✅ **`components/Timer.tsx`**
7. ✅ **`components/Settings.tsx`**
8. ✅ **`components/TiendaPersonajes.tsx`**
9. ✅ **`components/Inventario.tsx`**
10. ✅ **`components/Statistics.tsx`**
11. ✅ **`src/index.css`** (estilos globales)

---

## 🎯 PUNTOS CLAVE A RECORDAR

### Durante la presentación:

1. **Enfócate en LO VISUAL** - No expliques lógica compleja, solo cómo se ve
2. **Componentes presentacionales** - Menciona que reciben props y renderizan
3. **CSS Modules** - Explica el scope local y evitar conflictos
4. **Responsive Design** - Muestra las media queries en acción
5. **Validación visual** - Menciona cómo se muestran los errores en formularios
6. **Grid layouts** - Explica cómo se organizan los personajes en la tienda/inventario
7. **Mantén el ritmo** - 20-30 segundos por componente/página

### Tips:

- **NO entres en detalles técnicos** - Eso es trabajo de Felipe
- **Muestra la app funcionando** - Es más visual que solo código
- **Usa DevTools** - Para mostrar responsive design
- **Navega entre páginas** - Para mostrar el flujo completo
- **Señala elementos visuales** - Colores, tamaños, layouts
- **Menciona UX** - Cómo se siente usar la aplicación

---

## ✅ CHECKLIST PRE-PRESENTACIÓN

- [ ] Tener todos los archivos abiertos en pestañas
- [ ] App corriendo en `localhost:5173`
- [ ] Estar logueado con un usuario de prueba
- [ ] Tener algunos personajes en el inventario (para mostrar)
- [ ] Tener puntos disponibles (para mostrar el widget)
- [ ] Timer funcionando (para mostrar el StatusIndicator)
- [ ] DevTools abierto con Device Toolbar listo
- [ ] Navegador en tamaño desktop inicialmente
- [ ] Revisar que todas las páginas carguen correctamente
- [ ] Tener el guión visible en otra pantalla o impreso
- [ ] Probar la navegación entre páginas antes de empezar

---

## 🎨 ELEMENTOS VISUALES A DESTACAR

### Colores y Temas:
- **Gradientes:** Menciona los gradientes usados (púrpura, azul, etc.)
- **Temas:** Menciona que hay múltiples temas disponibles
- **Estados visuales:** Colores para trabajo vs descanso

### Layouts:
- **Grid system:** Cómo se organizan los personajes
- **Cards:** Diseño de tarjetas para personajes
- **Formularios:** Layout limpio y organizado

### Interactividad:
- **Hover effects:** Efectos al pasar el mouse
- **Transiciones:** Animaciones suaves
- **Feedback visual:** Cómo responde la UI a las acciones

### Responsive:
- **Breakpoints:** Menciona los puntos de quiebre (mobile, tablet, desktop)
- **Adaptación:** Cómo cambian los layouts según el tamaño

---

## 📝 NOTAS ADICIONALES

### Si te preguntan sobre lógica:
> "Esa parte la explicó Felipe. Yo me enfoco en la presentación visual."

### Si te preguntan sobre estilos específicos:
> "Usamos estilos inline con objetos de JavaScript. Esto mantiene los estilos co-localizados con cada componente, facilitando el mantenimiento y evitando conflictos de nombres."

### Si te preguntan sobre responsive:
> "Usamos estilos inline que se adaptan dinámicamente, y también tenemos estilos globales en `index.css` con media queries para breakpoints específicos."

### Si te preguntan sobre accesibilidad:
> "Los componentes usan semántica HTML apropiada y contraste adecuado. Los botones tienen estados hover y focus visibles."

---

## 🚀 TRANSICIÓN DESDE FELIPE

### Cuando Felipe termine:

> "Perfecto, ahora voy a mostrarles cómo se ve todo esto desde la perspectiva del usuario final. Mientras Felipe les explicó la arquitectura técnica, yo les mostraré los componentes visuales y la experiencia de usuario."

---

**¡Éxito en tu presentación! 🎨**

