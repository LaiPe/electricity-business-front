import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiCall } from '../hooks/useApiCall';
import { addBooking } from '../services/BookingService';
import { getUserVehicles } from '../services/VehicleService';
import ChargingEstimate from '../components/booking/ChargingEstimate';

function BookingCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const { execute, loading } = useApiCall();
    
    // Récupérer le state de navigation
    const navigationState = location.state || null;
    const station = navigationState?.station || null;
    const booking = navigationState?.booking || null;
    const formData = navigationState?.formData || null;

    // États du composant
    const [status, setStatus] = useState('pending'); // 'pending' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    
    // États pour les véhicules
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [vehiclesLoading, setVehiclesLoading] = useState(true);

    // Charger les véhicules de l'utilisateur
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const userVehicles = await getUserVehicles();
                setVehicles(userVehicles);
                // Sélectionner le premier véhicule par défaut s'il y en a
                if (userVehicles.length > 0) {
                    setSelectedVehicleId(userVehicles[0].id.toString());
                }
            } catch (err) {
                console.error('Erreur lors du chargement des véhicules:', err);
            } finally {
                setVehiclesLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    // Rediriger si pas de données de navigation
    useEffect(() => {
        if (!station || !booking) {
            navigate('/search');
        }
    }, [station, booking, navigate]);

    // Redirection automatique après succès ou erreur
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => {
                if (status === 'success') {
                    navigate('/dashboard/bookings');
                } else {
                    navigate('/search', { state: formData });
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [status, navigate, formData]);

    const handleConfirmBooking = async () => {
        if (!station || !booking || !selectedVehicleId) return;

        const bookingData = {
            station_id: station.id,
            vehicle_id: parseInt(selectedVehicleId),
            start_date: booking.startDate,
            expected_end_date: booking.endDate
        };

        try {
            await execute(
                () => addBooking(bookingData),
                {
                    onSuccess: () => {
                        setStatus('success');
                    },
                    onError: (err) => {
                        console.error('Erreur lors de la création de la réservation:', err);
                        setStatus('error');
                        setErrorMessage(err.message || 'Une erreur est survenue lors de la réservation.');
                    },
                    errorMessage: null // On gère l'erreur nous-mêmes
                }
            );
        } catch (err) {
            // L'erreur est déjà gérée par onError
        }
    };

    const handleCancel = () => {
        navigate('/search', { state: formData });
    };

    // Si pas de données, afficher rien (la redirection se fera)
    if (!station || !booking) {
        return null;
    }

    // Formater les dates pour l'affichage
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const formattedDate = startDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedStartTime = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return (
        <main className="hero-fullscreen-height d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
            <div 
                className="card shadow-lg border-0" 
                style={{ 
                    maxWidth: '500px', 
                    width: '90%',
                    borderRadius: '20px'
                }}
            >
                <div className="card-body p-4 p-md-5">
                    {/* État en attente de confirmation */}
                    {status === 'pending' && (
                        <>
                            <div className="text-center mb-4">
                                <div 
                                    className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3"
                                    style={{ width: '80px', height: '80px' }}
                                >
                                    <i className="bi bi-ev-station text-primary" style={{ fontSize: '2.5rem' }}></i>
                                </div>
                                <h2 className="fw-bold mb-2">Confirmer la réservation</h2>
                                <p className="text-muted mb-0">Vérifiez les détails avant de confirmer</p>
                            </div>

                            <div className="bg-light rounded-3 p-3 mb-4">
                                <div className="d-flex align-items-start mb-3">
                                    <i className="bi bi-lightning-charge-fill text-warning me-3" style={{ fontSize: '1.5rem' }}></i>
                                    <div>
                                        <h6 className="fw-bold mb-1">{station.name}</h6>
                                        {station.power_kw && (
                                            <small className="text-muted">Puissance: {station.power_kw} kW</small>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex align-items-start mb-3">
                                    <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '1.5rem' }}></i>
                                    <div>
                                        <h6 className="fw-bold mb-1 text-capitalize">{formattedDate}</h6>
                                        <small className="text-muted">
                                            De {formattedStartTime} à {formattedEndTime}
                                        </small>
                                    </div>
                                </div>

                                {station.price_per_kwh && (
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-currency-euro text-success me-3" style={{ fontSize: '1.5rem' }}></i>
                                        <div>
                                            <h6 className="fw-bold mb-1">{station.price_per_kwh}€/kWh</h6>
                                            <small className="text-muted">Tarif de la borne</small>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sélection du véhicule */}
                            <div className="mb-4">
                                <label htmlFor="vehicle-select" className="form-label fw-bold">
                                    <i className="bi bi-car-front me-2"></i>
                                    Sélectionnez votre véhicule
                                </label>
                                {vehiclesLoading ? (
                                    <div className="d-flex align-items-center text-muted">
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Chargement des véhicules...
                                    </div>
                                ) : vehicles.length === 0 ? (
                                    <div className="alert alert-warning py-2 mb-0">
                                        <small>
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Vous n'avez aucun véhicule enregistré. 
                                            <a href="/dashboard/vehicles" className="alert-link ms-1">Ajouter un véhicule</a>
                                        </small>
                                    </div>
                                ) : (
                                    <select
                                        id="vehicle-select"
                                        className="form-select"
                                        value={selectedVehicleId}
                                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                                        disabled={loading}
                                    >
                                        {vehicles.map((vehicle) => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.vehicle_model.make} {vehicle.vehicle_model.model} {vehicle.registration_number ? `(${vehicle.registration_number})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Estimations */}
                            {selectedVehicleId && vehicles.length > 0 && (
                                <ChargingEstimate
                                    station={station}
                                    vehicle={vehicles.find(v => v.id.toString() === selectedVehicleId)}
                                    startDate={booking.startDate}
                                    endDate={booking.endDate}
                                />
                            )}

                            <div className="d-grid gap-2">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={handleConfirmBooking}
                                    disabled={loading || !selectedVehicleId || vehicles.length === 0}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Réservation en cours...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i>
                                            Confirmer la réservation
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="btn btn-outline-secondary"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Annuler
                                </button>
                            </div>
                        </>
                    )}

                    {/* État succès */}
                    {status === 'success' && (
                        <div className="text-center py-4">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-4"
                                style={{ width: '100px', height: '100px' }}
                            >
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3.5rem' }}></i>
                            </div>
                            <h2 className="fw-bold text-success mb-3">Réservation confirmée !</h2>
                            <p className="text-muted mb-4">
                                Votre demande de réservation a été envoyée avec succès. 
                                Vous serez notifié lorsque le propriétaire aura accepté votre réservation.
                            </p>
                            <div className="d-flex align-items-center justify-content-center text-muted">
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                <small>Redirection vers vos réservations...</small>
                            </div>
                        </div>
                    )}

                    {/* État erreur */}
                    {console.log(status, errorMessage)}
                    {status === 'error' && (
                        <div className="text-center py-4">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mb-4"
                                style={{ width: '100px', height: '100px' }}
                            >
                                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3.5rem' }}></i>
                            </div>
                            <h2 className="fw-bold text-danger mb-3">Échec de la réservation</h2>
                            <p className="text-muted mb-4">
                                {errorMessage || 'Une erreur est survenue lors de la réservation. Veuillez réessayer.'}
                            </p>
                            <div className="d-flex align-items-center justify-content-center text-muted">
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                <small>Retour à la recherche...</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default BookingCreate;