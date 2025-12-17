import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPlacesWithStations } from '../../services/StationService';
import PlaceList from '../../components/dashboard/station/PlaceList';
import Spinner from '../../components/spinner/Spinner';

function Stations() {
    const { isAuthenticated } = useAuth();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
            const fetchPlaces = async () => {
                setLoading(true);
    
                try {
                    const data = await getUserPlacesWithStations();
                    setPlaces(data);
                } catch (error) {
                    setError('Erreur chargement stations:');
                } finally {
                    setLoading(false);
                }
            };

            if (isAuthenticated) {
                fetchPlaces();
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
                <PlaceList places={places} onError={setError} />
            )}
        </div>
    );
}

export default Stations;