import { useState, useEffect } from 'react';
import { Popup } from 'react-map-gl/maplibre';

/**
 * Composant pour afficher le popup d'une station avec enrichissement d'adresse
 */
function StationPopup({ station, onClose, onBooking, enrichStationsWithAddresses }) {
    const [enrichedStation, setEnrichedStation] = useState(station);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        const enrichStation = async () => {
            if (!station.address) {
                setIsLoadingAddress(true);
                try {
                    const enrichedStations = await enrichStationsWithAddresses([station]);
                    if (enrichedStations && enrichedStations.length > 0) {
                        setEnrichedStation(enrichedStations[0]);
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'enrichissement:', error);
                } finally {
                    setIsLoadingAddress(false);
                }
            }
        };

        enrichStation();
    }, [station, enrichStationsWithAddresses]);

    return (
        <Popup
            longitude={station.longitude}
            latitude={station.latitude}
            anchor="top"
            onClose={onClose}
            closeButton={true}
            closeOnClick={false}
        >
            <div className="station-popup" style={{ padding: '0px 10px 0px 5px', color: '#000' }}>
                <h6 className="fw-bold mb-2">{enrichedStation.name}</h6>

                <p className="mb-1" style={{ color: '#6c757d' }}>
                    📍 <a 
                        href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                            color: '#0d6efd', 
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        title={`Ouvrir dans Google Maps (${station.latitude}, ${station.longitude})`}
                    >
                        {isLoadingAddress ? 'Chargement de l\'adresse...' : 
                         enrichedStation.address ? enrichedStation.address : 'Voir sur la carte'}
                    </a>
                </p>
                
                {enrichedStation.power_kw && (
                    <p className="mb-1" style={{ color: '#6c757d' }}>
                        ⚡ Puissance: {enrichedStation.power_kw} kW
                    </p>
                )}
                {enrichedStation.price_per_kwh && (
                    <p className="mb-2" style={{ color: '#6c757d' }}>
                        💰 Prix: {enrichedStation.price_per_kwh}€/kWh
                    </p>
                )}
                <button 
                    className="btn btn-primary btn-sm w-100"
                    onClick={onBooking}
                >
                    Réserver
                </button>
            </div>
        </Popup>
    );
}

export default StationPopup;