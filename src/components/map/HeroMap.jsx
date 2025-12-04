import {Map, Marker, Popup} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState, useRef } from 'react';
import Spinner from '../spinner/Spinner';
import SearchForm from './SearchForm';
import { getNearbyAndFreeStations } from '../../services/StationService';
import { geocodeAddress } from '../../services/GeoService';
import { useGeolocation } from '../../hooks/useGeolocation';

/**
 * Composant Hero Map avec carte interactive et formulaire de recherche
 */
function HeroMap() {
    const mapRef = useRef();
    const { userLocation, locationStatus } = useGeolocation();
    
    // États pour les résultats de recherche
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [searchCoordinates, setSearchCoordinates] = useState(null);
    const [selectedStation, setSelectedStation] = useState(null);

    // Soumission du formulaire
    const handleSearchSubmit = async (searchForm) => {
        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);

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
            } else if (locationStatus === 'success' && userLocation) {
                // Utiliser la position de l'utilisateur si pas d'adresse
                coordinates = {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                };
                setSearchCoordinates(coordinates);
            } else {
                throw new Error('Aucune adresse fournie et géolocalisation indisponible');
            }

            // 2. Calcul des dates de début et fin
            const startDate = new Date(searchForm.startDate);
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + parseFloat(searchForm.duration));

            const searchStart = startDate.toISOString();
            const searchEnd = endDate.toISOString();

            // 3. Appel à l'API backend pour récupérer les bornes disponibles
            const stations = await getNearbyAndFreeStations(
                coordinates.latitude,
                coordinates.longitude,
                10, // 10km de rayon par défaut
                searchStart,
                searchEnd
            );
            setSearchResults(stations);

            // Centrer la carte sur les coordonnées de recherche
            if (coordinates && mapRef.current) {
                mapRef.current.flyTo({center: [coordinates.longitude, coordinates.latitude]});
            }

        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchError(error.message || 'Erreur lors de la recherche de bornes');
        } finally {
            setIsSearching(false);
        }
    };
    // Si la géolocalisation n'est pas encore disponible, afficher le spinner
    if (locationStatus !== 'success' || !userLocation) {
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
                        <div className="station-popup" style={{ minWidth: '250px', padding: '10px' }}>
                            <h6 className="fw-bold mb-2">{selectedStation.name}</h6>
                            <p className="mb-1 text-muted small color-dark">
                                📍 {selectedStation.address}
                            </p>
                            {selectedStation.power && (
                                <p className="mb-1 small">
                                    ⚡ Puissance: {selectedStation.power} kW
                                </p>
                            )}
                            {selectedStation.price_per_hour && (
                                <p className="mb-2 small">
                                    💰 Prix: {selectedStation.price_per_hour}€/h
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
                <div className='row h-100' style={{pointerEvents: 'none'}}>
                    <div className='col-lg-5 d-flex flex-column justify-content-evenly' style={{pointerEvents: 'auto'}}>
                        <div className="hero-content">
                            <h1 className="fw-bold mb-4">
                                ⚡Trouvez, réservez et gérez vos bornes de recharge en toute simplicité.
                            </h1>
                        </div>
                        
                        <SearchForm 
                            onSubmit={handleSearchSubmit}
                            isSearching={isSearching}
                            searchError={searchError}
                            searchResults={searchResults}
                            searchCoordinates={searchCoordinates}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeroMap;