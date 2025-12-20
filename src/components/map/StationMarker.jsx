import { Marker } from 'react-map-gl/maplibre';

/**
 * Composant pour afficher un marqueur de station individuelle
 */
function StationMarker({ station, onMarkerClick }) {
    return (
        <Marker
            key={station.id}
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="bottom"
            onClick={(e) => {
                e.originalEvent.stopPropagation();
                onMarkerClick(station);
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
    );
}

export default StationMarker;