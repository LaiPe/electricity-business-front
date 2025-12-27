import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles } from '../../services/VehicleService';
import VehicleList from '../../components/dashboard/vehicle/VehicleList';
import Spinner from '../../components/spinner/Spinner';
import { useApiCall } from '../../hooks/useApiCall';

function Vehicles() {
    const { execute, loading } = useApiCall();
    const { isAuthenticated } = useAuth();

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchVehicles = async () => {
            await execute(() => getUserVehicles(), {
                onSuccess: (data) => setVehicles(data)
            });
        };

        if (isAuthenticated) {
            fetchVehicles();
        }
    }, [isAuthenticated]);

    return (
        <div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                    <Spinner />
                </div>
            ) : (
                <VehicleList vehicles={vehicles} />
            )}
        </div>
    );
}

export default Vehicles;