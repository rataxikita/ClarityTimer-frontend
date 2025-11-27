# 📖 Manual de Usuario - ClarityTimer

**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Aplicación:** ClarityTimer - Temporizador Pomodoro con Gamificación

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Primeros Pasos](#primeros-pasos)
3. [Guía de Uso del Temporizador](#guía-de-uso-del-temporizador)
4. [Sistema de Gamificación](#sistema-de-gamificación)
5. [Gestión de Personajes](#gestión-de-personajes)
6. [Sistema de Notas](#sistema-de-notas)
7. [Estadísticas y Progreso](#estadísticas-y-progreso)
8. [Configuración](#configuración)
9. [Roles y Permisos](#roles-y-permisos)
10. [Solución de Problemas](#solución-de-problemas)

---

## 1. Introducción

### ¿Qué es ClarityTimer?

ClarityTimer es una aplicación web de temporizador Pomodoro con sistema de gamificación basado en personajes Sanrio. Te ayuda a gestionar tu tiempo de estudio de manera productiva mientras ganas puntos y desbloqueas adorables personajes como recompensa.

### Características Principales

- ⏰ **Temporizador Pomodoro** configurable
- 🎮 **Sistema de puntos** por completar sesiones
- 🎭 **10 personajes Sanrio** coleccionables
- 🏪 **Tienda de personajes** para canjear puntos
- 📊 **Estadísticas** de progreso y ranking
- 📝 **Sistema de notas** para organizar ideas
- 👥 **Múltiples roles** (CLIENTE, VENDEDOR, ADMIN)

---

## 2. Primeros Pasos

### 2.1 Acceder a la Aplicación

1. Abre tu navegador web (Chrome, Firefox, Edge o Safari)
2. Navega a: `http://localhost:5173`
3. Verás la página de inicio con opciones de **Login** y **Registro**

### 2.2 Registrarse como Nuevo Usuario

1. Haz clic en el botón **"Registrarse"** o en el enlace **"¿No tienes cuenta? Regístrate"**
2. Completa el formulario con:
   - **Username**: Nombre de usuario único (mínimo 3 caracteres)
   - **Email**: Tu dirección de correo electrónico válida
   - **Contraseña**: Mínimo 6 caracteres
   - **Nombre**: Tu nombre
   - **Apellido**: Tu apellido
3. Haz clic en **"Registrarse"**
4. **¡Bienvenido!** Al registrarte recibirás:
   - 🎁 **600 puntos de bienvenida**
   - 🎭 **Cinnamoroll gratis** (tu primer personaje)
   - 👤 **Rol CLIENTE** (acceso completo a la aplicación)

### 2.3 Iniciar Sesión

1. En la página de inicio, ingresa tu **Username** o **Email**
2. Ingresa tu **Contraseña**
3. Haz clic en **"Iniciar Sesión"**
4. Serás redirigido automáticamente a la aplicación principal

### 2.4 Usuarios de Prueba

El sistema incluye usuarios de prueba preconfigurados:

| Username | Contraseña | Rol | Acceso |
|----------|------------|-----|--------|
| `admin` | `admin123` | ADMIN | Panel de administración completo |
| `vendedor` | `vendedor123` | VENDEDOR | Panel de vendedor |
| `cliente` | `cliente123` | CLIENTE | Aplicación principal |

---

## 3. Guía de Uso del Temporizador

### 3.1 Vista Principal

Al iniciar sesión, verás la **pestaña "⏰ Temporizador"** que incluye:

- **Temporizador grande** con cuenta regresiva (formato MM:SS)
- **Personaje activo** que te acompaña durante el estudio
- **Información de sesión** (sesión actual de total)
- **Progreso diario** (sesiones completadas hoy)
- **Botones de control** (Iniciar, Pausar, Reiniciar)

### 3.2 Configurar el Temporizador

Antes de comenzar, personaliza tus tiempos:

1. Ve a la pestaña **"⚙️ Configuración"**
2. Ajusta los siguientes parámetros:

   **Tiempo de Estudio:**
   - Rango: 1-120 minutos
   - Valor por defecto: 25 minutos
   - Recomendado: 25 minutos (técnica Pomodoro estándar)

   **Tiempo de Descanso:**
   - Rango: 1-60 minutos
   - Valor por defecto: 5 minutos
   - Recomendado: 5 minutos

   **Tiempo de Descanso Largo:**
   - Rango: 1-60 minutos
   - Valor por defecto: 15 minutos
   - Se activa automáticamente cada 4 sesiones completadas

   **Número de Sesiones:**
   - Rango: 1-20 sesiones
   - Valor por defecto: 4 sesiones
   - Define cuántas sesiones de trabajo completarás

   **Modo Automático:**
   - ✅ Activado: El temporizador continúa automáticamente entre fases
   - ❌ Desactivado: Debes iniciar manualmente cada fase

3. Los cambios se guardan automáticamente

### 3.3 Usar el Temporizador

#### Iniciar una Sesión

1. Asegúrate de estar en la pestaña **"⏰ Temporizador"**
2. Verifica que tu personaje activo esté visible
3. Haz clic en el botón **"▶️ Iniciar"**
4. El temporizador comenzará la cuenta regresiva
5. Durante el estudio:
   - Verás el tiempo restante en formato MM:SS
   - Tu personaje activo te acompañará
   - El color cambia según la fase (azul para estudio, rojo para descanso)

#### Controles del Temporizador

**⏸️ Pausar:**
- Detiene el temporizador sin perder el tiempo transcurrido
- Puedes reanudar desde donde pausaste
- Útil para tomar un descanso no programado

**▶️ Reanudar:**
- Continúa el temporizador desde donde se pausó
- Solo aparece cuando el temporizador está pausado

**🔄 Reiniciar:**
- Vuelve al inicio de la sesión actual
- Reinicia el tiempo completo de la fase actual
- No afecta las sesiones completadas anteriormente

### 3.4 Completar Sesiones

#### Sesión de Trabajo (Estudio)

1. Cuando el temporizador llegue a 00:00:
   - Sonará una **notificación** (si está habilitada)
   - Verás un mensaje de completado
   - **Ganarás 10 puntos** automáticamente
   - Los puntos se guardan en la base de datos

2. Si el **Modo Automático** está activado:
   - Comenzará automáticamente el descanso
   - No necesitas hacer nada

3. Si el **Modo Automático** está desactivado:
   - Debes hacer clic en **"▶️ Iniciar"** para comenzar el descanso

#### Sesión de Descanso

1. Los descansos **NO otorgan puntos**
2. Son necesarios para mantener la productividad
3. Puedes pausar o reiniciar el descanso si lo deseas

#### Descanso Largo

- Se activa automáticamente después de completar **4 sesiones de trabajo**
- Duración configurable (por defecto: 15 minutos)
- Te permite un descanso más prolongado para recargar energías

### 3.5 Progreso Diario

En la parte superior del temporizador verás:

- **"Hoy completaste X/Y sesiones"**: Muestra tu progreso del día
- **"Sesión X de Y"**: Indica la sesión actual del ciclo configurado

---

## 4. Sistema de Gamificación

### 4.1 Sistema de Puntos

#### Ganar Puntos

- **+10 puntos** por cada pomodoro de **TRABAJO** completado
- Los descansos **NO otorgan puntos**
- Los puntos se guardan automáticamente en la base de datos

#### Tipos de Puntos

- **Puntos Totales**: Histórico acumulado (nunca disminuye)
- **Puntos Disponibles**: Puntos que puedes gastar en la tienda (disminuyen al comprar)

#### Ver tus Puntos

1. En la parte superior derecha de la pantalla verás: **"💎 X puntos"**
2. También puedes verlos en la pestaña **"📊 Estadísticas"**

### 4.2 Rachas (Streaks)

- Mantén una **racha diaria** completando al menos una sesión cada día
- La racha se muestra en **"📊 Estadísticas"**
- Las rachas largas pueden otorgar bonificaciones futuras

---

## 5. Gestión de Personajes

### 5.1 Personajes Disponibles

ClarityTimer incluye **10 personajes Sanrio** coleccionables:

| Personaje | Precio | Rareza | Descripción |
|-----------|--------|--------|-------------|
| **Cinnamoroll** | Gratis | Común | Tu primer compañero (regalo de bienvenida) |
| **Hello Kitty** | 100 pts | Común | La clásica gatita rosa |
| **My Melody** | 120 pts | Común | Dulce y amigable |
| **Kuromi** | 150 pts | Raro | Rebelde con estilo |
| **Pochacco** | 200 pts | Raro | Deportista y enérgico |
| **Keroppi** | 250 pts | Épico | El ranito aventurero |
| **Badtz-Maru** | 280 pts | Épico | El pingüino cool |
| **Chococat** | 400 pts | Épico | Inteligente y curioso |
| **Gudetama** | 500 pts | Legendario | El huevo perezoso |
| **Aggretsuko** | 600 pts | Legendario | La panda roja metalera |

### 5.2 Comprar Personajes

1. Ve a la pestaña **"🛍️ Tienda"**
2. Verás todos los personajes disponibles para comprar
3. Cada personaje muestra:
   - **Imagen** del personaje
   - **Nombre** y descripción
   - **Precio en puntos** (💎)
   - **Rareza** (Común, Raro, Épico, Legendario)
   - **Botón "Comprar"** (solo si tienes puntos suficientes)

4. Para comprar:
   - Verifica que tengas suficientes puntos disponibles
   - Haz clic en **"Comprar"**
   - El personaje se agregará automáticamente a tu inventario
   - Los puntos se descontarán de tu cuenta
   - Recibirás un **certificado de adopción único**

### 5.3 Gestionar tu Inventario

1. Ve a la pestaña **"🎁 Inventario"**
2. Verás todos los personajes que has desbloqueado
3. Para cada personaje puedes:
   - **Ver información**: Nombre, rareza, fecha de adopción
   - **Activar**: Haz clic en **"Activar"** para que aparezca en el temporizador
   - **Ver certificado**: Haz clic en **"Ver Certificado"** para ver/descargar tu certificado único

4. **Solo un personaje puede estar activo a la vez**
5. El personaje activo aparecerá en la pestaña del temporizador

### 5.4 Certificados de Adopción

Cada personaje comprado incluye un **certificado único**:

- **Código único**: Formato CERT-XXXXXXX
- **Nombre del personaje**
- **Fecha de adopción**
- **Tu nombre de usuario**
- **Descargable/Imprimible**: Puedes guardarlo como recuerdo

Para ver tu certificado:
1. Ve a **"🎁 Inventario"**
2. Selecciona un personaje
3. Haz clic en **"Ver Certificado"**
4. Se abrirá un modal con el certificado
5. Puedes descargarlo o imprimirlo

---

## 6. Sistema de Notas

### 6.1 Crear Notas

1. Ve a la pestaña **"📝 Notas"**
2. Haz clic en el botón **"➕ Nueva Nota"** o **"Crear Nota"**
3. Completa el formulario:
   - **Título**: Título de la nota (opcional)
   - **Contenido**: El texto de tu nota
   - **Categoría**: Selecciona una categoría:
     - 📋 General
     - 📚 Estudio
     - 💤 Descanso
     - 💡 Ideas
     - ✅ Tareas
4. Haz clic en **"Guardar"** o **"Crear"**

### 6.2 Gestionar Notas

En la pestaña **"📝 Notas"** puedes:

**Ver todas tus notas:**
- Las notas se muestran en una lista
- Las notas fijadas aparecen primero
- Puedes filtrar por categoría

**Editar una nota:**
1. Haz clic en la nota que deseas editar
2. Modifica el contenido
3. Haz clic en **"Guardar"**

**Eliminar una nota:**
1. Haz clic en el botón **"🗑️ Eliminar"** de la nota
2. Confirma la eliminación

**Marcar como completada:**
- Haz clic en el checkbox junto a la nota
- La nota se marcará como completada (tachada)

**Fijar una nota:**
- Haz clic en el ícono **"📌"** para fijar
- Las notas fijadas aparecen siempre al inicio de la lista

### 6.3 Categorías de Notas

- **📋 General**: Notas sin categoría específica
- **📚 Estudio**: Ideas, conceptos, resúmenes de estudio
- **💤 Descanso**: Recordatorios para descansos, actividades de relajación
- **💡 Ideas**: Ideas creativas, proyectos futuros
- **✅ Tareas**: Lista de tareas pendientes

---

## 7. Estadísticas y Progreso

### 7.1 Ver Estadísticas

1. Ve a la pestaña **"📊 Estadísticas"**
2. Verás información detallada sobre tu progreso:

**Información Personal:**
- **Puntos Totales**: Histórico acumulado desde que te registraste
- **Puntos Disponibles**: Puntos que puedes gastar ahora
- **Racha Actual**: Días consecutivos usando la aplicación
- **Fecha de Registro**: Cuándo te uniste a ClarityTimer

**Historial de Transacciones:**
- Lista de todas las transacciones de puntos
- Muestra: fecha, tipo (ganado/gastado), cantidad, descripción
- Útil para rastrear tu actividad

**Ranking de Usuarios:**
- Top 10 usuarios con más puntos
- Tu posición en el ranking (si estás en el top 10)
- Motiva la competencia sana

### 7.2 Interpretar tus Estadísticas

- **Puntos Totales vs Disponibles**: La diferencia son los puntos que has gastado en personajes
- **Racha**: Mantén tu racha completando al menos una sesión cada día
- **Ranking**: Compite con otros usuarios por los primeros lugares

---

## 8. Configuración

### 8.1 Acceder a Configuración

1. Ve a la pestaña **"⚙️ Configuración"**
2. Verás todas las opciones personalizables

### 8.2 Opciones de Configuración

**Temporizador:**
- Tiempo de estudio (1-120 minutos)
- Tiempo de descanso (1-60 minutos)
- Tiempo de descanso largo (1-60 minutos)
- Número de sesiones (1-20)
- Modo automático (activar/desactivar)

**Sonidos:**
- **Sonidos habilitados**: Activa/desactiva las notificaciones de sonido
- Cuando está activado, escucharás una campana al completar cada fase

**Tema:**
- Selecciona el tema visual (si está disponible)
- Por defecto: Tema Sanrio (colorido y alegre)

### 8.3 Guardar Configuración

- Los cambios se guardan **automáticamente** al modificar cualquier opción
- No necesitas hacer clic en "Guardar"
- La configuración se sincroniza con el backend

---

## 9. Roles y Permisos

### 9.1 Rol CLIENTE

**Acceso completo a:**
- ⏰ Temporizador Pomodoro
- 🛍️ Tienda de personajes
- 🎁 Inventario de personajes
- 📊 Estadísticas personales
- 📝 Sistema de notas
- ⚙️ Configuración personal

**No tiene acceso a:**
- Panel de administración
- Panel de vendedor
- Gestión de productos
- Gestión de usuarios

### 9.2 Rol VENDEDOR

**Acceso a:**
- Todo lo que tiene CLIENTE
- 🏬 Panel de Vendedor (`/vendedor`):
  - Ver inventario de la tienda
  - Ver historial de adopciones (compras de personajes)
  - Ver estadísticas de usuarios

**No tiene acceso a:**
- Gestión de productos (precios, disponibilidad)
- Gestión de usuarios

### 9.3 Rol ADMIN

**Acceso completo a:**
- Todo lo que tiene CLIENTE (incluyendo la vista principal)
- 🛡️ Panel de Administración:
  - **Pestaña "🛡️ Productos"**: Gestión de personajes
    - Ver todos los personajes (disponibles y no disponibles)
    - Editar precios de personajes
    - Activar/desactivar disponibilidad de personajes
  - **Pestaña "👥 Usuarios"**: Gestión de usuarios
    - Ver todos los usuarios del sistema
    - Editar roles de usuarios (CLIENTE, VENDEDOR, ADMIN)
    - Activar/desactivar usuarios
    - Eliminar usuarios (con validación: no se puede eliminar el último ADMIN)

**Características especiales:**
- ADMIN puede acceder a **todas las rutas**, incluyendo la vista de CLIENTE
- Ve pestañas adicionales en la aplicación principal
- Control total del sistema

---

## 10. Solución de Problemas

### 10.1 Problemas de Conexión

**Síntoma:** La aplicación no se conecta al backend

**Soluciones:**
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Verifica que MySQL esté corriendo y conectado
3. Revisa la consola del navegador (F12) para ver errores
4. Verifica que no haya errores de CORS
5. Limpia la caché del navegador (Ctrl + Shift + R)

### 10.2 Problemas de Autenticación

**Síntoma:** "Token inválido" o "No autorizado"

**Soluciones:**
1. Cierra sesión y vuelve a iniciar sesión
2. Limpia el localStorage del navegador:
   - Abre la consola (F12)
   - Ejecuta: `localStorage.clear()`
   - Recarga la página
3. Verifica que el token JWT no haya expirado (válido por 24 horas)

### 10.3 Los Puntos No Se Guardan

**Síntoma:** Completo pomodoros pero no recibo puntos

**Soluciones:**
1. Verifica que completaste un pomodoro de **TRABAJO** (no descanso)
2. Los descansos no otorgan puntos
3. Revisa la consola del navegador para errores
4. Verifica que el backend esté respondiendo correctamente
5. Revisa tu historial de puntos en **"📊 Estadísticas"**

### 10.4 El Temporizador No Funciona

**Síntoma:** El temporizador no inicia o se detiene

**Soluciones:**
1. Verifica que hayas configurado los tiempos en **"⚙️ Configuración"**
2. Recarga la página (F5)
3. Verifica que no haya errores en la consola del navegador
4. Prueba en otro navegador

### 10.5 No Puedo Comprar Personajes

**Síntoma:** El botón "Comprar" está deshabilitado o da error

**Soluciones:**
1. Verifica que tengas suficientes puntos disponibles
2. Verifica que el personaje esté disponible (no desactivado por ADMIN)
3. Revisa la consola del navegador para mensajes de error
4. Intenta recargar la página

### 10.6 No Veo las Pestañas de Administración

**Síntoma:** Soy ADMIN pero no veo las pestañas "Productos" y "Usuarios"

**Soluciones:**
1. Verifica que tu rol sea realmente ADMIN
2. Cierra sesión y vuelve a iniciar sesión
3. Verifica que estés en la ruta raíz (`/`) y no en `/admin`
4. ADMIN debe acceder a la aplicación principal para ver las pestañas adicionales

### 10.7 Puerto Ocupado

**Síntoma:** Error "Port 5173 is already in use"

**Soluciones (Windows):**
```powershell
# Encontrar el proceso
netstat -ano | findstr :5173

# Terminar el proceso (reemplaza PID_NUMBER con el número que apareció)
taskkill /PID PID_NUMBER /F
```

**Soluciones (Linux/Mac):**
```bash
lsof -ti:5173 | xargs kill -9
```

### 10.8 Problemas con Notas

**Síntoma:** Las notas no se guardan o no aparecen

**Soluciones:**
1. Verifica tu conexión a internet
2. Revisa la consola del navegador para errores
3. Intenta crear una nueva nota
4. Recarga la página

---

## 11. Consejos y Mejores Prácticas

### 11.1 Para Maximizar tu Productividad

1. **Configura tiempos realistas**: No pongas tiempos muy largos al inicio
2. **Usa el modo automático**: Te ayuda a mantener el ritmo
3. **Respeta los descansos**: Son importantes para mantener la concentración
4. **Mantén tu racha**: Completa al menos una sesión cada día
5. **Usa las notas**: Anota ideas importantes durante el estudio

### 11.2 Para Ganar Más Puntos

1. **Completa sesiones de trabajo**: Solo estas otorgan puntos
2. **Mantén tu racha diaria**: Puede otorgar bonificaciones
3. **Usa el temporizador regularmente**: Más sesiones = más puntos

### 11.3 Para Coleccionar Personajes

1. **Ahorra puntos**: No gastes todos tus puntos de inmediato
2. **Prioriza personajes**: Decide cuáles quieres primero
3. **Completa más sesiones**: Más puntos = más personajes

---

## 12. Contacto y Soporte

### 12.1 Reportar Problemas

Si encuentras un error o problema:

1. Revisa la sección **"Solución de Problemas"** de este manual
2. Verifica la consola del navegador (F12) para mensajes de error
3. Contacta al administrador del sistema
4. Proporciona:
   - Descripción del problema
   - Pasos para reproducirlo
   - Capturas de pantalla (si es posible)
   - Mensajes de error de la consola

### 12.2 Sugerencias

¿Tienes ideas para mejorar ClarityTimer?  
Comparte tus sugerencias con el equipo de desarrollo.

---

## 13. Glosario

- **Pomodoro**: Técnica de gestión del tiempo en intervalos de 25 minutos
- **Sesión**: Un ciclo completo de trabajo o descanso
- **Racha (Streak)**: Días consecutivos completando sesiones
- **Puntos Totales**: Histórico acumulado de puntos ganados
- **Puntos Disponibles**: Puntos que puedes gastar en la tienda
- **Personaje Activo**: El personaje que aparece en el temporizador
- **Certificado de Adopción**: Documento único que certifica la compra de un personaje
- **Modo Automático**: El temporizador continúa automáticamente entre fases
- **Descanso Largo**: Descanso prolongado que se activa cada 4 sesiones

---

## 14. Preguntas Frecuentes (FAQ)

### ¿Puedo cambiar mi contraseña?

Actualmente no hay una funcionalidad para cambiar la contraseña desde la interfaz. Contacta al administrador si necesitas cambiar tu contraseña.

### ¿Puedo transferir puntos a otro usuario?

No, los puntos no son transferibles entre usuarios.

### ¿Qué pasa si elimino mi cuenta?

Contacta al administrador para eliminar tu cuenta. Todos tus datos, puntos y personajes se eliminarán permanentemente.

### ¿Puedo tener múltiples personajes activos?

No, solo puedes tener un personaje activo a la vez. Puedes cambiar el personaje activo en cualquier momento desde el inventario.

### ¿Los puntos expiran?

No, los puntos no expiran. Puedes acumularlos y gastarlos cuando quieras.

### ¿Puedo usar ClarityTimer sin conexión a internet?

No, ClarityTimer requiere conexión a internet para funcionar, ya que se conecta al backend para guardar tu progreso.

### ¿Cómo cambio mi rol?

Solo un ADMIN puede cambiar roles de usuarios. Si necesitas cambiar tu rol, contacta a un administrador.

---

## 15. Actualizaciones y Versiones

### Versión 1.0 (Noviembre 2025)

**Características iniciales:**
- Temporizador Pomodoro funcional
- Sistema de puntos y gamificación
- 10 personajes Sanrio coleccionables
- Tienda e inventario de personajes
- Sistema de notas
- Estadísticas y ranking
- Sistema de roles (CLIENTE, VENDEDOR, ADMIN)
- Panel de administración
- Panel de vendedor
- Gestión de usuarios (ADMIN)

---

