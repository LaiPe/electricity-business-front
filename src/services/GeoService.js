/**
 * Service de géolocalisation et géocodage
 */

/**
 * Géocode une adresse en utilisant l'API Nominatim d'OpenStreetMap
 * @param {string} address - L'adresse à géocoder
 * @returns {Promise<{latitude: number, longitude: number, displayName: string}>} Les coordonnées
 */
export const geocodeAddress = async (address) => {
    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Erreur lors du géocodage');
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            throw new Error('Adresse non trouvée');
        }
        
        const { lat, lon } = data[0];
        return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            displayName: data[0].display_name
        };
    } catch (error) {
        console.error('Erreur de géocodage:', error);
        throw error;
    }
};

/**
 * Géocodage inverse - convertit des coordonnées en adresse
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} zoom - Niveau de détail (optionnel, défaut: 18)
 * @returns {Promise<{address: string, city: string, country: string, postcode: string, displayName: string}>} L'adresse
 */
export const reverseGeocode = async (latitude, longitude, zoom = 18) => {
    try {
        // Validation des paramètres
        if (!latitude || !longitude) {
            throw new Error('Latitude et longitude sont requis');
        }

        if (latitude < -90 || latitude > 90) {
            throw new Error('Latitude invalide (doit être entre -90 et 90)');
        }

        if (longitude < -180 || longitude > 180) {
            throw new Error('Longitude invalide (doit être entre -180 et 180)');
        }

        const response = await fetch(
            `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`
        );
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.features || data.features.length === 0) {
            throw new Error('Aucune adresse trouvée');
        }
        
        // Extraire les informations d'adresse du premier résultat
        const feature = data.features[0];
        const properties = feature.properties || {};
        
        return {
            housenumber: properties.housenumber || '',
            street: properties.street || properties.name || '',
            city: properties.city || '',
            country: properties.country || '',
            postcode: properties.postcode || '',
            state: properties.state || '',
            // Informations brutes pour usage avancé
            rawAddress: properties,
            coordinates: {
                latitude: parseFloat(feature.geometry.coordinates[1]),
                longitude: parseFloat(feature.geometry.coordinates[0])
            }
        };
    } catch (error) {
        console.error('Erreur de géocodage inverse:', error);
        throw error;
    }
};

/**
 * Obtient une adresse formatée (numéro + rue + ville) à partir de coordonnées
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<string>} Adresse formatée: "housenumber street, city"
 */
export const getShortAddress = async (latitude, longitude) => {
    try {
        const result = await reverseGeocode(latitude, longitude);
        
        // Construire l'adresse: "housenumber street, city"
        const addressParts = [
            result.housenumber,
            result.street
        ].filter(Boolean);
        
        const streetAddress = addressParts.join(' ');
        const fullParts = [streetAddress, result.city].filter(Boolean);
        
        return fullParts.join(', ') || 'Adresse non disponible';
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse:', error);
        return 'Localisation inconnue';
    }
};