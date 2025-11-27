# ⏱️ ClarityTimer Frontend

Aplicación frontend de temporizador Pomodoro con temática Sanrio y sistema de gamificación, diseñada para hacer tu tiempo de estudio más agradable y productivo.

## ✨ Características

- ⏰ **Temporizador Pomodoro**: Configurable con tiempos de estudio y descanso personalizables
- 🎭 **Personajes Sanrio**: Colecciona y usa personajes adorables durante tus sesiones
- 🎮 **Sistema de Gamificación**: Gana puntos completando pomodoros y desbloquea personajes
- 🏪 **Tienda de Personajes**: Canjea tus puntos por nuevos compañeros de estudio
- 📜 **Certificados de Adopción**: Cada personaje incluye un certificado único descargable
- 📊 **Estadísticas**: Visualiza tu progreso, rachas y ranking
- 🔐 **Autenticación**: Sistema de login y registro con JWT
- 👥 **Sistema de Roles**: CLIENTE, VENDEDOR y ADMIN con diferentes niveles de acceso
- 🛡️ **Panel de Administrador**: Gestión de productos (precios y disponibilidad)
- 🏬 **Panel de Vendedor**: Inventario de tienda y registro de adopciones
- 📝 **Sistema de Notas**: Toma y organiza notas durante tus sesiones de estudio
- ⚙️ **Configuración Completa**: Personaliza todos los aspectos de tu experiencia
- 🔄 **Modo Automático**: Continúa automáticamente entre fases o pausa manualmente

## 🚀 Instalación y Uso

### Requisitos Previos

