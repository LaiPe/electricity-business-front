import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'success', 'error', 'denied'
    const [locationError, setLocationError] = useState(null);

    const getUserLocation = useCallback(() => {
        setLocationStatus('loading');
        
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('La géolocalisation n\'est pas supportée par ce navigateur');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Cache la position pendant 1 minute
        };

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
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('Accès à la géolocalisation refusé');
                        setLocationStatus('denied');
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

    // Fonction pour redemander la géolocalisation
    const retryGeolocation = useCallback(() => {
        setLocationStatus('loading');
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 // Force une nouvelle position
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({
                    longitude,
                    latitude,
                    zoom: 14
                });
                setLocationStatus('success');
                setLocationError(null);
            },
            (error) => {
                setLocationStatus('error');
                setLocationError('Impossible d\'obtenir votre position');
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
        getUserLocation,
        retryGeolocation
    };
};