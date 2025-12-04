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