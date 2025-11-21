import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function VerificationGuard({ children }) {
    const { isAuthenticated, loading, isVerified, email } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Ne pas rediriger si en cours de chargement
        if (loading) return;

        // Ne pas rediriger si pas authentifié
        if (!isAuthenticated) return;

        // Rediriger vers la vérification si l'utilisateur n'est pas vérifié
        if (!isVerified) {
            navigate('/verify', {
                state: { email },
                replace: true
            });
        }
    }, [isAuthenticated, loading, navigate, isVerified, email]);
    return children;
}

export default VerificationGuard;