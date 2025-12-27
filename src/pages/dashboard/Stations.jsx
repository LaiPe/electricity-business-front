import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPlacesWithStations } from '../../services/StationService';
import PlaceList from '../../components/dashboard/station/PlaceList';
import Spinner from '../../components/spinner/Spinner';
import { useApiCall } from '../../hooks/useApiCall';

function Stations() {
    const { execute, loading } = useApiCall();
    const { isAuthenticated } = useAuth();

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            await execute(() => getUserPlacesWithStations(), {
                onSuccess: (data) => setPlaces(data)
            });
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