// Configuration des routes d'accès selon les permissions

// Routes accessibles à tous (anonymes et authentifiés)
export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/register',
    '/privacy-policy',
    '/terms-of-service'
];

// Routes accessibles aux utilisateurs authentifiés mais non vérifiés
export const UNVERIFIED_USER_ROUTES = [
    ...PUBLIC_ROUTES,
    '/verify',
    '/logout'
];

// Routes nécessitant une vérification complète du compte
export const VERIFIED_USER_ROUTES = [
    '/dashboard',
    '/profile',
    '/settings',
    '/projects*', // Wildcard pour toutes les routes commençant par /projects
    '/admin*'     // Wildcard pour toutes les routes d'admin
];

// Routes protégées par rôle (optionnel pour plus tard)
export const ADMIN_ROUTES = [
    '/admin*'
];

// Fonction utilitaire pour vérifier si une route est autorisée
export const isRouteAllowed = (currentPath, allowedRoutes) => {
    return allowedRoutes.some(route => {
        // Support des routes exactes et des patterns avec wildcards
        if (route.endsWith('*')) {
            return currentPath.startsWith(route.slice(0, -1));
        }
        return currentPath === route;
    });
};

// Fonction pour obtenir les routes autorisées selon le statut de l'utilisateur
export const getAllowedRoutes = (isAuthenticated, isVerified, userRole = 'USER') => {
    if (!isAuthenticated) {
        return PUBLIC_ROUTES;
    }
    
    if (!isVerified) {
        return UNVERIFIED_USER_ROUTES;
    }
    
    if (userRole === 'ADMIN') {
        return [...VERIFIED_USER_ROUTES, ...ADMIN_ROUTES];
    }
    
    return VERIFIED_USER_ROUTES;
};