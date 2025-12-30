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
    '/verify',
    '/logout'
];

export const BANNED_USER_ROUTES = [
    ...PUBLIC_ROUTES,
    '/banned',
    '/logout'
];

// Routes nécessitant une vérification complète du compte
export const VERIFIED_USER_ROUTES = [
    '/dashboard*',
    '/profile',
    '/settings',
    '/search',
    '/booking/create'
];

// Routes protégées par rôle
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
export const getAllowedRoutes = (isAuthenticated, isVerified, isBanned, userRole = 'USER') => {
    if (!isAuthenticated) {
        return PUBLIC_ROUTES;
    }

    if (isBanned) {
        return [...PUBLIC_ROUTES, ...BANNED_USER_ROUTES];
    }
    
    if (!isVerified) {
        return [...PUBLIC_ROUTES, ...UNVERIFIED_USER_ROUTES];
    }

    if (userRole === 'ADMIN') {
        return [
            ...PUBLIC_ROUTES, 
            ...UNVERIFIED_USER_ROUTES,
            ...VERIFIED_USER_ROUTES, 
            ...ADMIN_ROUTES
        ];
    }
    
    return [...PUBLIC_ROUTES, ...UNVERIFIED_USER_ROUTES, ...VERIFIED_USER_ROUTES];
};

export const getAllRoutes = () => {
    return [
        ...PUBLIC_ROUTES,
        ...UNVERIFIED_USER_ROUTES,
        ...BANNED_USER_ROUTES,
        ...VERIFIED_USER_ROUTES,
        ...ADMIN_ROUTES
    ];
};