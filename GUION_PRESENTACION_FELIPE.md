
## ClarityTimer - Presentación Técnica

**Duración Total:** 6-7 minutos

---

## 📋 MIN 0:00-0:30 | INTRODUCCIÓN

### Lo que DICES:

> 
> La aplicación está desarrollada en React 19 con TypeScript. Yo desarrollé todo el código del frontend, por lo que presentaré las partes técnicamente más complejas: la arquitectura de estado, el sistema de autenticación, y la lógica del temporizador. Mi compañero les mostrará la interfaz de usuario y la experiencia del usuario final."

### Lo que MUESTRAS:
- **Pantalla:** App corriendo en `localhost:5173`
- **Acción:** Hacer un pan rápido por la interfaz (sin detenerte)

### ⏱️ Timing: 30 segundos exactos

---

## 📋 MIN 0:30-1:00 | STACK TECNOLÓGICO

### Lo que DICES:
> "Primero, déjenme mostrarles el stack tecnológico que elegí y por qué."

### Acciones:
1. **[ABRIR: `package.json`]**
   - **Decir:** "Usamos React 19 con TypeScript para tener type safety en tiempo de compilación. Esto significa que muchos errores se detectan antes de ejecutar el código."
   
2. **Continuar:**
   - "Vite como build tool, que es entre 10 y 100 veces más rápido que Create React App. Hablamos de 300 milisegundos de inicio versus 30 a 60 segundos. Esto hace el desarrollo mucho más ágil."
   - "Axios con interceptores para centralizar toda la autenticación. Ningún servicio maneja tokens manualmente."
   - "React Router v7 para el routing."
   - "Context API para el estado global. Elegí esto en vez de Redux porque para 3 contextos, Context API es más simple, sin dependencias externas, y más fácil de mantener."
   - "Y Zod para validación en runtime, algo que TypeScript no puede hacer porque desaparece al compilar."

3. **[MOSTRAR: Estructura `src/`]**
   - **Decir:** "La arquitectura está organizada en: `components/` para componentes reutilizables, `pages/` para páginas completas, `contexts/` para estado global, `services/` para comunicación con backend, y `constants/` para configuración."

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 1:00-3:00 | ESTADO GLOBAL - LO MÁS COMPLEJO

### Lo que DICES:
> "Ahora vamos a la parte más compleja: la gestión de estado global."

---

### 1. AuthContext (30 segundos)

**[ABRIR: `contexts/AuthContext.tsx`]**

**Decir:**
> "Tenemos tres contextos. El primero es AuthContext, que maneja toda la autenticación: el usuario actual, el token JWT, login y logout."

**[SEÑALAR: línea 32-44 - useEffect que carga desde localStorage]**
> "Aquí ven que al cargar la aplicación, recuperamos el token y el usuario desde localStorage. Esto permite que la sesión persista aunque recargues la página."

**[SEÑALAR: línea 56-59 - función logout]**
> "Y cuando el usuario cierra sesión, limpiamos todo el estado y redirigimos al login."

---

### 2. TimerContext - EL MÁS COMPLEJO (90 segundos)

**[ABRIR: `contexts/TimerContext.tsx` - SCROLL al inicio]**

**Decir:**
> "El segundo contexto es TimerContext, y este es el más complejo de todo el proyecto.
> 
> Maneja múltiples estados simultáneos: minutos, segundos, si está corriendo, si está pausado, si estamos en trabajo o descanso, y en qué sesión vamos."

**[SEÑALAR: línea 62-63 - horaInicioRef]**
> "Aquí usamos `useRef` en vez de `useState` para `horaInicio` porque necesitamos que persista entre renders pero sin causar re-renders innecesarios. Esto es una optimización importante."

**[SCROLL al useEffect del timer - línea 140-204]**
> "Este es el corazón del temporizador. Cada segundo, decrementa el contador."

**[SEÑALAR: línea 169 - setInterval]**
> "Ven que usamos `setInterval` que se ejecuta cada segundo."

**[SEÑALAR: línea 178-181 - cuando llega a 0:0]**
> "Cuando llega a 0:0, llama a `handleEndOfPeriod`."

**[SEÑALAR: línea 194-203 - cleanup function]**
> "Y aquí en el cleanup, limpiamos el interval para evitar memory leaks. Esto es crítico."

**[SCROLL a handleEndOfPeriod - línea 214-342]**
> "Ahora, la función más compleja: `handleEndOfPeriod`. Son 120 líneas de código que manejan qué pasa cuando termina un período."

