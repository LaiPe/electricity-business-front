import { useState, useEffect, useCallback } from 'react';

const fallbackLocation = {
            latitude: 48.8566, // Paris coordinates
            longitude: 2.3522,
            zoom: 12 // Zoom par défaut pour la vue de la carte
};

const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000 // Cache la position pendant 1 minute
};

export const useGeolocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'success', 'error', 'denied'
    const [locationError, setLocationError] = useState(null);

    const getUserLocation = useCallback( async () => {
        setLocationStatus('loading');
        
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('La géolocalisation n\'est pas supportée par ce navigateur');
            setUserLocation(fallbackLocation);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({
                    longitude,
                    latitude,
                    zoom: 14 // Zoom plus proche quand on a la position exacte
                });
                setLocationStatus('success');
                setLocationError(null);     
            },
            (error) => {
                console.error('Erreur de géolocalisation:', error);
                setLocationStatus('error');
                setUserLocation(fallbackLocation);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Accès à la géolocalisation refusé');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Position indisponible');
                        break;
                    case error.TIMEOUT:
                        setLocationError('Délai d\'attente dépassé');
                        break;
                    default:
                        setLocationError('Erreur inconnue de géolocalisation');
                        break;
                }
            },
            options
        );
    }, []);

    // Récupération de la géolocalisation au montage
    useEffect(() => {
        getUserLocation();
    }, [getUserLocation]);

    return {
        userLocation,
        locationStatus,
        locationError,
        updateLocation : getUserLocation
    };
};