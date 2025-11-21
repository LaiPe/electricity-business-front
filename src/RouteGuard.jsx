import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { getAllowedRoutes, isRouteAllowed, getAllRoutes } from './config/routes';

function RouteGuard({ children }) {
    const { 
        isAuthenticated, 
        loading, 
        isVerified, 
        isBanned, 
        role,
        email, 
        userId 
    } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleRedirection = (isAuthenticated, isVerified, isBanned, userRole = 'USER') => {
        if (!isAuthenticated) {
            return () => { 
                navigate('/login', {
                    state: { redirectTo: location.pathname },
                    replace: true
                });
            };
        }

        if (isBanned) {
            return () => { 
                navigate('/banned', {
                    state: { userId, reason: 'account_banned' },
                    replace: true
                });
            }
        }
        
        if (!isVerified) {
            return () => { 
                navigate('/verify', {
                    state: { 
                        email,
                        redirectTo: location.pathname
                    },
                    replace: true
                });
            };
        }

        if (userRole !== 'ADMIN') {
            return () => { 
                navigate('/unauthorized', {
                    state: { 
                        requiredRole: 'ADMIN', 
                        currentRole: userRole,
                        attemptedPath: location.pathname
                    },
                    replace: true
                });
            }
        }
    };



    useEffect(() => {
        // Ne pas rediriger si en cours de chargement
        if (loading) return;
 
        const currentPath = location.pathname;

        // Vérifier si la route existe
        const allRoutes = getAllRoutes();
        if (!isRouteAllowed(currentPath, allRoutes)) {
            // Si la route n'existe pas, ne pas rediriger 
            // (la gestion de la 404 est faite par le routeur)
            return;
        }

        // Vérifier si la route est autorisée
        const allowedRoutes = getAllowedRoutes(isAuthenticated, isVerified, isBanned, role);
        const routeAllowed = isRouteAllowed(currentPath, allowedRoutes);
        if (!routeAllowed) {
            // Si la route n'est pas autorisée, gérer la redirection appropriée
            const redirectAction = handleRedirection(isAuthenticated, isVerified, isBanned, role);
            if (redirectAction) {
                // Si une action de redirection est définie, l'exécuter
                redirectAction();
            }
        }

    }, [
        isAuthenticated, 
        loading, 
        navigate, 
        isVerified, 
        isBanned,
        role,
        email, 
        userId,
        location.pathname
    ]);

    return children;
}

export default RouteGuard;