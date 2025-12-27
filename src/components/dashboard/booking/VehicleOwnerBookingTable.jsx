import { useMemo, useState } from "react";
import StationLocationModal from "./StationLocationModal";

const STATUS_LABELS = {
    PENDING_ACCEPT: { label: 'En attente', className: 'bg-warning text-dark' },
    ACCEPTED: { label: 'Acceptée', className: 'bg-success' },
    REJECTED: { label: 'Refusée', className: 'bg-danger' },
    CANCELLED: { label: 'Annulée', className: 'bg-secondary' },
    IN_PROGRESS: { label: 'En cours', className: 'bg-info' },
    COMPLETED: { label: 'Terminée', className: 'bg-primary' },
};

function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function VehicleOwnerBookingTable({ bookings }) {
    const [selectedStation, setSelectedStation] = useState(null);

    const bookingsList = useMemo(() => {
        if (!bookings || !Array.isArray(bookings)) return [];
        return bookings;
    }, [bookings]);

    const handleLocateStation = (station) => {
        setSelectedStation(station);
    };

    const handleCloseModal = () => {
        setSelectedStation(null);
    };

    if (bookingsList.length === 0) {
        return (
            <div className="text-muted py-4">
                <i className="bi bi-calendar-x me-2"></i>
                Aucune réservation à afficher
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th scope="col">Modèle du véhicule</th>
                        <th scope="col">Immatriculation</th>
                        <th scope="col">Date et heure début</th>
                        <th scope="col">Date et heure fin</th>
                        <th scope="col">Propriétaire de la borne</th>
                        <th scope="col">Borne</th>
                        <th scope="col">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingsList.map((booking) => {
                        const status = STATUS_LABELS[booking.state] || { label: booking.state, className: 'bg-secondary' };
                        console.log("Rendering booking:", booking);
                        return (
                            <tr key={booking.id}>
                                <td>
                                    {booking.vehicle?.vehicle_model?.make} {booking.vehicle?.vehicle_model?.model}
                                </td>
                                <td>
                                    <code className="text-primary">{booking.vehicle?.registration_number}</code>
                                </td>
                                <td>{formatDateTime(booking.start_date)}</td>
                                <td>{formatDateTime(booking.expected_end_date)}</td>
                                <td>
                                    {booking.station.owner?.first_name} {booking.station.owner?.last_name}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <span>{booking.station?.name}</span>
                                        <button 
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleLocateStation(booking.station)}
                                            title="Localiser la borne"
                                        >
                                            <i className="bi bi-map me-1"></i>
                                            Localiser
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${status.className}`}>
                                        {status.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {selectedStation && (
                <StationLocationModal 
                    station={selectedStation} 
                    onClose={handleCloseModal} 
                />
            )}
        </div>
    );
}
