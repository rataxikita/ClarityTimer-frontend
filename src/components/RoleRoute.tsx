import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

// 🎯 PRESENTACIÓN: RoleRoute - Protege rutas según el rol del usuario
// Verifica permisos. Si no hay usuario, redirige al login
// Si el usuario tiene un rol que no está permitido, redirige a su dashboard correspondiente
// IMPORTANTE: Esto es solo para UX. La verdadera seguridad está en el backend
export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    // 🎯 PRESENTACIÓN: Si no hay usuario → redirige al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 🎯 PRESENTACIÓN: Si el rol no está permitido → redirige según su rol
    if (!allowedRoles.includes(user.rol)) {
        // Redirigir según el rol del usuario si intenta acceder a una ruta no permitida
        if (user.rol === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.rol === 'VENDEDOR') return <Navigate to="/vendedor" replace />;

        // Si es CLIENTE o cualquier otro rol y no tiene permiso, ir al inicio (que para cliente es la app)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
