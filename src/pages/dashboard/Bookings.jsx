import {useEffect, useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import {getBookingsAsVehicleOwner, getBookingsAsStationOwner, exportBookingsExcelFormat} from '../../services/BookingService';
import DualBookingView from '../../components/dashboard/booking/DualBookingView';
import ToggleSwitch from '../../components/form/ToggleSwitch';
import { useGlobalErrorContext } from '../../contexts/GlobalErrorContext';


function Bookings() {
    const { setGlobalError } = useGlobalErrorContext();
    const { isAuthenticated, checkAuthStatus } = useAuth();

    const [bookingsAsVehicleOwner, setBookingsAsVehicleOwner] = useState([]);
    const [bookingsAsStationOwner, setBookingsAsStationOwner] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const loadBookings = async () => {
        try {
            setLoading(true);
            
            await Promise.all([
                fetchBookingsAsVehicleOwner(),
                fetchBookingsAsStationOwner()
            ]);
            
        } catch (error) {
            setGlobalError('Erreur lors du chargement des réservations');
            console.error('Erreur lors du chargement des réservations:', error);
            await checkAuthStatus();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadBookings();
        }
    }, [isAuthenticated]);

    const handleRefreshBookings = () => {
        loadBookings();
    };

    const handleBookingsExportExcel = async () => {
        try {
            const blob = await exportBookingsExcelFormat();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'mes_reservations.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'export Excel:', error);
            setGlobalError('Erreur lors de l\'export des réservations');
        }
    };

    const [toggleViewState, setToggleViewState] = useState('vehicleOwner');
    
    const handleToggleView = (newValue) => {
        setToggleViewState(newValue);
    }
        

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className='mb-0'>Mes Réservations</h2>
                <div className="btn-group">
                    {toggleViewState === 'vehicleOwner' ? (
                        <>
                            <button type="button" className="btn btn-outline-primary">
                                <i className="bi bi-plus-lg me-1"></i>
                                Nouvelle réservation
                            </button>
                            <button type="button" className="btn btn-outline-primary" onClick={handleRefreshBookings}>
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Rafraîchir
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-outline-primary" onClick={handleRefreshBookings}>
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Rafraîchir
                        </button>
                    )}
                    <button 
                        type="button" 
                        className={`btn btn-primary dropdown-toggle dropdown-toggle-split dropdown-toggle-no-caret`}
                        href="#"
                        data-bs-toggle="dropdown" 
                    >
                        <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a className="dropdown-item" role="button" onClick={handleBookingsExportExcel}>
                                <i className="bi bi-file-earmark-excel me-2"></i>
                                Exporter mes réservations au format Excel (xlsx)
                            </a>
                        </li>
                    </ul>
                    
                </div>
            </div>
            
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
                    <DualBookingView bookings={bookingsAsVehicleOwner} asVehicleOwner /> 
                ) : (
                    <DualBookingView bookings={bookingsAsStationOwner} asStationOwner />
                )
            )}
        </div>
    );
}

export default Bookings;