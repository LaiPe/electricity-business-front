import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApiCall } from '../../hooks/useApiCall';
import { getBookingsAsVehicleOwner, getBookingsAsStationOwner } from '../../services/BookingService';
import { getUserVehicles } from '../../services/VehicleService';
import { getUserPlacesWithStations } from '../../services/StationService';
import BookingCalendar from '../../components/dashboard/calendar/BookingCalendar';
import Spinner from '../../components/spinner/Spinner';

function Overview() {
    const { execute } = useApiCall();
    const { isAuthenticated } = useAuth();

    const [vehicleOwnerBookings, setVehicleOwnerBookings] = useState([]);
    const [stationOwnerBookings, setStationOwnerBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        setLoading(true);
        
        await Promise.all([
            execute(() => getBookingsAsVehicleOwner(), {
                onSuccess: (data) => setVehicleOwnerBookings(data)
            }),
            execute(() => getBookingsAsStationOwner(), {
                onSuccess: (data) => setStationOwnerBookings(data)
            }),
            execute(() => getUserVehicles(), {
                onSuccess: (data) => setVehicles(data)
            }),
            execute(() => getUserPlacesWithStations(), {
                onSuccess: (data) => setPlaces(data)
            })
        ]);
        
        setLoading(false);
    };

    // Extraire toutes les stations des places
    const stations = places.flatMap(place => 
        (place.stations || []).map(station => ({
            ...station,
            placeName: place.name,
            address: place.address
        }))
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center hero-fullscreen-strict-height-minus-footer">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="h-100">
            <div className="row h-100 g-4">
                {/* Calendrier à gauche */}
                <div className="col-lg-7 col-xl-8 h-100">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bi bi-calendar3 me-2"></i>
                                Calendrier des réservations
                            </h5>
                        </div>
                        <div className="card-body">
                            <BookingCalendar 
                                vehicleOwnerBookings={vehicleOwnerBookings} 
                                stationOwnerBookings={stationOwnerBookings} 
                            />
                        </div>
                    </div>
                </div>

                {/* Listes à droite */}
                <div className="col-lg-5 col-xl-4 h-100">
                    <div className="d-flex flex-column gap-3 h-100">
                        {/* Liste des véhicules */}
                        <div className="card flex-grow-1" style={{ maxHeight: '50%' }}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <i className="bi bi-car-front me-2"></i>
                                    Mes véhicules
                                </h6>
                                <span className="badge bg-primary">{vehicles.length}</span>
                            </div>
                            <div className="card-body overflow-auto p-0">
                                {vehicles.length === 0 ? (
                                    <div className="text-center text-muted p-3">
                                        <i className="bi bi-car-front fs-1 d-block mb-2"></i>
                                        Aucun véhicule enregistré
                                    </div>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {vehicles.map(vehicle => (
                                            <li key={vehicle.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{vehicle.brand} {vehicle.model}</strong>
                                                    {vehicle.license_plate && (
                                                        <small className="text-muted d-block">{vehicle.license_plate}</small>
                                                    )}
                                                </div>
                                                {vehicle.battery_capacity_kwh && (
                                                    <span className="badge bg-secondary">
                                                        {vehicle.battery_capacity_kwh} kWh
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Liste des bornes */}
                        <div className="card flex-grow-1" style={{ maxHeight: '50%' }}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                    <i className="bi bi-ev-station me-2"></i>
                                    Mes bornes
                                </h6>
                                <span className="badge bg-success">{stations.length}</span>
                            </div>
                            <div className="card-body overflow-auto p-0">
                                {stations.length === 0 ? (
                                    <div className="text-center text-muted p-3">
                                        <i className="bi bi-ev-station fs-1 d-block mb-2"></i>
                                        Aucune borne enregistrée
                                    </div>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {stations.map(station => (
                                            <li key={station.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{station.name}</strong>
                                                    <small className="text-muted d-block">
                                                        {station.placeName}{station.address ? ` - ${station.address}` : ''}
                                                    </small>
                                                </div>
                                                <span className={`badge ${station.is_available ? 'bg-success' : 'bg-secondary'}`}>
                                                    {station.is_available ? 'Disponible' : 'Indisponible'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;