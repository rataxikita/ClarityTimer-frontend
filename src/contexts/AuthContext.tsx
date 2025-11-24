import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type UsuarioResponse, type LoginRequest, type RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: UsuarioResponse | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UsuarioResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 🎯 PRESENTACIÓN: useEffect que carga desde localStorage
  // Al cargar la aplicación, recupera el token y el usuario desde localStorage
  // Esto permite que la sesión persista aunque recargues la página
  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const storedUser = authService.getStoredUser();
    if (storedUser && authService.isAuthenticated()) {
      setUser(storedUser);
      // Actualizar datos del servidor
      authService.getCurrentUser().then(setUser).catch(() => {
        authService.logout();
        setUser(null);
      });
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.usuario);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.usuario);
  };

  // 🎯 PRESENTACIÓN: función logout
  // Cuando el usuario cierra sesión, limpia todo el estado y redirige al login
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const updatedUser = await authService.getCurrentUser();
        setUser(updatedUser);
      } catch (error) {
        console.error('Error actualizando usuario:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

