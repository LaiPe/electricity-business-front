import { useRef, useState, useEffect, useCallback } from "react";
import { Map } from "react-map-gl/maplibre";
import { useLocation, useNavigate } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import useViewport from "../hooks/useViewport";
import Spinner from "../components/spinner/Spinner";
import SearchForm from "../components/search/SearchForm";
import StationMarker from "../components/map/StationMarker";
import StationPopup from "../components/map/StationPopup";
import ZoomControl from "../components/map/ZoomControl";
import ClusterMarker from "../components/map/ClusterMarker";
import { getNearbyStations, getFreeNearbyStations } from "../services/StationService";
import { geocodeAddress } from "../services/GeoService";
import { calculateVisibleRadius, debounce, createStationBoundsFilter, calculatePixelDistance } from "../utils/MapUtils";
import { useAuth } from "../contexts/AuthContext";

function Search() {
    const mapRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { userLocation } = useGeolocation();
    const { isMobile } = useViewport();
    const { isAuthenticated } = useAuth();
    
    // États pour les stations
    const [stations, setStations] = useState([]);
    const [clusters, setClusters] = useState([]);
    const [individualStations, setIndividualStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    
    // États pour la recherche
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    // État initial passé via navigation (station présélectionnée, coordonnées, etc.)
    const initialState = location.state || null;

    const [formData, setFormData] = useState({
        address: initialState?.address || '',
        date: initialState?.date || '',
        duration: initialState?.duration || '60',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Réinitialiser le statut de soumission si l'utilisateur modifie le formulaire
        if (isFormSubmitted) {
            setIsFormSubmitted(false);
        }
    };

    // Fonction pour formater une date locale en ISO sans conversion UTC
    const toLocalISOString = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // Fonction pour merger les résultats de recherche sans doublons
    const mergeSearchResults = (prevResults, newStations) => {
        if (!prevResults || prevResults.length === 0) {
            return newStations;
        }
        
        const newStationIds = new Set(newStations.map(station => station.id));
        const keptStations = prevResults.filter(station => newStationIds.has(station.id));
        const existingIds = new Set(keptStations.map(station => station.id));
        const uniqueNewStations = newStations.filter(station => !existingIds.has(station.id));
        
        return [...keptStations, ...uniqueNewStations];
    };

    // Fonction pour créer des clusters
    const createClusters = (stationsList) => {
        if (!mapRef.current || stationsList.length === 0) {
            return { clusters: [], individualStations: stationsList };
        }

        const clusterDistancePixels = 50;
        const clustersResult = [];
        const processedStations = new Set();
        const individualStationsResult = [];

        stationsList.forEach((station, index) => {
            if (processedStations.has(index)) return;

            const nearbyStations = [station];
            processedStations.add(index);

            stationsList.forEach((otherStation, otherIndex) => {
                if (processedStations.has(otherIndex) || index === otherIndex) return;

                const pixelDistance = calculatePixelDistance(
                    station.latitude, station.longitude,
                    otherStation.latitude, otherStation.longitude,
                    mapRef
                );

                if (pixelDistance < clusterDistancePixels) {
                    nearbyStations.push(otherStation);
                    processedStations.add(otherIndex);
                }
            });

            if (nearbyStations.length > 1) {
                const avgLat = nearbyStations.reduce((sum, s) => sum + s.latitude, 0) / nearbyStations.length;
                const avgLng = nearbyStations.reduce((sum, s) => sum + s.longitude, 0) / nearbyStations.length;

                clustersResult.push({
                    id: `cluster_${clustersResult.length}`,
                    latitude: avgLat,
                    longitude: avgLng,
                    stations: nearbyStations,
                    count: nearbyStations.length
                });
            } else {
                individualStationsResult.push(station);
            }
        });

        return { clusters: clustersResult, individualStations: individualStationsResult };
    };

    // Fonction pour récupérer les stations filtrées
    const getFilteredStations = async (lat, lng, radius) => {
        let stationsResult;

        // Si la date est remplie dans le formulaire, utiliser getFreeNearbyStations
        if (formData.date) {
            const searchStart = new Date(formData.date);
            const searchEnd = new Date(searchStart.getTime() + parseInt(formData.duration) * 60000);
            
            // Formater en ISO local (sans conversion UTC)
            const searchStartLocal = toLocalISOString(searchStart);
            const searchEndLocal = toLocalISOString(searchEnd);
            console.log('Recherche des bornes libres entre', searchStartLocal, 'et', searchEndLocal);
            
            stationsResult = await getFreeNearbyStations(
                parseFloat(lat.toFixed(8)),
                parseFloat(lng.toFixed(8)),
                Math.ceil(radius),
                searchStartLocal,
                searchEndLocal
            );
        } else {
            // Sinon, utiliser getNearbyStations pour toutes les bornes
            console.log('Recherche de toutes les bornes à proximité');
            stationsResult = await getNearbyStations(
                parseFloat(lat.toFixed(8)),
                parseFloat(lng.toFixed(8)),
                Math.ceil(radius)
            );
        }
        
        // Filtrer les stations pour ne garder que celles dans les limites visibles
        const boundsFilter = createStationBoundsFilter(mapRef);
        return stationsResult.filter(boundsFilter);
    };

    // Fonction pour mettre à jour les stations visibles selon la carte
    const updateVisibleStations = useCallback(async () => {
        if (!mapRef.current) return;
        
        setIsLoading(true);
        setSearchError(null);

        const center = mapRef.current.getCenter();
        const radius = calculateVisibleRadius(mapRef);
        
        console.log('Mise à jour des stations:', {
            centre: { lat: center.lat, lng: center.lng },
            rayon: radius + 'km',
            filtreFormulaire: isFormSubmitted
        });

        if (radius > 1000) {
            setIsLoading(false);
            return;
        }
        
        try {
            const filteredStations = await getFilteredStations(center.lat, center.lng, radius);
            
            // Vérifier si la station sélectionnée est toujours dans les résultats
            if (selectedStation && !filteredStations.find(station => station.id === selectedStation.id)) {
                setSelectedStation(null);
            }
            
            setStations(prevResults => {
                const mergedResults = mergeSearchResults(prevResults, filteredStations);
                const { clusters: newClusters, individualStations: newIndividual } = createClusters(mergedResults);
                setClusters(newClusters);
                setIndividualStations(newIndividual);
                return mergedResults;
            });

            if (filteredStations.length === 0 && isFormSubmitted) {
                setSearchError(formData.date ? 
                    "Aucune borne disponible trouvée pour ces critères de date et durée." : 
                    "Aucune borne trouvée dans cette zone.");
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des stations:', error);
            setSearchError('Erreur lors de la mise à jour des stations');
        } finally {
            setIsLoading(false);
        }
    }, [selectedStation, isFormSubmitted, formData.date, formData.duration]);

    // Debouncer la fonction pour éviter trop d'appels API
    const debouncedUpdateStations = useCallback(
        debounce(updateVisibleStations, 500),
        [updateVisibleStations]
    );

    // Gestion du mouvement de la carte
    const handleMapMovement = () => {
        // Recalculer les clusters quand la carte bouge ou zoome
        if (stations.length > 0) {
            const { clusters: newClusters, individualStations: newIndividual } = createClusters(stations);
            setClusters(newClusters);
            setIndividualStations(newIndividual);
        }
        
        debouncedUpdateStations();
    };

    // Gestion du clic sur un cluster
    const handleClusterClick = (cluster) => {
        if (!mapRef.current) return;
        
        const currentZoom = mapRef.current.getZoom();
        const newZoom = Math.min(currentZoom + 3, 18);
        
        mapRef.current.flyTo({
            center: [cluster.longitude, cluster.latitude],
            zoom: newZoom,
            duration: 1000
        });
    };

    // Gestion de la réservation
    const handleClickBooking = () => {
        if (!selectedStation) return;

        if (isAuthenticated) {
            navigate(`/booking/create`, {
                state: {
                    station: selectedStation,
                    searchParams: formData,
                    coordinates: {
                        latitude: selectedStation.latitude,
                        longitude: selectedStation.longitude
                    }
                }
            });
        } else {
            navigate('/login');
        }
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSearchError(null);
        setSelectedStation(null);
        setIsFormSubmitted(true);

        try {
            // Géocoder l'adresse pour obtenir les coordonnées
            const { latitude, longitude } = await geocodeAddress(formData.address);

            // Centrer la carte sur les coordonnées recherchées
            if (mapRef.current) {
                mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 12,
                    duration: 1500
                });

                // Si mobile, scroller en haut pour voir la carte
                if (isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            

            // La mise à jour des stations sera déclenchée par handleMapMovement après le flyTo
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchError(error.message || "Erreur lors de la recherche des bornes. Veuillez réessayer.");
            setIsLoading(false);
        }
    };

    // Réinitialiser le formulaire et relancer la requête sans filtre
    const handleReset = async (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        // Remettre le formulaire à l'état vide
        setFormData({ address: '', date: '', duration: '60' });
        setIsFormSubmitted(false);
        setSearchError(null);
        setSelectedStation(null);
        updateVisibleStations();

        // Si mobile, scroller en haut pour voir la carte
        if (isMobile) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Vérifier si le formulaire est complètement rempli
    const isFormComplete = formData.address && formData.date && formData.duration;

    // Effet pour charger les stations initiales quand la carte et la géolocalisation sont prêtes
    useEffect(() => {
        if (isMapLoaded && userLocation) {
            console.log('Chargement initial des stations...');
            
            // Si un état initial avec une station est passé, la sélectionner
            if (initialState?.station) {
                setSelectedStation(initialState.station);
                
                // Centrer la carte sur la station présélectionnée
                if (mapRef.current && initialState.station.latitude && initialState.station.longitude) {
                    mapRef.current.flyTo({
                        center: [initialState.station.longitude, initialState.station.latitude],
                        zoom: 15,
                        duration: 1000
                    });
                }
            }
            
            // Si des coordonnées initiales sont passées, centrer la carte
            if (initialState?.coordinates && mapRef.current) {
                mapRef.current.flyTo({
                    center: [initialState.coordinates.longitude, initialState.coordinates.latitude],
                    zoom: initialState.zoom || 12,
                    duration: 1000
                });
            }
            
            updateVisibleStations();
        }
    }, [isMapLoaded, userLocation]);

    // Si la géolocalisation n'est pas encore disponible, afficher le spinner
    if (!userLocation) {
        return <main className="hero-fullscreen-height"><Spinner /></main>;
    }

    return (
        <main className={`search-page d-flex ${isMobile ? 'flex-column-reverse' : ''} hero-fullscreen-height`}>
            <div className="stations d-flex flex-column align-items-center" style={{width: isMobile ? "100%" : "50%", backgroundColor: '#ffffff', zIndex: 2}}>
                <div 
                    className="search-form-container w-100 p-4 pb-0 mb-4" 
                    style={{backgroundColor: '#ffffff', position: 'sticky', top: 'var(--header-height)', zIndex: 10}}
                >
                    <SearchForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        isLoading={isLoading}
                        isFormSubmitted={isFormSubmitted}
                    />
                </div>
                <div className="stations-list w-100 px-4 mb-4" style={{zIndex: isMobile ? 5 : undefined}}>
                    {/* Indicateur de mode de recherche */}
                    {isFormSubmitted && formData.date && (
                        <div className="alert alert-info py-2 mb-3" role="alert">
                            <small>
                                🔍 Bornes disponibles le {new Date(formData.date).toLocaleDateString('fr-FR')} à {new Date(formData.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} pendant {parseInt(formData.duration) >= 60 ? `${parseInt(formData.duration) / 60}h` : `${formData.duration}min`}
                            </small>
                        </div>
                    )}
                    
                    {searchError && (
                        <div className="alert alert-warning" role="alert">
                            {searchError}
                        </div>
                    )}
                    
                    {isLoading && stations.length === 0 && (
                        <div className="text-center py-4">
                            <span className="spinner-border spinner-border-sm ms-2" role="status"></span>
                            <p className="text-muted mt-2">Recherche des bornes...</p>
                        </div>
                    )}
                    
                    {stations.length > 0 && (
                        <div className="mb-3">
                            <h5 className="mb-3">
                                {stations.length} borne{stations.length > 1 ? 's' : ''} {isFormSubmitted ? 'disponible' : 'trouvée'}{stations.length > 1 ? 's' : ''}
                                {isLoading && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
                            </h5>
                            <div className="list-group">
                                {stations.map((station) => (
                                    <div 
                                        key={station.id}
                                        className={`list-group-item list-group-item-action`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedStation(station);
                                            if (mapRef.current) {
                                                mapRef.current.flyTo({
                                                    center: [station.longitude, station.latitude],
                                                    zoom: 15,
                                                    duration: 1000
                                                });
                                            }
                                            if (isMobile) {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }
                                        }}
                                    >
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <h6 className="mb-1 fw-bold">⚡ {station.name}</h6>
                                            {station.price_per_kwh && (
                                                <small className="text-success fw-bold">
                                                    {station.price_per_kwh}€/kWh
                                                </small>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div>
                                                {station.power_kw && (
                                                    <p className="mb-1">
                                                        <small className="text-muted">
                                                            Puissance: {station.power_kw} kW
                                                        </small>
                                                    </p>
                                                )}
                                                <small className="text-muted">
                                                    📍 Cliquez pour voir sur la carte
                                                </small>
                                            </div>
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-primary btn-sm w-100"
                                                    disabled={!isFormComplete}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedStation(station);
                                                        handleClickBooking();
                                                    }}
                                                >
                                                    Réserver cette borne
                                                </button>
                                                {!isFormComplete && (
                                                    <small className="text-muted d-block mt-1">
                                                        <i className="bi bi-exclamation-circle-fill me-1"></i>
                                                        Veuillez remplir le formulaire complet pour réserver
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div 
                className={`map-container ${isMobile ? '' : 'py-4 pe-4 hero-fullscreen-strict-height'}`} 
                style={
                    isMobile 
                    ? 
                        {width: "100%", height: '58vh', position: 'sticky', top: 'var(--header-height)'} 
                    : 
                        {width: "50%", position: 'sticky', top: 'var(--header-height)'}
                }
            >
                <div className="border rounded-3 h-100 position-relative" style={{overflow: 'hidden'}}>
                    <Map
                        ref={mapRef}
                        id="search-map"
                        initialViewState={userLocation}
                        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo"
                        scrollZoom={isMobile ? false : false}
                        touchZoomRotate={isMobile ? true : false}
                        touchPitch={isMobile ? true : false}
                        doubleClickZoom={true}
                        minZoom={7}
                        maxZoom={22}
                        onMove={handleMapMovement}
                        onZoom={handleMapMovement}
                        onLoad={() => setIsMapLoaded(true)}
                    >   
                        {/* Marqueurs pour les clusters */}
                        {clusters.map((cluster) => (
                            <ClusterMarker
                                key={cluster.id}
                                cluster={cluster}
                                onClusterClick={handleClusterClick}
                            />
                        ))}

                        {/* Marqueurs des stations individuelles */}
                        {individualStations.map((station) => (
                            <StationMarker
                                key={station.id}
                                station={station}
                                onMarkerClick={(clickedStation) => setSelectedStation(clickedStation)}
                            />
                        ))}

                        {/* Popup de la station sélectionnée */}
                        {selectedStation && (
                            <StationPopup
                                station={selectedStation}
                                onClose={() => setSelectedStation(null)}
                                onBooking={handleClickBooking}
                                disabledBooking={!isFormComplete}
                            />
                        )}

                        {/* Contrôles de zoom */}
                        { !isMobile && <ZoomControl />}
                        
                    </Map>
                </div>
               
                
            </div>
        </main>
    );
}

export default Search;