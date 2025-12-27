import { useState } from 'react';
import { useBookingsDispatchMethodsContext } from '../../../contexts/BookingsContext';
import { 
    acceptBooking as acceptBookingAPI, 
    rejectBooking as rejectBookingAPI,
    cancelBooking as cancelBookingAPI, 
    getBookingPdf 
} from '../../../services/BookingService';
import { useApiCall } from '../../../hooks/useApiCall';
import StationLocationModal from './StationLocationModal';

const STATUS_LABELS = {
    PENDING_ACCEPT: { label: 'En attente', className: 'bg-warning text-dark' },
    ACCEPTED: { label: 'Acceptée', className: 'bg-success' },
    REJECTED: { label: 'Refusée', className: 'bg-danger' },
    CANCELLED: { label: 'Annulée', className: 'bg-secondary' },
    ONGOING: { label: 'En cours', className: 'bg-info' },
    COMPLETED: { label: 'Terminée', className: 'bg-primary' },
};

/**
 * Composant unifié pour afficher les tableaux de réservations
 * 
 * @param {Object} props
 * @param {Array} props.bookings - Liste des réservations
 * @param {boolean} props.showAcceptReject - Afficher les boutons accepter/refuser (pour les réservations en attente)
 * @param {boolean} props.showCancel - Afficher le bouton annuler
 * @param {boolean} props.showPdfDownload - Afficher le bouton de téléchargement PDF
 * @param {boolean} props.showLocateStation - Afficher le bouton de localisation de la borne
 * @param {boolean} props.showStatus - Afficher le statut de la réservation
 * @param {boolean} props.isVehicleOwnerView - Vue propriétaire de véhicule (ordre des colonnes différent)
 */
