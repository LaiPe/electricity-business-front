import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UNVERIFIED_USER_ROUTES, isRouteAllowed } from '../config/routes';

function VerificationGuard({ children }) {
    const { isAuthenticated, loading, isVerified, email } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Ne pas rediriger si en cours de chargement
        if (loading) return;

        // Ne pas rediriger si pas authentifié
        if (!isAuthenticated) return;

        // Vérifier si la route actuelle est autorisée pour les utilisateurs non vérifiés
        const currentPath = location.pathname;
        const routeAllowed = isRouteAllowed(currentPath, UNVERIFIED_USER_ROUTES);

        // Ne pas rediriger si la route est autorisée
        if (routeAllowed) return;

        // Rediriger vers la vérification si l'utilisateur n'est pas vérifié
        if (!isVerified) {
            navigate('/verify', {
                state: { 
                    email,
                    redirectTo: currentPath // Sauvegarder la destination souhaitée
                },
                replace: true
            });
        }
    }, [isAuthenticated, loading, navigate, isVerified, email, location.pathname]);

    return children;
}

export default VerificationGuard;