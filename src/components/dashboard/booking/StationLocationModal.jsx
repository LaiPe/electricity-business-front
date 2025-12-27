import { useRef } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import ZoomControl from '../../map/ZoomControl';

const MAP_STYLE = 'https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo';

export default function StationLocationModal({ station, onClose }) {
    const mapRef = useRef(null);

    if (!station) return null;

    const longitude = station.longitude || station.lng || 0;
    const latitude = station.latitude || station.lat || 0;

    return (
        <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
        >
            <div 
                className="modal-dialog modal-lg modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                            Localisation de la borne : {station.name}
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={onClose}
                            aria-label="Fermer"
                        ></button>
                    </div>
                    <div className="modal-body p-0">
                        <div style={{ height: '400px', position: 'relative' }}>
                            <Map
                                ref={mapRef}
                                initialViewState={{
                                    longitude: longitude,
                                    latitude: latitude,
                                    zoom: 15
                                }}
                                style={{ width: '100%', height: '100%' }}
                                mapStyle={MAP_STYLE}
                            >
                                <Marker 
                                    longitude={longitude} 
                                    latitude={latitude}
                                    anchor="bottom"
                                >
                                    <div style={{ 
                                        fontSize: '32px', 
                                        color: '#0d6efd',
                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                    }}>
                                        <i className="bi bi-geo-alt-fill"></i>
                                    </div>
                                </Marker>
                                <ZoomControl mapRef={mapRef} small />
                            </Map>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="text-muted small me-auto">
                            <i className="bi bi-pin-map me-1"></i>
                            Coordonnées : {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </div>
                        <a
                            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <i className="bi bi-google me-1"></i>
                            Ouvrir dans Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
