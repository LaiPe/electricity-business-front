function BookingTable({ bookings, onError }) {
    
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
            // TODO: Implémenter l'appel API pour télécharger le PDF de confirmation
            console.log('Téléchargement du PDF pour la réservation:', booking.id);
            
            // Exemple d'implémentation:
            // const response = await getBookingConfirmationPDF(booking.id);
            // const blob = new Blob([response], { type: 'application/pdf' });
            // const url = window.URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = url;
            // link.download = `confirmation-reservation-${booking.id}.pdf`;
            // link.click();
            // window.URL.revokeObjectURL(url);
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
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleDownloadPDF(booking)}
                                    title="Télécharger le PDF de confirmation"
                                >
                                    <i className="bi bi-file-earmark-pdf"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>    
        </div>
    );
}

export default BookingTable;
