import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/ApiRequest';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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
            
        } catch (error) {
            // if (error.cause !== 403) {
            //     console.error('Erreur lors de la vérification de l\'authentification:', error);
            // }
            setIsAuthenticated(false);
            setUser(null);
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