import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserVehicles } from '../../services/VehicleService';
import VehicleList from '../../components/dashboard/vehicle/VehicleList';
import Spinner from '../../components/spinner/Spinner';

function Vehicles() {
    const { isAuthenticated } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);

            try {
                const data = await getUserVehicles();
                setVehicles(data);
            } catch (error) {
                setError('Erreur chargement véhicules:');
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
            {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                    <Spinner />
                </div>
            ) : (
                <VehicleList vehicles={vehicles} onError={setError} />
            )}
        </div>
    );
}

export default Vehicles;