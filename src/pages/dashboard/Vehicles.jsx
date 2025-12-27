import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles } from '../../services/VehicleService';
import VehicleList from '../../components/dashboard/vehicle/VehicleList';
import Spinner from '../../components/spinner/Spinner';
import { useGlobalErrorContext } from '../../contexts/GlobalErrorContext';

function Vehicles() {
    const { setGlobalError } = useGlobalErrorContext();
    const { isAuthenticated, checkAuthStatus } = useAuth();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);

            try {
                const data = await getUserVehicles();
                setVehicles(data);
            } catch (error) {
                setGlobalError('Erreur lors du chargement des véhicules');
                console.error('Erreur chargement véhicules', error);
                await checkAuthStatus();
            } finally {
                setLoading(false);
            }
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