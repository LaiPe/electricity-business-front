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
    
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h2 className='mb-1'>Mes Stations</h2>
                    <span className="badge bg-secondary">
                        {places.length} {places.length <= 1 ? 'station' : 'stations'}
                    </span>
                    <button className="btn btn-primary mb-3 ms-3" onClick={toggleAddForm}>Ajouter une station</button>
                </div>
            </div>
            {places.length === 0 ? (
                <p>Aucune station trouvée.</p>
            ) : (
                <div className="list-group">
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