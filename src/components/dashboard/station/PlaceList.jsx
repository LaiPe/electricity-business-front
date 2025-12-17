import { ListProvider, useListContext } from '../../../contexts/ListContext';
import PlaceCard from './PlaceCard';
import AddPlaceForm from './AddPlaceForm';
import { useState } from 'react';

function PlaceList({ places, onError }) {
    return (
        <div>
            <ListProvider initialItems={places}>
                <PlaceListContent onError={onError} />
            </ListProvider>
        </div>
    );
}

function PlaceListContent({ onError }) {
    const places = useListContext();
    const [openedAddForm, setOpenedAddForm] = useState(false);
    
    const toggleAddForm = () => {
        setOpenedAddForm(!openedAddForm);
    };

    const countStations = () => {
        return places.reduce((total, place) => total + place.charging_stations.length, 0);
    }
    
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h2 className='mb-1'>Mes Bornes</h2>
                    <span className="badge bg-secondary me-2">
                        {places.length} {places.length <= 1 ? 'lieu' : 'lieux'}
                    </span>
                    <span className="badge bg-secondary">
                        {countStations()} {countStations() <= 1 ? 'borne' : 'bornes'}
                    </span>
                </div>
                <button className="btn btn-primary mb-3 ms-3" onClick={toggleAddForm}>Ajouter un lieu</button>
            </div>
            {places.length === 0 ? (
                <p>Aucune borne trouvée.</p>
            ) : (
                <div className="d-flex flex-wrap gap-4">
                    {places.map((place) => (
                        <PlaceCard key={place.id} place={place} onError={onError} />
                    ))}
                </div>
            )}
            { openedAddForm && <AddPlaceForm onClose={toggleAddForm}/> }
        </div>
    );
}

export default PlaceList;