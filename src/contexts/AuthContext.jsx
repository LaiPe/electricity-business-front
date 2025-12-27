import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/ApiRequest';
import { useGlobalErrorContext } from './GlobalErrorContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const {globalError, setGlobalError} = useGlobalErrorContext();
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fonction pour vérifier le statut d'authentification
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            setInitialLoading(true);
            const response = await apiRequest('/auth/status', 'GET');
            
            setIsAuthenticated(true);
            setUser(response.user);
            return true;
        } catch (error) {
            if (error.cause == 403 && isAuthenticated) {
                setGlobalError('Votre session a expiré. Veuillez vous reconnecter.');
            } else if (error.cause != 403) {
                setGlobalError('Erreur lors de la connexion au serveur. Veuillez réessayer plus tard.');
            }
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    //fonction de login
    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await apiRequest('/auth/login', 'POST', credentials);
            
            if (response) {
                setIsAuthenticated(true);
                setUser(response.user);
                return { success: true };
            } else {
                throw new Error('Réponse invalide du serveur');
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.error('Erreur lors de la connexion:', error);
            if (error.cause === 400) {
                throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    //fonction de logout
    const logout = async () => {
        try {
            setLoading(true);
            await apiRequest('/auth/logout', 'POST');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer l'état local même en cas d'erreur
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
        }
    };

    //fonction d'inscription
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await apiRequest('/auth/register', 'POST', userData);

            if (response) {
                setIsAuthenticated(true);
                setUser(response.user);
                return { success: true };
            } else {
                throw new Error('Réponse invalide du serveur');
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUser(null);
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Vérifier l'authentification au montage du composant
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        userId : user?.id || null,
        username : user?.username || null,
        email : user?.email || null,
        isBanned : user?.banned || false,
        isVerified : user?.verified || false,
        role : user?.role || 'USER',
        isAuthenticated,
        loading,
        initialLoading,
        login,
        logout,
        register,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};