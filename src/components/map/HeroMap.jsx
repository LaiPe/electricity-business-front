import {Map, Marker, Popup} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import HeroSearchForm from './HeroSearchForm';
import GeolocationButton from '../form/GeolocationButton';
import ZoomControl from './ZoomControl';
import { getNearbyStations } from '../../services/StationService';
import { geocodeAddress, getShortAddress } from '../../services/GeoService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useAuth } from '../../contexts/AuthContext';
import { calculateVisibleRadius, debounce, createStationBoundsFilter } from '../../utils/MapUtils';
import './HeroMap.css';

/**
 * Composant Hero Map avec carte interactive et formulaire de recherche
 */
function HeroMap() {
    const mapRef = useRef();
    const navigate = useNavigate();
    const { userLocation, locationStatus } = useGeolocation();
    const { isAuthenticated } = useAuth();
    
    // États pour les résultats de recherche
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [searchCoordinates, setSearchCoordinates] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    
    // Détecter si on est sur mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fonction pour enrichir les stations avec des adresses
    const enrichStationsWithAddresses = async (stations) => {
        const enrichmentPromises = stations.map(async (station) => {
            try {
                // Timeout de 3 secondes par requête
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                );
                
                const addressPromise = getShortAddress(station.latitude, station.longitude);
                const address = await Promise.race([addressPromise, timeoutPromise]);
                
                return { ...station, address };
            } catch (error) {
                return { ...station, address: null };
            }
        });

        // Timeout global de 3 secondes pour toutes les requêtes
        const globalTimeout = new Promise((resolve) => {
            setTimeout(() => {
                resolve(stations.map(station => ({ ...station, address: null })));
            }, 3000);
        });

        try {
            return await Promise.race([
                Promise.all(enrichmentPromises),
                globalTimeout
            ]);
        } catch (error) {
            // En cas d'erreur, retourner les stations avec address: null
            return stations.map(station => ({ ...station, address: null }));
        }
    };

    const getFilteredStations = async (lat, lng, radius) => {
        const stations = await getNearbyStations(
            parseFloat(lat.toFixed(8)),
            parseFloat(lng.toFixed(8)),
            Math.ceil(radius)
        );
        
        // Filtrer les stations pour ne garder que celles dans les limites visibles
        const boundsFilter = createStationBoundsFilter(mapRef);
        const filteredStations = stations.filter(boundsFilter);

        // Enrichir les station avec les adresses
        return await enrichStationsWithAddresses(filteredStations);
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

            if (radius > 1000) {
                setIsSearching(false);
                return;
            }
            
            try {
                const filteredStations = await getFilteredStations(center.lat, center.lng, radius);
                
                // Vérifier si la station sélectionnée est toujours dans les résultats
                if (selectedStation && !filteredStations.find(station => station.id === selectedStation.id)) {
                    setSelectedStation(null); // Fermer le popup si le marqueur n'est plus visible
                }
                
                setSearchResults(filteredStations);
            } catch (error) {
                console.error('Erreur lors de la mise à jour des stations:', error);
                setSearchError('Erreur lors de la mise à jour des stations');
            } finally {
                setIsSearching(false);
            }
        }
    }, [selectedStation]);

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
                mapRef.current.jumpTo({
                    center: [coordinates.longitude, coordinates.latitude], 
                    zoom: mapRef.current.getZoom() > 13 ? mapRef.current.getZoom() : 13
                });
            }

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchError(error.message || 'Erreur lors de la recherche de bornes');
        }
    };

    // Gestion du clic sur le bouton de réservation
    const handleClickBooking = () => {
        if (!selectedStation) return;

        if (isAuthenticated) {
            // Utilisateur connecté : rediriger vers la page de création de réservation
            navigate(`/booking/create`, {
                state: {
                    station: selectedStation,
                    coordinates: {
                        latitude: selectedStation.latitude,
                        longitude: selectedStation.longitude
                    }
                }
            });
        } else {
            // Utilisateur non connecté : rediriger vers la page de connexion
            // avec une redirection de retour vers la réservation
            navigate('/login');
        }
    };

    // Effet pour charger les stations initiales quand la carte et la géolocalisation sont prêtes
    useEffect(() => {
        if (isMapLoaded && userLocation) {
            console.log('Chargement initial des stations...');
            updateVisibleStations();
        }
    }, [isMapLoaded, userLocation]);


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
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo"
                scrollZoom={isMobile ? false : false}
                touchZoomRotate={isMobile ? true : false}
                touchPitch={isMobile ? true : false}
                doubleClickZoom={true}
                minZoom={7}
                maxZoom={18}
                onMove={handleMapMovement}
                onZoom={handleMapMovement}
                onLoad={() => setIsMapLoaded(true)}
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
                        onClose={(e) => {
                            setSelectedStation(null)}}
                        closeButton={true}
                        closeOnClick={false}
                    >
                        <div className="station-popup" style={{ padding: '0px 10px 0px 5px', color: '#000' }}>
                            <h6 className="fw-bold mb-2">{selectedStation.name}</h6>

                            <p className="mb-1" style={{ color: '#6c757d' }}>
                                📍 <a 
                                    href={`https://www.google.com/maps?q=${selectedStation.latitude},${selectedStation.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ 
                                        color: '#0d6efd', 
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    title={`Ouvrir dans Google Maps (${selectedStation.latitude}, ${selectedStation.longitude})`}
                                >
                                    {selectedStation.address ? selectedStation.address  : 'Voir sur la carte'}
                                </a>
                            </p>
                            
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
                                onClick={handleClickBooking}
                            >
                                Réserver
                            </button>
                        </div>
                    </Popup>
                )}
                
                {/* Contrôles de zoom personnalisés - seulement sur desktop */}
                {!isMobile && (
                    <ZoomControl />
                )}
            </Map>

            <div 
                className="hero-gradient-overlay"
            />

            {/* Content Container */}
            <div className='container-fluid position-absolute top-0 start-0 w-100 h-100' style={{zIndex: 2, pointerEvents: 'none'}}>
                <div className='row h-100'>
                    <div className='col-md-5 d-flex flex-column justify-content-between pb-sm-4 pt-4' style={{pointerEvents: 'none'}}>
                        <div className="hero-content" style={{pointerEvents: 'auto'}}>
                            <h1 className="fw-bold mb-4" style={{fontSize: '5vmin', lineHeight: '1.2'}}>
                                ⚡Trouvez, réservez et gérez vos bornes de recharge en toute simplicité.
                            </h1>
                        </div>

                        <div className='d-flex gap-2 flex-column'>
                            { locationStatus !== 'error' && 
                                <GeolocationButton
                                    mapRef={mapRef}
                                    centerOnMethod="jumpTo"
                                    variant="light"
                                    className={`d-flex align-items-center gap-2`}
                                    style={{
                                        width: '140px',
                                        height: '42px',
                                        pointerEvents: 'auto'
                                    }}
                                />
                            }
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