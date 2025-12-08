// Komponent ProtectedRoute to mechanizm do ochrony tras w aplikacji, zapewniający, że tylko zalogowani użytkownicy mogą uzyskać dostęp do określonych zasobów.
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Ładowanie autoryzacji...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && (!user.role || user.role !== requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;