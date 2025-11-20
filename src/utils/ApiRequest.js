const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Fonction pour effectuer des requêtes API avec gestion des erreurs
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important pour inclure les cookies httpOnly
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Une erreur s'est produite ! Veuillez réessayer plus tard.", { cause: response.status });
        }

        // Vérifier si la réponse contient du JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return null;
    } catch (error) {
        throw error;
    }
};