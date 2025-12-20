import { useState, useEffect, useRef, useCallback } from 'react';
import { Map, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import PropTypes from 'prop-types';
import GeolocationButton from './GeolocationButton';
import ZoomControl from '../map/ZoomControl';
import { useGeolocation } from '../../hooks/useGeolocation';

function MapCoordinateInput({
    id,
    label,
    latitude = null,
    longitude = null,
    zoom = null,
    onCoordinateChange,
    error,
    required = false,
    disabled = false,
    helpText,
    className = '',
    mapHeight = '300px'
}) {
    const mapRef = useRef(null);
    const { userLocation, locationStatus } = useGeolocation();

    const [coordinates, setCoordinates] = useState({
        lat: latitude !== null ? latitude : null,
        lng: longitude !== null ? longitude : null
    });

    const [viewState, setViewState] = useState({
        longitude: longitude !== null ? longitude : (userLocation?.longitude || 2.2137),
        latitude: latitude !== null ? latitude : (userLocation?.latitude || 46.2276),
        zoom: latitude !== null && longitude !== null ? 15 : 6
    });

    // Mettre à jour uniquement la vue de la carte quand la géolocalisation change (sans remplir les champs)
    useEffect(() => {
        if (userLocation && latitude === null && longitude === null) {
            // Centrer la carte sur la géolocalisation mais ne pas remplir les champs
            setViewState(prev => ({
                ...prev,
                longitude: userLocation.longitude,
                latitude: userLocation.latitude,
                zoom: 12
            }));
        }
    }, [userLocation, latitude, longitude]);

    // Mettre à jour les coordonnées quand les props changent
    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            const newCoordinates = { lat: latitude, lng: longitude };
            setCoordinates(newCoordinates);
            onCoordinateChange(newCoordinates);
            
            // Centrer la carte sur les nouvelles coordonnées
            setViewState(prev => ({
                ...prev,
                longitude: longitude !== null ? longitude : prev.longitude,
                latitude: latitude !== null ? latitude : prev.latitude,
                zoom: zoom !== null ? zoom : prev.zoom
            }));
        }
    }, [latitude, longitude]);

    // Gérer la géolocalisation explicite par le bouton
    const handleGeolocationUpdate = () => {
        if (userLocation) {
            const newCoordinates = { 
                lat: parseFloat(userLocation.latitude.toFixed(8)), 
                lng: parseFloat(userLocation.longitude.toFixed(8))
            };
            setCoordinates(newCoordinates);
            
            // Centrer la carte sur la nouvelle position
            setViewState(prev => ({
                ...prev,
                longitude: userLocation.longitude,
                latitude: userLocation.latitude,
            }));
            
            if (onCoordinateChange) {
                onCoordinateChange(newCoordinates);
            }
        }
    };

    const handleMapClick = useCallback((event) => {
        if (disabled) return;
        
        const { lat, lng } = event.lngLat;
        handleCoordinateUpdate(lat, lng);
    }, [disabled]);

    const handleCoordinateUpdate = (lat, lng) => {
        const newCoordinates = {
            lat: parseFloat(lat.toFixed(8)),
            lng: parseFloat(lng.toFixed(8))
        };
        
        setCoordinates(newCoordinates);
        
        if (onCoordinateChange) {
            onCoordinateChange(newCoordinates);
        }
    };

    const handleInputChange = (field, value) => {
        if (disabled) return;
        
        if (value === '') {
            // Si l'utilisateur vide le champ, mettre à null
            const newCoordinates = {
                ...coordinates,
                [field]: null
            };
            setCoordinates(newCoordinates);
            
            if (onCoordinateChange) {
                onCoordinateChange(newCoordinates);
            }
            return;
        }
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;
        
        const newCoordinates = {
            ...coordinates,
            [field]: numValue
        };
        
        setCoordinates(newCoordinates);
        
        // Centrer la carte sur les nouvelles coordonnées seulement si on a les deux
        if (newCoordinates.lat !== null && newCoordinates.lng !== null) {
            setViewState(prev => ({
                ...prev,
                longitude: newCoordinates.lng,
                latitude: newCoordinates.lat,
            }));
        }
        
        if (onCoordinateChange) {
            onCoordinateChange(newCoordinates);
        }
    };


    const handleMarkerDragEnd = useCallback((event) => {
        if (disabled) return;
        
        const { lat, lng } = event.lngLat;
        handleCoordinateUpdate(lat, lng);
    }, [disabled]);


    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
            )}
            
            <div className={`form-control bg-light ${error ? 'is-invalid' : ''}`}>
                {/* Champs de saisie manuelle */}
                <div className="p-3 border-bottom ">
                    <div className="row g-2 align-items-end">
                        <div className={`${locationStatus !== 'error' ? 'col-md-4' : 'col-md-6'}`}>
                            <label className="form-label small mb-1">Latitude</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                value={coordinates.lat || ''}
                                onChange={(e) => handleInputChange('lat', e.target.value)}
                                step="0.00000001"
                                min="-90"
                                max="90"
                                disabled={disabled}
                                placeholder="Ex: 48.8566"
                            />
                        </div>
                        <div className={`${locationStatus !== 'error' ? 'col-md-4' : 'col-md-6'}`}>
                            <label className="form-label small mb-1">Longitude</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                value={coordinates.lng || ''}
                                onChange={(e) => handleInputChange('lng', e.target.value)}
                                step="0.00000001"
                                min="-180"
                                max="180"
                                disabled={disabled}
                                placeholder="Ex: 2.3522"
                            />
                        </div>
                        {!disabled && locationStatus !== 'error' && ( 
                            <div className="col-md-4">
                                <GeolocationButton 
                                    mapRef={mapRef}
                                    centerOnMethod="jumpTo"
                                    onLocationUpdate={handleGeolocationUpdate}
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100 mt-1"
                                    title="Utiliser ma position actuelle"
                                />
                        </div>)}
                    </div>
                </div>

                {/* Carte */}
                <div style={{ position: 'relative' }}>
                    <Map
                        ref={mapRef}
                        {...viewState}
                        onMove={(evt) => setViewState(evt.viewState)}
                        style={{ width: '100%', height: mapHeight }}
                        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo"
                        onClick={handleMapClick}
                        cursor={disabled ? 'not-allowed' : 'crosshair'}
                        interactiveLayerIds={[]}
                        attributionControl={false}
                        scrollZoom={false}
                        doubleClickZoom={false}
                    >
                        {(coordinates.lat !== null && coordinates.lng !== null) && (
                            <Marker
                                longitude={coordinates.lng}
                                latitude={coordinates.lat}
                                draggable={!disabled}
                                onDragEnd={handleMarkerDragEnd}
                                color="#0d6efd"
                            />
                        )}
                    </Map>
                    
                    {/* Contrôles de zoom */}
                    {!disabled && (
                        <ZoomControl 
                            mapRef={mapRef}
                            disabled={disabled}
                            small
                        />
                    )}
                </div>
                
                {/* Instructions */}
                <div className="p-2 bg-light border-top">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        {disabled 
                            ? 'Mode lecture seule'
                            : 'Cliquez sur la carte ou déplacez le marqueur pour définir la position'
                        }
                        {locationStatus === 'loading' && (
                            <span className="ms-2">
                                <i className="bi bi-arrow-clockwise spin me-1"></i>
                                Localisation en cours...
                            </span>
                        )}
                        {locationStatus === 'error' && (
                            <span className="ms-2 text-warning">
                                <i className="bi bi-exclamation-triangle me-1"></i>
                                Impossible d'obtenir votre géolocalisation
                            </span>
                        )}
                    </small>
                </div>
            </div>
            
            {helpText && (
                <div className="form-text text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    {helpText}
                </div>
            )}
            
            {error && (
                <div className="invalid-feedback d-block">
                    {error}
                </div>
            )}
        </div>
    );
}

MapCoordinateInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    onCoordinateChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    helpText: PropTypes.string,
    className: PropTypes.string,
    mapHeight: PropTypes.string
};

export default MapCoordinateInput;