import { useState, useContext } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useMap } from 'react-map-gl/maplibre';
import Button from './Button';

/**
 * Bouton de géolocalisation pour réactualiser la position de l'utilisateur
 * Peut être utilisé à l'intérieur d'un composant Map (récupération auto de la référence)
 * ou en dehors (référence passée via mapRef prop)
 */
function GeolocationButton({ 
    onLocationUpdate, 
    mapRef = null, // Référence de map optionnelle si utilisé en dehors d'un composant Map
    centerOnMethod = undefined, // Défini la méthode de centrage: 'flyTo', 'jumpTo', etc. Sinon pas de centrage par défaut
    ...props 
}) {
    const [isLoading, setIsLoading] = useState(false);
    const { userLocation, updateLocation } = useGeolocation();
    
    // Tentative de récupération de la map depuis le contexte (si dans un composant Map)
    let mapInstance = null;
    try {
        const mapContext = useMap();
        mapInstance = mapContext?.current || mapContext;
    } catch (e) {
        // Pas dans un contexte de Map, on utilise la prop mapRef
        mapInstance = mapRef?.current;
    }

    const handleClick = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            await updateLocation();
            
            // Si on a une instance de map et qu'on doit centrer sur la nouvelle position
            if (centerOnMethod && mapInstance && userLocation) {
                // Vérifier que l'instance a bien les méthodes de MapLibre
                if (typeof mapInstance[centerOnMethod] === 'function') {
                    mapInstance[centerOnMethod]({
                        center: [userLocation.longitude, userLocation.latitude],
                        zoom: userLocation.zoom || 14,
                    });
                } else if (mapRef?.current && typeof mapRef.current.getMap === 'function') {
                    // Si c'est une référence react-map-gl, accéder à l'instance MapLibre
                    const mapLibreInstance = mapRef.current.getMap();
                    if (typeof mapLibreInstance[centerOnMethod] === 'function') {
                        mapLibreInstance[centerOnMethod]({
                            center: [userLocation.longitude, userLocation.latitude],
                            zoom: userLocation.zoom || 14,
                        });
                    }
                }
            }

            // Appel du callback de mise à jour de la localisation si fourni
            if (onLocationUpdate) {
                onLocationUpdate(userLocation);
            }
        } catch (error) {
            console.error('Erreur lors de la géolocalisation:', error);
        } finally { 
            setIsLoading(false);
        }
    };


    return (
        <Button
            onClick={handleClick}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span 
                        className="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true"
                    ></span>
                    <span>Localisation...</span>
                </>
            ) : (
                <>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Ma position</span>
                </>
            )}
        </Button>
    );
}

export default GeolocationButton;