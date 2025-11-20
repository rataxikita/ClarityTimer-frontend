import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        // Redirigir según el rol del usuario si intenta acceder a una ruta no permitida
        if (user.rol === 'ADMIN') return <Navigate to="/admin" replace />;
        if (user.rol === 'VENDEDOR') return <Navigate to="/vendedor" replace />;

        // Si es CLIENTE o cualquier otro rol y no tiene permiso, ir al inicio (que para cliente es la app)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
