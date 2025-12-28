import {useEffect, useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import {getBookingsAsVehicleOwner, getBookingsAsStationOwner, exportBookingsExcelFormat} from '../../services/BookingService';
import DualBookingView from '../../components/dashboard/booking/DualBookingView';
import ToggleSwitch from '../../components/form/ToggleSwitch';
import { useApiCall } from '../../hooks/useApiCall';


function Bookings() {
    const { execute } = useApiCall();
    const { isAuthenticated } = useAuth();

    const [bookingsAsVehicleOwner, setBookingsAsVehicleOwner] = useState([]);
    const [bookingsAsStationOwner, setBookingsAsStationOwner] = useState([]);
    const [loading, setLoading] = useState(true);

    // Détecter si on est sur mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 991);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const loadBookings = async () => {
        setLoading(true);
        
        await Promise.all([
            execute(() => getBookingsAsVehicleOwner(), {
                onSuccess: (data) => setBookingsAsVehicleOwner(data)
            }),
            execute(() => getBookingsAsStationOwner(), {
                onSuccess: (data) => setBookingsAsStationOwner(data)
            })
        ]);
        
        setLoading(false);
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
        await execute(() => exportBookingsExcelFormat(), {
            onSuccess: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mes_reservations.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        });
    };

    const [toggleViewState, setToggleViewState] = useState('vehicleOwner');
    
    const handleToggleView = (newValue) => {
        setToggleViewState(newValue);
    }
        

    return (
        <div>
            <div className='d-flex justify-content-between align-items-start mb-4 gap-3'>
                <div className="d-flex flex-column">
                    <h2 className='mb-2'>Mes Réservations</h2>
                    <div>
                        <ToggleSwitch
                            leftLabel="Mes véhicules"
                            rightLabel="Mes bornes"
                            leftValue="vehicleOwner"
                            rightValue="stationOwner"
                            value={toggleViewState}
                            onChange={handleToggleView}
                        />
                    </div> 
                </div>
                <div className={` ${isMobile ? 'btn-group-vertical' : 'btn-group'}`}>
                    {toggleViewState === 'vehicleOwner' ? (
                        <>
                            <button type="button" className="btn btn-outline-primary">
                                <i className={`bi bi-plus-lg ${isMobile ? '' : 'me-1'}`}></i>
                                { !isMobile && "Nouvelle réservation" }
                            </button>
                            <button type="button" className="btn btn-outline-primary" onClick={handleRefreshBookings}>
                                <i className={`bi bi-arrow-clockwise ${isMobile ? '' : 'me-1'}`}></i>
                                { !isMobile && "Rafraîchir" }
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-outline-primary" onClick={handleRefreshBookings}>
                            <i className={`bi bi-arrow-clockwise ${isMobile ? '' : 'me-1'}`}></i>
                            { !isMobile && "Rafraîchir" }
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