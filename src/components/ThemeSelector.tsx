import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { THEMES, type ThemeType } from '../constants/settings';

interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

const THEME_DEFINITIONS: Record<ThemeType, Theme> = {
  default: {
    name: 'Sanrio Clásico',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4ecdc4',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  },
  sunset: {
    name: 'Atardecer',
    primary: '#ff6b6b',
    secondary: '#feca57',
    accent: '#ff9ff3',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  },
  ocean: {
    name: 'Océano',
    primary: '#4ecdc4',
    secondary: '#44a08d',
    accent: '#667eea',
    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  },
  forest: {
    name: 'Bosque',
    primary: '#2d5a27',
    secondary: '#4a7c59',
    accent: '#8fbc8f',
    background: 'linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  },
  lavender: {
    name: 'Lavanda',
    primary: '#9b59b6',
    secondary: '#8e44ad',
    accent: '#e8d5f0',
    background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  },
  midnight: {
    name: 'Medianoche',
    primary: '#2c3e50',
    secondary: '#34495e',
    accent: '#3498db',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    surface: 'rgba(255, 255, 255, 0.95)',
    text: '#4a5568'
  }
};

export default function ThemeSelector() {
  const { settings, updateSetting } = useSettings();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(settings.theme || 'default');

  // Aplicar tema al cargar el componente
  useEffect(() => {
    const theme = THEME_DEFINITIONS[selectedTheme];
    if (theme) {
      applyTheme(theme);
    }
  }, []);

  // Sincronizar con settings
  useEffect(() => {
    if (settings.theme && settings.theme !== selectedTheme) {
      setSelectedTheme(settings.theme);
      const theme = THEME_DEFINITIONS[settings.theme];
      if (theme) {
        applyTheme(theme);
      }
    }
  }, [settings.theme]);

  // Función para aplicar tema globalmente
  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--background-gradient', theme.background);
    document.documentElement.style.setProperty('--surface-color', theme.surface);
    document.documentElement.style.setProperty('--text-color', theme.text);
  };

  const handleThemeChange = (themeKey: ThemeType) => {
    setSelectedTheme(themeKey);
    updateSetting('theme', themeKey);
    
    // Aplicar tema globalmente
    const theme = THEME_DEFINITIONS[themeKey];
    if (theme) {
      applyTheme(theme);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        color: '#4a5568',
        marginBottom: '20px',
        fontSize: '1.3rem',
        textAlign: 'center'
      }}>
        🎨 Seleccionar Tema
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {(Object.entries(THEME_DEFINITIONS) as [ThemeType, Theme][]).map(([key, theme]) => (
          <div
            key={key}
            onClick={() => handleThemeChange(key)}
            style={{
              background: theme.background,
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              border: selectedTheme === key ? '3px solid #fff' : '3px solid transparent',
              boxShadow: selectedTheme === key ? '0 8px 25px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center'
            }}>
              <h4 style={{
                margin: '0 0 10px 0',
                color: theme.text,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}>
                {theme.name}
              </h4>
              
              {/* Muestra de colores */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.primary
                }}></div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.secondary
                }}></div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.accent
                }}></div>
              </div>

              {selectedTheme === key && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  ✅
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>
          💡 Los temas cambian los colores principales de la aplicación para personalizar tu experiencia de estudio
        </p>
      </div>
    </div>
  );
}

