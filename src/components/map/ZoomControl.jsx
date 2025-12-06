import { useState } from 'react';

/**
 * Composant de contrôle du zoom avec boutons + et -
 */
function ZoomControl({ onZoomIn, onZoomOut, disabled = false }) {
    const [isZooming, setIsZooming] = useState(false);

    const handleZoomIn = async () => {
        if (disabled || isZooming) return;
        setIsZooming(true);
        try {
            await onZoomIn();
        } finally {
            setTimeout(() => setIsZooming(false), 300);
        }
    };

    const handleZoomOut = async () => {
        if (disabled || isZooming) return;
        setIsZooming(true);
        try {
            await onZoomOut();
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