- **Node.js 18+** - [Descargar Node.js](https://nodejs.org/)
- **npm 9+** (incluido con Node.js)
- **Backend de ClarityTimer** ejecutándose en `http://localhost:8080`

### Instalación Paso a Paso

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ClarityTimer-frontend.git
cd ClarityTimer-frontend
```

#### 2. Instalar Dependencias
```bash
npm install
```

Este comando instalará todas las dependencias necesarias incluyendo:
- React 18
- TypeScript
- Vite
- Axios para comunicación con el backend
- Y más...

#### 3. Configurar la URL del Backend

Verifica que el archivo `src/services/api.ts` apunte al backend correcto:

```typescript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

#### 4. Ejecutar en Modo Desarrollo

**Opción A: Usando npm**
```bash
npm run dev
```

**Opción B: Usando el script de PowerShell (Windows)**
```powershell
.\run-frontend.ps1
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

#### 5. Verificar que el Frontend está Funcionando

1. Abre tu navegador en `http://localhost:5173`
2. Deberías ver la página de login/registro
3. Si el backend está corriendo, podrás registrarte y usar la aplicación ✅

## 🔗 Conexión con el Backend

**⚠️ IMPORTANTE:** El frontend requiere que el backend esté ejecutándose para funcionar correctamente.

### Orden de Inicio Recomendado:
1. **Primero**: Inicia el backend (puerto 8080)
2. **Segundo**: Inicia el frontend (puerto 5173)

### Verificar Conexión:
- El frontend se conecta automáticamente al backend en `http://localhost:8080`
- Si hay problemas de conexión, verifica:
  - ✅ Backend está corriendo en puerto 8080
  - ✅ No hay errores de CORS (el backend ya tiene CORS configurado para localhost:5173)
  - ✅ MySQL está corriendo y conectado al backend

### Construir para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🎯 Cómo Usar

### Vista Principal (Temporizador)
- **Iniciar/Pausar**: Controla el temporizador con el botón principal
- **Reiniciar**: Vuelve al inicio de la sesión actual
- **Progreso**: Ve cuántas sesiones has completado
- **Personaje Activo**: Tu compañero actual te acompaña durante el estudio

### Configuración
Accede a la pestaña de configuración para personalizar:

- **⏰ Tiempo de Estudio**: 1-120 minutos (por defecto: 25)
- **💤 Tiempo de Descanso**: 1-60 minutos (por defecto: 5)
- **📊 Número de Sesiones**: 1-20 sesiones (por defecto: 5)
- **🔄 Modo Automático**: Continúa automáticamente entre fases

### Tienda e Inventario
- **🏪 Tienda**: Compra nuevos personajes con tus puntos
- **🎒 Inventario**: Gestiona tus personajes y activa el que prefieras
- **📜 Certificados**: Visualiza e imprime certificados de adopción

### Notas
- **📝 Crear Notas**: Toma notas durante tus sesiones
- **🏷️ Categorías**: Organiza por General, Estudio, Descanso, Ideas, Tareas
- **✅ Completar**: Marca notas como completadas
- **📌 Fijar**: Mantén notas importantes al inicio

### Paneles Administrativos
- **🛡️ Admin** (`/admin`): Gestiona precios y disponibilidad de personajes
- **🏬 Vendedor** (`/vendedor`): Consulta inventario y registro de adopciones

## 🎨 Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: CSS-in-JS con estilos inline
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios con interceptores JWT
- **State Management**: Context API
- **Audio**: Howler.js para efectos de sonido
- **Almacenamiento**: Backend API + localStorage para configuración local

### Estructura del Proyecto
```
ClarityTimer-frontend/
├── src/
│   ├── components/
│   │   ├── Timer.tsx              # Componente principal del temporizador
│   │   ├── Settings.tsx           # Panel de configuración
│   │   ├── TiendaPersonajes.tsx   # Tienda de personajes
│   │   ├── Inventario.tsx         # Inventario de personajes
│   │   ├── CertificateModal.tsx   # Modal de certificados
│   │   ├── Statistics.tsx         # Estadísticas y progreso
│   │   ├── NotesManager.tsx       # Gestor de notas
│   │   ├── AdminDashboard.tsx     # Panel de administrador
│   │   ├── VendedorDashboard.tsx  # Panel de vendedor
│   │   ├── Login.tsx              # Página de login
│   │   ├── Register.tsx           # Página de registro
│   │   └── RoleRoute.tsx          # Protección de rutas por rol
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Contexto de autenticación
│   │   ├── TimerContext.tsx       # Contexto del temporizador
│   │   └── SettingsContext.tsx    # Contexto de configuración
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP base
│   │   ├── authService.ts         # Servicio de autenticación
│   │   ├── personajeService.ts    # Servicio de personajes
│   │   ├── sesionService.ts       # Servicio de sesiones
│   │   ├── noteService.ts         # Servicio de notas
│   │   └── estadisticasService.ts # Servicio de estadísticas
│   ├── constants/
│   │   └── settings.ts            # Constantes de configuración
│   └── App.tsx                    # Componente raíz
├── public/
│   ├── characters/                # Imágenes de personajes
│   └── sounds/                    # Archivos de audio
└── package.json
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Modo desarrollo
NODE_ENV=development

# Modo producción
NODE_ENV=production
```

### Personalización de Iconos
Reemplaza los archivos en `public/`:
- `icon.png` - Icono principal (512x512)
- `icon.ico` - Icono para Windows
- `icon.icns` - Icono para macOS

## 🐛 Solución de Problemas

### Problemas Comunes

**El frontend no se conecta al backend:**
- ✅ Verifica que el backend esté corriendo en `http://localhost:8080`
- ✅ Revisa la configuración en `src/services/api.ts`
- ✅ Limpia el caché del navegador (Ctrl + Shift + R)
- ✅ Verifica que no haya errores de CORS en la consola

**Error de autenticación:**
- ✅ Cierra sesión y vuelve a iniciar
- ✅ Limpia el localStorage: `localStorage.clear()` en la consola del navegador
- ✅ Verifica que el token JWT no haya expirado

**Los puntos no se guardan:**
- ✅ Completa un pomodoro de TRABAJO (no descanso)
- ✅ Revisa la consola del navegador para errores
- ✅ Verifica que el backend esté respondiendo correctamente

**Puerto 5173 ocupado:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

## 👥 Miembros del Equipo

**Frontend y Backend:**
- **Catalina Rosales**
- **Edgar Morales**

---

**Proyecto desarrollado para evaluación académica - Diciembre 2024**
