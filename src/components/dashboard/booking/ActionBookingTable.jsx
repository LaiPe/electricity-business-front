import { useBookingsDispatchMethodsContext } from '../../../contexts/BookingsContext';

function ActionBookingTable({ bookings, onError }) {
    const { acceptBooking, rejectBooking } = useBookingsDispatchMethodsContext();
    const onAccept = async (booking) => {
        try {
            acceptBooking(booking);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la réservation:', error);
            onError('Erreur lors de l\'acceptation de la réservation');
        }
    }
    const onReject = async (bookingId) => {}
    
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

    const renderActionButtons = (booking) => {
        if (booking.state === 'PENDING_ACCEPT') {
            return (
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onAccept(booking)}
                        title="Accepter la réservation"
                    >
                        <i className="bi bi-check-lg"></i>
                    </button>
                    <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => onReject && onReject(booking.id)}
                        title="Refuser la réservation"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            );
        }
        
        if (booking.state === 'ACCEPTED') {
            return (
                <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => onCancel && onCancel(booking.id)}
                    title="Annuler la réservation"
                >
                    <i className="bi bi-x-circle"></i> Annuler
                </button>
            );
        }
        
        return <span className="text-muted">Aucune action</span>;
    };

    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-muted mb-0">Aucune réservation trouvée</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Borne</th>
                        <th>Date et heure début</th>
                        <th>Date et heure fin</th>
                        <th>Propriétaire du véhicule</th>
                        <th>Modèle du véhicule</th>
                        <th>Plaque d'immatriculation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.station.place.name} - {booking.station.name}</td>
                            <td>{formatDateTime(booking.start_date)}</td>
                            <td>{formatDateTime(booking.expected_end_date)}</td>
                            <td>
                                {booking.vehicle?.owner?.first_name + ' ' + booking.vehicle?.owner?.last_name || 'Non disponible'}
                            </td>
                            <td>
                                {booking.vehicle?.vehicle_model?.make + ' ' + booking.vehicle?.vehicle_model?.model + ' ' + booking.vehicle?.vehicle_model?.year || 'Non disponible'}
                            </td>
                            <td>
                                <code className="text-primary">
                                    {booking.vehicle?.registration_number || 'Non disponible'}
                                </code>
                            </td>
                            <td>{renderActionButtons(booking)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>    
        </div>
    );
}

export default ActionBookingTable;