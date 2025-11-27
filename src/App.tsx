import { useState, ComponentType, MouseEvent } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TimerComponent from './components/Timer';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import NotesManager from './components/NotesManager';
import NotificationManager from './components/NotificationManager';
import GlobalStatusIndicator from './components/GlobalStatusIndicator';
import TiendaPersonajes from './components/TiendaPersonajes';
import Inventario from './components/Inventario';
import Login from './pages/Login';
import Register from './pages/Register';
import { SettingsProvider } from './contexts/SettingsContext';
import { TimerProvider } from './contexts/TimerContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import RoleRoute from './components/RoleRoute';
import VendedorDashboard from './components/VendedorDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserManager from './components/UserManager';

interface Tab {
  key: string;
  name: string;
  component: ComponentType;
}

function UserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{
        textAlign: 'right'
      }}>
        <p style={{
          margin: '0 0 5px 0',
          color: '#4a5568',
          fontWeight: 'bold',
          fontSize: '0.95rem'
        }}>
          {user.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : user.username}
        </p>
        <p style={{
          margin: 0,
          color: '#667eea',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          💎 {user.puntosDisponibles} puntos
        </p>
      </div>
      <button
        onClick={logout}
        style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timer');

  // Tabs base para CLIENTE
  const baseTabs: Tab[] = [
    { key: 'timer', name: '⏰ Temporizador', component: TimerComponent },
    { key: 'tienda', name: '🛍️ Tienda', component: TiendaPersonajes },
    { key: 'inventario', name: '🎁 Inventario', component: Inventario },
    { key: 'statistics', name: '📊 Estadísticas', component: Statistics },
    { key: 'notes', name: '📝 Notas', component: NotesManager },
    { key: 'notifications', name: '🔔 Notificaciones', component: NotificationManager },
    { key: 'settings', name: '⚙️ Configuración', component: Settings }
  ];

  // Si es ADMIN, agregar pestañas de administración
  const tabs: Tab[] = user?.rol === 'ADMIN' 
    ? [
        ...baseTabs,
        { key: 'admin-products', name: '🛡️ Productos', component: AdminDashboard },
        { key: 'admin-users', name: '👥 Usuarios', component: UserManager }
      ]
    : baseTabs;

  const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h1 style={{
            textAlign: 'center',
            color: '#4a5568',
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            flex: 1,
            minWidth: '200px'
          }}>
            ⏱️ ClarityTimer
          </h1>
          <UserInfo />
        </div>

        {/* Pestañas */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '5px'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 16px',
                margin: '0 5px',
                border: 'none',
                background: activeTab === tab.key ? '#667eea' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#4a5568',
                borderRadius: '10px 10px 0 0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Contenido de las pestañas */}
        {ActiveComponent && <ActiveComponent />}
      </div>

      {/* Indicador de estado global (solo visible cuando la ventana esté minimizada) */}
      <GlobalStatusIndicator />
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      {/* 🎯 PRESENTACIÓN: Providers anidados - Conexión de Contextos */}
      {/* Están anidados: AuthProvider envuelve todo, luego SettingsProvider, luego TimerProvider */}
      {/* IMPORTANTE: TimerContext usa SettingsContext para saber cuántos minutos configuró el usuario */}
      {/* Hay una dependencia entre contextos */}
      <AuthProvider>
        <SettingsProvider>
          <TimerProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🎯 PRESENTACIÓN: Rutas protegidas por rol */}
              {/* /vendedor solo para VENDEDOR y ADMIN */}
              <Route
                path="/vendedor"
                element={
                  <RoleRoute allowedRoles={['VENDEDOR', 'ADMIN']}>
                    <VendedorDashboard />
                  </RoleRoute>
                }
              />

              {/* 🎯 PRESENTACIÓN: /admin solo para ADMIN */}
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />

              {/* 🎯 PRESENTACIÓN: Ruta principal para CLIENTE y ADMIN */}
              {/* ADMIN puede acceder a todas las rutas incluyendo la raíz */}
              <Route
                path="/*"
                element={
                  <RoleRoute allowedRoles={['CLIENTE', 'ADMIN']}>
                    <AppContent />
                  </RoleRoute>
                }
              />
            </Routes>
          </TimerProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