**[SEÑALAR mientras explicas]**
> "Hace tres cosas en orden:
> 
> **PRIMERO:** Guarda la sesión en el backend con todos los datos: fecha, hora de inicio, hora de fin, tipo de sesión (trabajo o descanso), y duración en minutos.
> 
> **SEGUNDO:** Maneja la transición. Si terminó una sesión de TRABAJO, incrementa el número de sesión. Si la sesión es múltiplo de 4, activa descanso largo. Si no, descanso corto. Si terminó un DESCANSO, vuelve a trabajo.
> 
> **TERCERO:** Respeta el modo automático. Si el usuario tiene activado el modo automático, continúa automáticamente. Si no, pausa y espera que el usuario presione play.
> 
> Esta función integra TODO: usa Settings para saber los tiempos, usa Axios para guardar en backend, y actualiza el estado completo del timer."

**[SEÑALAR: línea 364-369 - flushSync]**
> "Y aquí ven que usamos `flushSync` de React. Esto fuerza actualizaciones síncronas en vez de asíncronas. Normalmente React agrupa las actualizaciones para optimizar, pero en un timer necesitamos exactitud. Sin `flushSync`, podríamos tener desincronización."

---

### 3. SettingsContext (30 segundos)

**[ABRIR: `contexts/SettingsContext.tsx`]**

**Decir:**
> "El tercer contexto es SettingsContext, que maneja la configuración del usuario."

**[SEÑALAR: línea 142 - useState con función]**
> "Aquí usamos lazy initialization. En vez de pasar un valor directo a `useState`, pasamos una función. Esto significa que solo se ejecuta una vez al montar, no en cada render. Carga desde localStorage o usa defaults."

**[SEÑALAR: línea 103-120 - loadSettingsFromStorage con safeParse]**
> "Y cuando cargamos desde localStorage, usamos `safeParse` de Zod. Si los datos son inválidos, usamos los defaults. Esto protege contra datos corruptos."

**[SEÑALAR: línea 153-166 - updateSettings]**
> "Y este `useEffect` sincroniza automáticamente cualquier cambio de configuración con localStorage. El usuario cambia algo, se guarda automáticamente."

---

### Conexión de Contextos (30 segundos)

**[ABRIR: `App.tsx` - SEÑALAR providers anidados - línea 181-183]**

**Decir:**
> "Y aquí ven cómo se conectan los contextos. Están anidados: `AuthProvider` envuelve todo, luego `SettingsProvider`, luego `TimerProvider`.
> 
> Esto es importante porque `TimerContext` usa `SettingsContext` para saber cuántos minutos configuró el usuario. Hay una dependencia.
> 
> Y para consumirlos, usamos hooks personalizados: `useAuth()`, `useSettings()`, `useTimer()`. Cualquier componente puede acceder al estado global con una línea."

### ⏱️ Timing: 2 minutos total

---

## 📋 MIN 3:00-4:00 | AUTENTICACIÓN

### Lo que DICES:
> "Ahora hablemos de autenticación. Implementé un sistema de tres capas: JWT, Interceptores de Axios, y RoleRoute."

---

### Axios Interceptors (30 segundos)

**[ABRIR: `services/api.ts`]**

**[SEÑALAR: línea 15-26 - request interceptor]**
> "Este interceptor se ejecuta antes de cada petición HTTP. Automáticamente inyecta el token JWT en el header `Authorization` de TODAS las peticiones."

**[SEÑALAR: línea 28-40 - response interceptor]**
> "Y este se ejecuta después de cada respuesta. Si detecta un error 401 (no autorizado), significa que el token expiró. Automáticamente limpia el estado y redirige al login. También maneja 403 (prohibido) y errores 500+.
> 
> Esto centraliza TODO el manejo de autenticación. Ningún servicio individual tiene que preocuparse por tokens."

---

### Servicios (15 segundos)

**[ABRIR: carpeta `services/`]**

**Decir:**
> "Todos los servicios heredan este comportamiento: `sesionService`, `personajeService`, `noteService`. Ninguno maneja autenticación manualmente. Solo hacen `api.get()` o `api.post()` y los interceptores se encargan del resto."

---

### RoleRoute (30 segundos)

**[ABRIR: `components/RoleRoute.tsx`]**

**Decir:**
> "Y para proteger rutas según el rol del usuario, tenemos `RoleRoute`.
> 
> Verifica permisos. Si no hay usuario, redirige al login. Si el usuario tiene un rol que no está permitido, redirige a su dashboard correspondiente."

