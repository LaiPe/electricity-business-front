import { useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';

/**
 * Composant de contrôle du zoom avec boutons + et -
 * Peut être utilisé à l'intérieur d'un composant Map (récupération auto de la référence)
 * ou en dehors (référence passée via mapRef prop)
 */
function ZoomControl({ mapRef = null, disabled = false }) {
    const [isZooming, setIsZooming] = useState(false);

    // Tentative de récupération de la map depuis le contexte (si dans un composant Map)
    let mapInstance = null;
    try {
        const mapContext = useMap();
        mapInstance = mapContext?.current || mapContext;
    } catch (e) {
        // Pas dans un contexte de Map, on utilise la prop mapRef
        mapInstance = mapRef?.current;
    }

    const handleZoomIn = async () => {
        if (disabled || isZooming) return;
        setIsZooming(true);
        try {
            if (mapInstance) {
                // Vérifier que l'instance a bien les méthodes de MapLibre
                if (typeof mapInstance.zoomIn === 'function') {
                    mapInstance.zoomIn();
                } else if (mapRef?.current && typeof mapRef.current.getMap === 'function') {
                    // Si c'est une référence react-map-gl, accéder à l'instance MapLibre
                    const mapLibreInstance = mapRef.current.getMap();
                    if (typeof mapLibreInstance.zoomIn === 'function') {
                        mapLibreInstance.zoomIn();
                    }
                }
            }
        } finally {
            setTimeout(() => setIsZooming(false), 300);
        }
    };

    const handleZoomOut = async () => {
        if (disabled || isZooming) return;
        setIsZooming(true);
        try {
            if (mapInstance) {
                // Vérifier que l'instance a bien les méthodes de MapLibre
                if (typeof mapInstance.zoomOut === 'function') {
                    mapInstance.zoomOut();
                } else if (mapRef?.current && typeof mapRef.current.getMap === 'function') {
                    // Si c'est une référence react-map-gl, accéder à l'instance MapLibre
                    const mapLibreInstance = mapRef.current.getMap();
                    if (typeof mapLibreInstance.zoomOut === 'function') {
                        mapLibreInstance.zoomOut();
                    }
                }
            }
        } finally {
            setTimeout(() => setIsZooming(false), 300);
        }
    };

    return (
        <div 
            className="zoom-control"
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                zIndex: 10
            }}
        >
            {/* Bouton Zoom In (+) */}
            <button
                type="button"
                onClick={handleZoomIn}
                disabled={disabled || isZooming}
                className="btn btn-light border-0"
                style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: 0,
                    borderBottom: '1px solid #dee2e6'
                }}
                title="Zoomer"
            >
                +
            </button>
            
            {/* Bouton Zoom Out (-) */}
            <button
                type="button"
                onClick={handleZoomOut}
                disabled={disabled || isZooming}
                className="btn btn-light border-0"
                style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: 0
                }}
                title="Dézoomer"
            >
                −
            </button>
        </div>
    );
}

export default ZoomControl;