function GenericBookingTable({ 
    bookings, 
    showAcceptReject = false,
    showCancel = false,
    showPdfDownload = false,
    showLocateStation = false,
    showStatus = false,
    isVehicleOwnerView = false
}) {
    const { execute } = useApiCall();
    const [selectedStation, setSelectedStation] = useState(null);
    
    // Utiliser le contexte seulement si on a besoin des actions
    let dispatchMethods = {};
    try {
        dispatchMethods = useBookingsDispatchMethodsContext() || {};
    } catch (e) {
        // Le contexte n'est pas disponible
    }
    
    const { acceptBooking, rejectBooking, cancelBooking } = dispatchMethods;

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return 'Non définie';
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        
        if (diffMs < 0) return 'Invalide';
        
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        
        if (hours === 0) {
            return `${minutes} min`;
        } else if (minutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    };

    const handleAccept = async (booking) => {
        await execute(() => acceptBookingAPI(booking.id), {
            onSuccess: () => acceptBooking && acceptBooking(booking)
        });
    };

    const handleReject = async (booking) => {
        await execute(() => rejectBookingAPI(booking.id), {
            onSuccess: () => rejectBooking && rejectBooking(booking)
        });
    };

    const handleCancel = async (booking) => {
        const stationName = `${booking.station?.place?.name || ''} - ${booking.station?.name || ''}`.trim().replace(/^- /, '');
        const startDate = formatDateTime(booking.start_date);
        
        const confirmMessage = `Êtes-vous sûr de vouloir annuler cette réservation ?\n\nBorne : ${stationName}\nDate : ${startDate}`;
        
        if (window.confirm(confirmMessage)) {
            await execute(() => cancelBookingAPI(booking.id), {
                onSuccess: () => cancelBooking && cancelBooking(booking)
            });
        }
    };

    const handleDownloadPDF = async (booking) => {
        await execute(() => getBookingPdf(booking.id), {
            onSuccess: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `booking_${booking.id}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        });
    };

    const handleLocateStation = (station) => {
        setSelectedStation(station);
    };

    const handleCloseModal = () => {
        setSelectedStation(null);
    };

    // Déterminer si on doit afficher des colonnes d'action
    const hasActions = showAcceptReject || showCancel;
    const hasAnyActionColumn = hasActions || showPdfDownload;

    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-muted mb-0">
                    <i className="bi bi-calendar-x me-2"></i>
                    Aucune réservation trouvée
                </p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        {isVehicleOwnerView ? (
                            <>
                                <th scope="col">Véhicule</th>
                                <th scope="col">Date et durée</th>
                                <th scope="col">Propriétaire de la borne</th>
                                <th scope="col">Borne</th>
                                {showStatus && <th scope="col">Statut</th>}
                                {showPdfDownload && <th scope="col">Confirmation</th>}
                                {hasActions && <th scope="col">Actions</th>}
                            </>
                        ) : (
                            <>
                                <th scope="col">Borne</th>
                                <th scope="col">Date et durée</th>
                                <th scope="col">Propriétaire du véhicule</th>
                                <th scope="col">Véhicule</th>
                                {showStatus && <th scope="col">Statut</th>}
                                {showPdfDownload && <th scope="col">Confirmation</th>}
                                {hasActions && <th scope="col">Actions</th>}
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => {
                        const status = STATUS_LABELS[booking.state] || { label: booking.state, className: 'bg-secondary' };
                        
                        return (
                        <tr key={booking.id}>
                            {isVehicleOwnerView ? (
                                <>
                                    <td>
                                        <div>
                                            {booking.vehicle?.vehicle_model?.make} {booking.vehicle?.vehicle_model?.model}
                                        </div>
                                        <small className="text-muted">
                                            <code className="text-primary">{booking.vehicle?.registration_number}</code>
                                        </small>
                                    </td>
                                    <td>
                                        <div>{formatDateTime(booking.start_date)}</div>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            {calculateDuration(booking.start_date, booking.expected_end_date)}
                                        </small>
                                    </td>
                                    <td>
                                        {booking.station?.owner?.first_name} {booking.station?.owner?.last_name}
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center flex-column gap-1">
                                            <span>{booking.station?.name}</span>
                                            {showLocateStation && booking.station && (
                                                <button 
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm mb-1"
                                                    onClick={() => handleLocateStation(booking.station)}
                                                    title="Localiser la borne"
                                                >
                                                    <i className="bi bi-map me-1"></i>
                                                    Localiser
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span>
                                                {booking.station?.place?.name 
                                                    ? `${booking.station.place.name} - ${booking.station?.name}`
                                                    : booking.station?.name}
                                            </span>
                                            {showLocateStation && booking.station && (
                                                <button 
                                                    type="button"
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleLocateStation(booking.station)}
                                                    title="Localiser la borne"
                                                >
                                                    <i className="bi bi-map me-1"></i>
                                                    Localiser
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div>{formatDateTime(booking.start_date)}</div>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            {calculateDuration(booking.start_date, booking.expected_end_date)}
                                        </small>
                                    </td>
                                    <td>
                                        {booking.vehicle?.owner?.first_name && booking.vehicle?.owner?.last_name 
                                            ? `${booking.vehicle.owner.first_name} ${booking.vehicle.owner.last_name}`
                                            : 'Non disponible'}
                                    </td>
                                    <td>
                                        <div>
                                            {booking.vehicle?.vehicle_model 
                                                ? `${booking.vehicle.vehicle_model.make} ${booking.vehicle.vehicle_model.model} ${booking.vehicle.vehicle_model.year || ''}`
                                                : 'Non disponible'}
                                        </div>
                                        <small className="text-muted">
                                            <code className="text-primary">{booking.vehicle?.registration_number || 'Non disponible'}</code>
                                        </small>
                                    </td>
                                </>
                            )}
                            {showStatus && (
                                <td>
                                    <span className={`badge ${status.className}`}>
                                        {status.label}
                                    </span>
                                </td>
                            )}
                            {showPdfDownload && (
                                <td>
                                    {(booking.state === 'ACCEPTED' || booking.state === 'ONGOING' || booking.state === 'COMPLETED') ? (
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleDownloadPDF(booking)}
                                            title="Télécharger le PDF de confirmation"
                                        >
                                            <i className="bi bi-file-earmark-pdf"></i>
                                        </button>
                                    ) : (
                                        <span 
                                            className="d-inline-block" 
                                            title="Disponible après acceptation de la réservation"
                                        >
                                            <button 
                                                className="btn btn-secondary btn-sm" 
                                                disabled
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                <i className="bi bi-file-earmark-pdf"></i>
                                            </button>
                                        </span>
                                    )}
                                </td>
                            )}
                            {hasActions && (
                                <td>
                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                        {showAcceptReject && booking.state === 'PENDING_ACCEPT' && (
                                            <>
                                                <button 
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleAccept(booking)}
                                                    title="Accepter la réservation"
                                                >
                                                    <i className="bi bi-check-lg"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleReject(booking)}
                                                    title="Refuser la réservation"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </>
                                        )}
                                        {showCancel && (
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleCancel(booking)}
                                                title="Annuler la réservation"
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            )}
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

export default GenericBookingTable;
