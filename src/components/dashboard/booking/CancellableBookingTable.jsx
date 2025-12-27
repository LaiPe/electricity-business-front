import { useBookingsDispatchMethodsContext } from '../../../contexts/BookingsContext';
import { cancelBooking as cancelBookingAPI, getBookingPdf } from '../../../services/BookingService';

function CancellableBookingTable({ bookings, onError }) {
    const { cancelBooking } = useBookingsDispatchMethodsContext();

    const onCancel = async (booking) => {
        const stationName = `${booking.station?.place?.name || ''} - ${booking.station?.name || ''}`.trim().replace(/^- /, '');
        const startDate = formatDateTime(booking.start_date);
        
        const confirmMessage = `Êtes-vous sûr de vouloir annuler cette réservation ?\n\nBorne : ${stationName}\nDate : ${startDate}`;
        
        if (window.confirm(confirmMessage)) {
            try {
                await cancelBookingAPI(booking.id);
                cancelBooking(booking);
            } catch (error) {
                console.error('Erreur lors de l\'annulation de la réservation:', error);
                onError && onError('Erreur lors de l\'annulation de la réservation');
            }
        }
    };
    
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

    const handleDownloadPDF = async (booking) => {
        try {
            const blob = await getBookingPdf(booking.id);
            
            // Créer une URL pour le blob
            const url = window.URL.createObjectURL(blob);
            
            // Créer un lien de téléchargement
            const link = document.createElement('a');
            link.href = url;
            link.download = `booking_${booking.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Nettoyer
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            onError && onError('Erreur lors du téléchargement du PDF de confirmation');
        }
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
                        <th>Confirmation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.station?.place?.name} - {booking.station?.name}</td>
                            <td>{formatDateTime(booking.start_date)}</td>
                            <td>{formatDateTime(booking.expected_end_date)}</td>
                            <td>
                                {booking.vehicle?.owner?.first_name && booking.vehicle?.owner?.last_name 
                                    ? `${booking.vehicle.owner.first_name} ${booking.vehicle.owner.last_name}`
                                    : 'Non disponible'}
                            </td>
                            <td>
                                {booking.vehicle?.vehicle_model 
                                    ? `${booking.vehicle.vehicle_model.make} ${booking.vehicle.vehicle_model.model} ${booking.vehicle.vehicle_model.year}`
                                    : 'Non disponible'}
                            </td>
                            <td>
                                <code className="text-primary">
                                    {booking.vehicle?.registration_number || 'Non disponible'}
                                </code>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleDownloadPDF(booking)}
                                    title="Télécharger le PDF de confirmation"
                                >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                </button>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => onCancel(booking)}
                                    title="Annuler la réservation"
                                >
                                    <i className="bi bi-x-circle"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>    
        </div>
    );
}

export default CancellableBookingTable;
