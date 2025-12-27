import { useState } from 'react';
import { useGlobalErrorContext } from '../contexts/GlobalErrorContext';
import { useAuth } from '../contexts/AuthContext';

export function useApiCall() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setGlobalError } = useGlobalErrorContext();
    const { isAuthenticated, checkAuthStatus } = useAuth();

    const execute = async (serviceFunction, options = {}) => {
        const {
            onSuccess,
            onError,
            errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.',
        } = options;

        setLoading(true);
        setError(null);

        try {
            const result = await serviceFunction();
            
            if (onSuccess) {
                onSuccess(result);
            }
            
            return result;
        } catch (err) {
            console.error('Erreur lors de l\'appel API:', err);
            setError(err);
            
            // Vérifier le statut d'authentification en cas d'erreur
            const isAuthenticated = await checkAuthStatus();
            
            // Afficher l'erreur globale seulement si l'utilisateur reste authentifié
            // Les erreurs d'authentification sont déjà gérées par AuthContext 
            // (message de session expirée)
            if (isAuthenticated && errorMessage) {
                setGlobalError(errorMessage);
            }

            if (onError) {
                onError(err);
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
}
