# ⏱️ ClarityTimer Frontend

Aplicación frontend de temporizador Pomodoro con temática Sanrio y sistema de gamificación, diseñada para hacer tu tiempo de estudio más agradable y productivo.

## ✨ Características

- ⏰ **Temporizador Pomodoro**: Configurable con tiempos de estudio y descanso personalizables
- 🎭 **Personajes Sanrio**: Cinnamoroll te acompaña durante tus sesiones de estudio
- 🎵 **Sonidos Ambientales**: Olas, lluvia y fuego para crear un ambiente relajante
- 🔇 **Control de Sonidos**: Opción para silenciar todos los sonidos
- ⚙️ **Configuración Completa**: Personaliza todos los aspectos de tu experiencia
- 📊 **Seguimiento de Progreso**: Registra tus sesiones completadas diariamente
- 🔄 **Modo Automático**: Continúa automáticamente entre fases o pausa manualmente
- 💻 **Aplicación de Escritorio**: Disponible como aplicación nativa para Windows, Mac y Linux

## 🚀 Instalación y Uso

### Desarrollo

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/ClarityTimer-frontend.git
   cd ClarityTimer-frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta en modo desarrollo**:
   ```bash
   # Solo aplicación web
   npm run dev
   
   # Con Electron (aplicación de escritorio)
   npm run electron-dev
   ```

### Construir para Producción

#### Aplicación Web
```bash
npm run build
```

#### Aplicación de Escritorio

**Para Windows:**
```bash
npm run electron-pack-win
```

**Para macOS:**
```bash
npm run electron-pack-mac
```

**Para Linux:**
```bash
npm run electron-pack-linux
```

**Para todas las plataformas:**
```bash
npm run electron-pack
```

Los archivos ejecutables se generarán en la carpeta `dist-electron/`.

## 🎯 Cómo Usar

### Vista Principal (Temporizador)
- **Iniciar/Pausar**: Controla el temporizador con el botón principal
- **Reiniciar**: Vuelve al inicio de la sesión actual
- **Silenciar Sonidos**: Toggle para activar/desactivar todos los sonidos
- **Progreso**: Ve cuántas sesiones has completado hoy

### Configuración
Accede a la pestaña de configuración para personalizar:

- **⏰ Tiempo de Estudio**: 1-120 minutos (por defecto: 25)
- **💤 Tiempo de Descanso**: 1-60 minutos (por defecto: 5)
- **📊 Número de Sesiones**: 1-20 sesiones (por defecto: 5)
- **🎭 Personaje**: Selecciona tu compañero de estudio
- **🎵 Sonido Ambiental**: Elige entre olas, lluvia o fuego
- **🔇 Silenciar Sonidos**: Desactiva todas las notificaciones de audio
- **🔄 Modo Automático**: Continúa automáticamente entre fases

## 🎨 Características Técnicas

### Tecnologías Utilizadas
- **Frontend**: React 19 + Vite
- **Estilos**: CSS-in-JS con estilos inline
- **Audio**: Web Audio API con archivos MP3
- **Almacenamiento**: localStorage para persistencia
- **Desktop**: Electron para aplicación nativa

### Estructura del Proyecto
```
ClarityTimer-frontend/
├── src/
│   ├── components/
│   │   ├── Timer.jsx          # Componente principal del temporizador
│   │   ├── Settings.jsx       # Panel de configuración
│   │   ├── Character.jsx      # Renderizado de personajes
│   │   └── AudioManager.jsx   # Gestión de audio
│   ├── App.jsx                # Componente raíz
│   └── main.jsx               # Punto de entrada
├── public/
│   ├── characters/            # Imágenes de personajes
│   └── sounds/               # Archivos de audio
├── electron.js               # Proceso principal de Electron
├── preload.js               # Script de precarga de Electron
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

**El temporizador se pausa al cambiar de pestaña:**
- ✅ **Solucionado**: El temporizador ahora mantiene su estado al cambiar entre pestañas

**Los sonidos no funcionan:**
- Verifica que el navegador permita reproducción de audio
- Asegúrate de que los archivos de sonido estén en `public/sounds/`
- Usa el botón de silenciar para controlar el audio

**La aplicación de escritorio no se ejecuta:**
- Instala las dependencias: `npm install`
- Ejecuta en modo desarrollo: `npm run electron-dev`
- Verifica que Node.js esté actualizado

## 📝 Changelog

### v1.0.0
- ✨ Temporizador Pomodoro funcional
- 🎭 Integración con personajes Sanrio
- 🎵 Sistema de sonidos ambientales
- ⚙️ Panel de configuración completo
- 🔇 Opción para silenciar sonidos
- 💻 Soporte para aplicación de escritorio con Electron
- 📊 Seguimiento de progreso diario
- 🔄 Modo automático configurable

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Sanrio por los personajes adorables
- La técnica Pomodoro por mejorar la productividad
- La comunidad de React y Electron por las herramientas increíbles

---

**¡Que tengas sesiones de estudio productivas y divertidas! 🍓✨**
