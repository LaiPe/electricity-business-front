import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPlacesWithStations } from '../../services/StationService';
import PlaceList from '../../components/dashboard/station/PlaceList';
import Spinner from '../../components/spinner/Spinner';
import { useGlobalErrorContext } from '../../contexts/GlobalErrorContext';

function Stations() {
    const { setGlobalError } = useGlobalErrorContext();
    const { isAuthenticated, checkAuthStatus } = useAuth();

    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const fetchPlaces = async () => {
                setLoading(true);
    
                try {
                    const data = await getUserPlacesWithStations();
                    setPlaces(data);
                } catch (error) {
                    setGlobalError('Erreur lors du chargement des lieux et stations');
                    console.error('Erreur chargement lieux et stations', error);
                    await checkAuthStatus();
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
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{minHeight: '300px'}}>
                    <Spinner />
                </div>
            ) : (
                <PlaceList places={places} />
            )}
        </div>
    );
}

export default Stations;