**[ABRIR: `App.tsx` - rutas - línea 189-217]**
> "Aquí ven cómo se usa: `/admin` solo para ADMIN, `/vendedor` para VENDEDOR y ADMIN, y la raíz solo para CLIENTE.
> 
> **IMPORTANTE:** Esto es solo para UX. La verdadera seguridad está en el backend, que valida el JWT en cada petición. Si alguien manipula el frontend, no puede hacer acciones no autorizadas."

### ⏱️ Timing: 1 minuto

---

## 📋 MIN 4:00-4:30 | VITE

### Lo que DICES:
> "Hablemos de Vite porque la diferencia de velocidad es abismal.
> 
> Con Create React App, el inicio en desarrollo toma entre 30 y 60 segundos. Con Vite, son 300 milisegundos.
> 
> El hot reload (cuando guardas un archivo) con CRA toma 2 a 3 segundos. Con Vite, 50 a 100 milisegundos.
> 
> ¿Por qué? Porque Vite no bundlea en desarrollo. Usa ES modules nativos del navegador. Solo bundlea para producción usando Rollup."

**[ABRIR: `vite.config.ts` - línea 20-29]**
> "Aquí configuré un proxy. Todas las peticiones a `/api/` se redirigen automáticamente a `localhost:8080/api/v1/`. Esto evita problemas de CORS en desarrollo."

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 4:30-5:00 | ZOD

### Lo que DICES:
> "Ahora, Zod. Zod es validación en runtime.
> 
> El problema con TypeScript es que solo existe en tiempo de compilación. Cuando el código se ejecuta, TypeScript desaparece. No hay validación.
> 
> Pero cuando cargas datos de localStorage, de una API, o de un formulario, necesitas validar que sean correctos."

**[ABRIR: `constants/settings.ts` - línea 84-109 - schema de settings]**
> "Aquí definimos un schema de Zod para Settings. Cada campo tiene constraints: `studyTime` debe ser un número entre 1 y 60. Cada campo tiene un `.default()` por si falta."

**[ABRIR: `contexts/SettingsContext.tsx` - línea 103-120 - safeParse]**
> "Cuando cargamos desde localStorage, usamos `safeParse`. Si los datos son inválidos, usamos los defaults. Esto protege contra datos corruptos."

**[ABRIR: `contexts/SettingsContext.tsx` - línea 153-166 - submit]**
> "Y antes de guardar configuración del usuario, validamos con Zod.
> 
> Las ventajas: DRY (defines el schema una vez), type safety (con `z.infer<typeof schema>` TypeScript conoce los tipos), y protección en runtime."

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 5:00-5:30 | FEATURES COMPLEJAS

### Lo que DICES:
> "Rápidamente, tres features complejas:"

---

### NotesManager (15 segundos)

**[ABRIR: `components/NotesManager.tsx` - SEÑALAR línea 95-104 - sorting]**

**Decir:**
> "NotesManager tiene filtrado por categoría y ordenamiento multinivel: primero las notas fijadas, luego por fecha descendente. Usa actualizaciones optimistas: actualiza la UI inmediatamente, luego confirma con el backend."

---

### AdminDashboard (10 segundos)

**[ABRIR: `components/AdminDashboard.tsx` - SEÑALAR línea 27-36 - handleToggleAvailability]**

**Decir:**
> "AdminDashboard permite edición inline de precios y toggle de disponibilidad. Usa `map()` para actualizaciones inmutables del estado."

---

### Certificados (5 segundos)

**[ABRIR: `components/CertificateModal.tsx` - línea 16-18]**

**Decir:**
> "Y los certificados se generan dinámicamente como HTML y se imprimen usando `window.print()`."

### ⏱️ Timing: 30 segundos

---

## 📋 MIN 5:30-6:30 | DEMO - PARTES TÉCNICAS

### Lo que DICES y HACES:

> "Ahora una demo rápida de las partes técnicas."

---

### 1. Login y Tokens (30 segundos)

**Acciones:**
1. **[IR A LOGIN]**
2. **[HACER LOGIN]**
3. **[ABRIR: DevTools → Application → Local Storage]**

**Decir:**
> "Aquí ven el token JWT guardado en localStorage. Y los datos del usuario. Este token se incluye automáticamente en TODAS las peticiones al backend."

---

### 2. Timer (45 segundos)

**Acciones:**
1. **[IR AL TIMER]**
2. **[IR A SETTINGS - CAMBIAR A 1 MINUTO]**
3. **[VOLVER AL TIMER]**
4. **[INICIAR TIMER]**
5. **[ESPERAR A QUE LLEGUE A 0]**

**Decir:**
> "Cuando llega a cero, ven que automáticamente guarda la sesión en el backend, actualiza los puntos del usuario, y transiciona a descanso. Todo esto lo hace `handleEndOfPeriod`."

