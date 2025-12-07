import {Map, Marker, Popup, ScaleControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import Spinner from '../spinner/Spinner';
import HeroSearchForm from './HeroSearchForm';
import GeolocationButton from '../form/GeolocationButton';
import ZoomControl from './ZoomControl';
import { getNearbyStations } from '../../services/StationService';
import { geocodeAddress, getShortAddress } from '../../services/GeoService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateVisibleRadius, debounce, createStationBoundsFilter } from '../../utils/MapUtils';

/**
 * Composant Hero Map avec carte interactive et formulaire de recherche
 */
function HeroMap() {
    const mapRef = useRef();
    const { userLocation, locationStatus, getUserLocation } = useGeolocation();

    useEffect(() => {  
        if (mapRef.current && userLocation) {
            mapRef.current.flyTo({center: [userLocation.longitude, userLocation.latitude]});
        }
    }, [userLocation]);

    // Fonctions de contrôle du zoom
    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };
    
    // États pour les résultats de recherche
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [searchCoordinates, setSearchCoordinates] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    // Fonction pour enrichir les stations avec des adresses
    const enrichStationsWithAddresses = async (stations) => {
        console.log('Enrichissement des adresses pour', stations.length, 'stations');
        try {
            // Enrichir toutes les stations en parallèle avec Promise.all
            const enrichedStations = await Promise.all(
                stations.map(async (station) => {
                    try {
                        console.log('Récupération adresse pour station:', station.name);
                        const address = await getShortAddress(station.latitude, station.longitude);
                        console.log('Adresse récupérée:', address);
                        return { ...station, address };
                    } catch (error) {
                        console.error('Erreur lors de l\'enrichissement de l\'adresse pour la station:', station.id, error);
                        return { ...station, address: 'Adresse non disponible' };
                    }
                })
            );
            console.log('Stations enrichies:', enrichedStations);
            return enrichedStations;
        } catch (error) {
            console.error('Erreur lors de l\'enrichissement des adresses:', error);
            return stations.map(station => ({ ...station, address: 'Adresse non disponible' }));
        }
    };

    const getFilteredStations = async (lat, lng, radius) => {
        const stations = await getNearbyStations(
            parseFloat(lat.toFixed(8)), // Reduire les décimales à 8
            parseFloat(lng.toFixed(8)),
            Math.ceil(radius) // Arrondir vers le haut pour inclure toutes les stations
        );
        
        // Filtrer les stations pour ne garder que celles dans les limites visibles
        const boundsFilter = createStationBoundsFilter(mapRef);
        const filteredStations = stations.filter(boundsFilter);

        // Enrichir les stations avec des adresses courtes
        const enrichedStations = await enrichStationsWithAddresses(filteredStations);

        return enrichedStations;
    };

    // Fonction pour mettre à jour les stations visibles selon la carte
    const updateVisibleStations = useCallback(async () => {
        setIsSearching(true);
        setSearchError(null);

        if (mapRef.current) {
            const center = mapRef.current.getCenter();
            const radius = calculateVisibleRadius(mapRef);
            
            console.log('Mise à jour des stations:', {
                centre: { lat: center.lat, lng: center.lng },
                rayon: radius + 'km'
            });
            
            try {
                const filteredStations = await getFilteredStations(center.lat, center.lng, radius);
                setSearchResults(filteredStations);
            } catch (error) {
                console.error('Erreur lors de la mise à jour des stations:', error);
                setSearchError('Erreur lors de la mise à jour des stations');
            } finally {
                setIsSearching(false);
            }
        }
    }, []);

    // Debouncer la fonction pour éviter trop d'appels API
    const debouncedUpdateStations = useCallback(
        debounce(updateVisibleStations, 500),
        [updateVisibleStations]
    );

    const handleMapMovement = () => {
        debouncedUpdateStations();
    };

    // Soumission du formulaire
    const handleSearchSubmit = async (searchForm) => {
        setIsSearching(true);
        setSearchError(null);

        try {
            // 1. Géocodage de l'adresse
            let coordinates;
            if (searchForm.address.trim()) {
                const geocodingResult = await geocodeAddress(searchForm.address);
                coordinates = {
                    latitude: geocodingResult.latitude,
                    longitude: geocodingResult.longitude
                };
                setSearchCoordinates(coordinates);
            } else {
                throw new Error('Aucune adresse fournie et géolocalisation indisponible');
            }

            // 2. Centrer la carte sur les coordonnées de recherche
            if (coordinates && mapRef.current) {
                mapRef.current.flyTo({center: [coordinates.longitude, coordinates.latitude]});
            }

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchError(error.message || 'Erreur lors de la recherche de bornes');
        }
    };
    // Si la géolocalisation n'est pas encore disponible, afficher le spinner
    if (!userLocation) {
        return <Spinner />;
    }

    return (
        <>
            <Map
                ref={mapRef}
                id="hero-map"
                initialViewState={userLocation}
                style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0}}
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo"
                scrollZoom={false}
                doubleClickZoom={true}
                onMove={handleMapMovement}
                onZoom={handleMapMovement}
            >
                
                {/* Marqueurs pour les stations trouvées */}
                {searchResults.map((station) => (
                    <Marker
                        key={station.id}
                        longitude={station.longitude}
                        latitude={station.latitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            setSelectedStation(station);
                        }}
                    >
                        <div 
                            className="station-marker"
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: '#28a745',
                                borderRadius: '50%',
                                border: '3px solid white',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px'
                            }}
                            title={station.name}
                        >
                            ⚡
                        </div>
                    </Marker>
                ))}

                {/* Popup pour la station sélectionnée */}
                {selectedStation && (
                    <Popup
                        longitude={selectedStation.longitude}
                        latitude={selectedStation.latitude}
                        anchor="top"
                        onClose={() => setSelectedStation(null)}
                        closeButton={true}
                        closeOnClick={false}
                    >
                        <div className="station-popup" style={{ padding: '0px 10px 0px 5px', color: '#000' }}>
                            <h6 className="fw-bold mb-2">{selectedStation.name}</h6>
                            {selectedStation.address && (
                                <p className="mb-1" style={{ color: '#6c757d' }}>
                                    📍 {selectedStation.address}
                                </p>
                            )}
                            {!selectedStation.address && (
                                <p className="mb-1" style={{ color: '#dc3545' }}>
                                    📍 Chargement de l'adresse...
                                </p>
                            )}
                            {selectedStation.power_kw && (
                                <p className="mb-1" style={{ color: '#6c757d' }}>
                                    ⚡ Puissance: {selectedStation.power_kw} kW
                                </p>
                            )}
                            {selectedStation.price_per_kwh && (
                                <p className="mb-2" style={{ color: '#6c757d' }}>
                                    💰 Prix: {selectedStation.price_per_kwh}€/kWh
                                </p>
                            )}
                            <button 
                                className="btn btn-primary btn-sm w-100"
                                onClick={() => {
                                    console.log('Réservation de la station:', selectedStation);
                                    // TODO: Implémenter la logique de réservation
                                }}
                            >
                                Réserver
                            </button>
                        </div>
                    </Popup>
                )}
                
                {/* Contrôles de zoom personnalisés */}
                <ZoomControl 
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                />
            </Map>

            <div 
                className="hero-gradient-overlay"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.8) 0%, rgba(13, 110, 253, 0.6) 15%, rgba(13, 110, 253, 0.3) 30%, rgba(13, 110, 253, 0.1) 50%, transparent 100%)',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* Content Container */}
            <div className='container-fluid position-absolute top-0 start-0 w-100 h-100' style={{zIndex: 2, pointerEvents: 'none'}}>
                <div className='row h-100'>
                    <div className='col-lg-5 d-flex flex-column justify-content-between py-4' style={{pointerEvents: 'none'}}>
                        <div className="hero-content" style={{pointerEvents: 'auto'}}>
                            <h1 className="fw-bold mb-4">
                                ⚡Trouvez, réservez et gérez vos bornes de recharge en toute simplicité.
                            </h1>
                        </div>

                        <div className='d-flex gap-2 flex-column'>
                            {locationStatus !== 'error' && <GeolocationButton onClick={getUserLocation} />}
                            <HeroSearchForm 
                                onSubmit={handleSearchSubmit}
                                isSearching={isSearching}
                                searchError={searchError}
                                searchResults={searchResults}
                                searchCoordinates={searchCoordinates}
                                style={{pointerEvents: 'auto'}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroMap;