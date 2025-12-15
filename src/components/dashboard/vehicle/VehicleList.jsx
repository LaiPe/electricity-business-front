import { useState } from 'react';
import { ListProvider, useListContext } from '../../../contexts/ListContext';
import AddVehicleForm from './AddVehicleForm';

import VehicleItem from './VehicleItem';

function VehicleList({ vehicles, onError }) {
    return (
        <div>
            <ListProvider initialItems={vehicles}>
                <VehicleListContent onError={onError} />
            </ListProvider>
        </div>
    );
}

function VehicleListContent({ onError }) {
    const vehicles = useListContext();
    const [openedAddForm, setOpenedAddForm] = useState(false);

    const toggleAddForm = () => {
        setOpenedAddForm(!openedAddForm);
    };

    return (
        <div>
            <h2>Mes Véhicules</h2>
            <button className="btn btn-primary mb-3" onClick={toggleAddForm}>Ajouter un véhicule</button>
            {vehicles.length === 0 ? (
                <p>Aucun véhicule trouvé.</p>
            ) : (
                <div className="list-group">
                    {vehicles.map((vehicle) => (
                        <VehicleItem key={vehicle.id} vehicle={vehicle} onError={onError} />
                    ))}
                </div>
            )}
            { openedAddForm && <AddVehicleForm onError={onError} onClose={toggleAddForm}/> }
        </div>
    );
}

export default VehicleList;