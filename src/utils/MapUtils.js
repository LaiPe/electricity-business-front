/**
 * Calcule le rayon visible d'une carte en utilisant ses limites
 * @param {Object} mapRef - Référence à l'instance de carte MapLibre
 * @returns {number} Rayon visible en kilomètres
 */
export const calculateVisibleRadius = (mapRef) => {
    if (!mapRef.current) {
        return 0;
    }

    try {
        const bounds = mapRef.current.getBounds();
        const center = mapRef.current.getCenter();
        
        // Obtenir les coordonnées des limites
        const northeast = bounds.getNorthEast();
        
        // Coordonnées du centre et du coin nord-est
        const centerLat = center.lat;
        const centerLng = center.lng;
        const cornerLat = northeast.lat;
        const cornerLng = northeast.lng;
        
        // Formule de Haversine pour calculer la distance
        const R = 6371; // Rayon de la Terre en km
        const dLat = (cornerLat - centerLat) * Math.PI / 180;
        const dLng = (cornerLng - centerLng) * Math.PI / 180;
        
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(centerLat * Math.PI / 180) * Math.cos(cornerLat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
            
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance en km du centre au coin
        
        // Le rayon visible est approximativement cette distance
        // (en réalité c'est un peu plus complexe selon la forme de l'écran)
        return Math.round(distance * 100) / 100; // Arrondir à 2 décimales
    } catch (error) {
        console.error('Erreur lors du calcul du rayon visible:', error);
        return 10; // Valeur par défaut de 10km
    }
};

/**
 * Calcule le rayon visible d'une carte basé sur le niveau de zoom (méthode alternative)
 * @param {number} zoom - Niveau de zoom actuel
 * @param {number} latitude - Latitude du centre de la carte
 * @param {number} mapWidthPixels - Largeur de la carte en pixels (optionnel, défaut 512)
 * @returns {number} Rayon visible en kilomètres
 */
export const calculateVisibleRadiusByZoom = (zoom, latitude, mapWidthPixels = 512) => {
    try {
        // Formule basée sur la projection de Mercator
        const metersPerPixel = (156543.03392 * Math.cos(latitude * Math.PI / 180)) / Math.pow(2, zoom);
        const mapWidthMeters = metersPerPixel * mapWidthPixels;
        const radiusKm = (mapWidthMeters / 2) / 1000; // Convertir en km
        
        return Math.round(radiusKm * 100) / 100; // Arrondir à 2 décimales
    } catch (error) {
        console.error('Erreur lors du calcul du rayon par zoom:', error);
        return 10; // Valeur par défaut de 10km
    }
};

/**
 * Créer une fonction de callback pour filtrer les stations dans les limites visibles de la carte
 * @param {Object} mapRef - Référence à l'instance de carte MapLibre
 * @returns {Function} Fonction callback pour Array.filter()
 */
export const createStationBoundsFilter = (mapRef) => {
    if (!mapRef.current) {
        console.warn('MapRef non disponible pour le filtrage');
        return () => true; // Retourner toutes les stations si pas de carte
    }

    try {
        const bounds = mapRef.current.getBounds();
        const southwest = bounds.getSouthWest();
        const northeast = bounds.getNorthEast();
        
        // Limites du rectangle visible
        const minLat = southwest.lat;
        const maxLat = northeast.lat;
        const minLng = southwest.lng;
        const maxLng = northeast.lng;
        
        // Retourner la fonction callback pour Array.filter()
        return (station) => {
            const lat = parseFloat(station.latitude);
            const lng = parseFloat(station.longitude);
            
            const isInBounds = lat >= minLat && lat <= maxLat && 
                              lng >= minLng && lng <= maxLng;
            
            return isInBounds;
        };
    } catch (error) {
        console.error('Erreur lors de la création du filtre:', error);
        return () => true; // Retourner toutes les stations en cas d'erreur
    }
};

/**
 * Filtre les stations pour ne garder que celles dans les limites visibles de la carte
 * @param {Array} stations - Liste des stations à filtrer
 * @param {Object} mapRef - Référence à l'instance de carte MapLibre
 * @returns {Array} Stations filtrées dans les limites visibles
 */
export const filterStationsInBounds = (stations, mapRef) => {
    if (!stations || stations.length === 0) {
        return stations || [];
    }

    const filterCallback = createStationBoundsFilter(mapRef);
    const filteredStations = stations.filter(filterCallback);
    
    return filteredStations;
};

/**
 * Obtient les limites visibles de la carte
 * @param {Object} mapRef - Référence à l'instance de carte MapLibre
 * @returns {Object} Objet contenant les limites { minLat, maxLat, minLng, maxLng }
 */
export const getMapBounds = (mapRef) => {
    if (!mapRef.current) {
        return null;
    }

    try {
        const bounds = mapRef.current.getBounds();
        const southwest = bounds.getSouthWest();
        const northeast = bounds.getNorthEast();
        
        return {
            minLat: southwest.lat,
            maxLat: northeast.lat,
            minLng: southwest.lng,
            maxLng: northeast.lng
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des limites:', error);
        return null;
    }
};

/**
 * Debounce une fonction pour éviter les appels trop fréquents
 * @param {Function} func - Fonction à debouncer
 * @param {number} delay - Délai en millisecondes
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

/**
 * Calcule la distance en pixels entre deux points sur la carte
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lng1 - Longitude du premier point
 * @param {number} lat2 - Latitude du deuxième point
 * @param {number} lng2 - Longitude du deuxième point
 * @param {Object} mapRef - Référence à l'instance de carte MapLibre
 * @returns {number} Distance en pixels
 */
export const calculatePixelDistance = (lat1, lng1, lat2, lng2, mapRef) => {
    if (!mapRef.current) return 0;
    
    const map = mapRef.current;
    const point1 = map.project([lng1, lat1]);
    const point2 = map.project([lng2, lat2]);
    
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    
    return Math.sqrt(dx * dx + dy * dy);
};