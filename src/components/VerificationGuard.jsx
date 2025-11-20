import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function VerificationGuard({ children }) {
    const { user, isAuthenticated, loading, getVerificationInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Ne pas rediriger si en cours de chargement
        if (loading) return;

        // Ne pas rediriger si pas authentifié
        if (!isAuthenticated || !user) return;

        const verificationInfo = getVerificationInfo();
        
        // Rediriger vers la vérification si l'utilisateur n'est pas vérifié
        if (verificationInfo.needsVerification) {
            navigate('/verify', {
                state: { email: verificationInfo.email },
                replace: true
            });
        }
    }, [user, isAuthenticated, loading, navigate, getVerificationInfo]);

    return children;
}

export default VerificationGuard;