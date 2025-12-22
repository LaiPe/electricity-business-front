import {useEffect, useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import {getBookingsAsVehicleOwner, getBookingsAsStationOwner} from '../../services/BookingService';
import DualBookingView from '../../components/dashboard/booking/DualBookingView';
import ToggleSwitch from '../../components/form/ToggleSwitch';


function Bookings() {
    const { isAuthenticated } = useAuth();

    const [bookingsAsVehicleOwner, setBookingsAsVehicleOwner] = useState([]);
    const [bookingsAsStationOwner, setBookingsAsStationOwner] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
            const fetchBookingsAsVehicleOwner = async () => {
                try {
                    const data = await getBookingsAsVehicleOwner();
                    // for each booking, fetch user public info & station info

                    setBookingsAsVehicleOwner(data);
                } catch (error) {
                    console.error('Erreur chargement stations', error);
                    throw error;
                }
            };

            const fetchBookingsAsStationOwner = async () => {
                try {
                    const data = await getBookingsAsStationOwner();
                    // for each booking, fetch user public info & vehicle info

                    setBookingsAsStationOwner(data);
                } catch (error) {
                    console.error('Erreur chargement réservations', error);
                    throw error;
                }
            };

            if (isAuthenticated) {
                try {
                    setLoading(true);
                    fetchBookingsAsVehicleOwner();
                    fetchBookingsAsStationOwner();
                   
                } catch (error) {
                    setError('Erreur chargement réservations');
                } finally {
                    setLoading(false);
                }
            }
        }, [isAuthenticated]);

        const [toggleViewState, setToggleViewState] = useState('vehicleOwner');
        
        const handleToggleView = (newValue) => {
            setToggleViewState(newValue);
        }
        

    return (
        <div>
            {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}
            
            <h2 className='mb-2'>Mes Réservations</h2>
            
            <div className="mb-4">
                <ToggleSwitch
                    leftLabel="Mes véhicules"
                    rightLabel="Mes bornes"
                    leftValue="vehicleOwner"
                    rightValue="stationOwner"
                    value={toggleViewState}
                    onChange={handleToggleView}
                />
            </div> 

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                    <Spinner />
                </div>
            ) : ( 
                toggleViewState === 'vehicleOwner' ? (
                    <DualBookingView bookings={bookingsAsVehicleOwner} onError={setError} asVehicleOwner /> 
                ) : (
                    <DualBookingView bookings={bookingsAsStationOwner} onError={setError} asStationOwner />
                )
            )}
        </div>
    );
}

export default Bookings;