---

### 3. Network Tab (30 segundos)

**Acciones:**
1. **[ABRIR: DevTools → Network]**
2. **[HACER ALGUNA ACCIÓN QUE LLAME AL BACKEND]**
3. **[CLICK EN LA REQUEST]**
4. **[SEÑALAR: Headers → Authorization: Bearer …]**

**Decir:**
> "Aquí en el Network tab ven todas las peticiones. Y si abren cualquiera, ven el header `Authorization: Bearer [token]`. Esto lo inyectó el interceptor automáticamente."

---

### 4. Admin (25 segundos)

**Acciones:**
1. **[HACER LOGOUT]**
2. **[LOGIN CON ADMIN]**
3. **[IR A `/admin`]**
4. **[CAMBIAR UN PRECIO]**
5. **[TOGGLE DISPONIBILIDAD]**

**Decir:**
> "Como admin, puedo cambiar precios y disponibilidad. Ven que la UI se actualiza inmediatamente. Eso es actualización optimista."

### ⏱️ Timing: 2 minutos y 10 segundos (ajustar según necesites)

---

## 📋 MIN 6:30-7:00 | CIERRE

### Lo que DICES:

> "Para resumir lo que vimos:
> 
> - Implementé tres contextos para estado global: Auth, Settings, y Timer.
> - Axios Interceptors para centralizar autenticación.
> - Vite para desarrollo ultra-rápido.
> - Zod para validación en runtime.
> - TypeScript para type safety en compilación.
> - Y una arquitectura escalable con separación clara de responsabilidades.
> 
> Los logros técnicos incluyen: la función `handleEndOfPeriod` de 120 líneas que orquesta todo, un sistema de 3 roles con permisos, sincronización bidireccional con el backend, y actualizaciones optimistas en la UI.
> 
> Ahora mi compañero les mostrará la interfaz de usuario y la experiencia del usuario final. Gracias."

### ⏱️ Timing: 30 segundos

---

## 📁 ARCHIVOS A TENER ABIERTOS (EN PESTAÑAS)

### Orden de importancia:

1. ✅ **`contexts/TimerContext.tsx`** (MÁS IMPORTANTE - pasarás más tiempo aquí)
2. ✅ **`services/api.ts`** (IMPORTANTE - interceptores)
3. ✅ **`contexts/AuthContext.tsx`**
4. ✅ **`contexts/SettingsContext.tsx`**
5. ✅ **`App.tsx`** (para mostrar providers y rutas)
6. ✅ **`components/RoleRoute.tsx`**
7. ✅ **`components/NotesManager.tsx`**
8. ✅ **`components/AdminDashboard.tsx`**
9. ✅ **`constants/settings.ts`** (schema de Zod)
10. ✅ **`vite.config.ts`**
11. ✅ **`package.json`**

---

## 🎯 PUNTOS CLAVE A RECORDAR

### Durante la presentación:

1. **TimerContext es lo más complejo** - Dedica tiempo aquí
2. **Interceptores centralizan autenticación** - Muestra cómo ningún servicio maneja tokens
3. **flushSync es importante** - Explica por qué se necesita en el timer
4. **Zod vs TypeScript** - Diferencia entre compilación y runtime
5. **Vite es rápido** - Menciona números específicos (300ms vs 30-60s)
6. **Actualizaciones optimistas** - Menciona en NotesManager y AdminDashboard
7. **RoleRoute es UX, backend es seguridad** - Aclara esto

### Tips:

- Busca comentarios con `🎯 PRESENTACIÓN:` para encontrar puntos clave rápidamente
- Los números de línea pueden variar, usa Ctrl+F para buscar funciones específicas
- Mantén el ritmo: 30 segundos por sección aproximadamente
- Si te quedas sin tiempo, prioriza TimerContext y los Interceptores

---

## ✅ CHECKLIST PRE-PRESENTACIÓN

- [ ] Tener todos los archivos abiertos en pestañas
- [ ] App corriendo en `localhost:5173`
- [ ] DevTools abierto (Application y Network tabs)
- [ ] Tener un usuario de prueba (CLIENTE) listo para login
- [ ] Tener un usuario ADMIN listo para login
- [ ] Timer configurado a 1 minuto para demo rápida
- [ ] Revisar que los comentarios `🎯 PRESENTACIÓN:` sean visibles
- [ ] Probar que el timer funciona antes de empezar
- [ ] Tener el guión visible en otra pantalla o impreso

---

**¡Éxito en tu presentación! 🚀**

