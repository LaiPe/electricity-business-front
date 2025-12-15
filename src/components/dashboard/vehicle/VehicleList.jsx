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
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h2 className='mb-1'>Mes Véhicules</h2>
                    <span className="badge bg-secondary">
                        {vehicles.length} {vehicles.length <= 1 ? 'véhicule' : 'véhicules'}
                    </span>
                </div>
                <button className="btn btn-primary mb-3" onClick={toggleAddForm}>Ajouter un véhicule</button>
            </div>
            {vehicles.length === 0 ? (
                <p>Aucun véhicule trouvé.</p>
            ) : (
                <div className="list-group">
                    {vehicles.map((vehicle) => (
                        <VehicleItem key={vehicle.id} vehicle={vehicle} onError={onError} />
                    ))}
                </div>
            )}
            { openedAddForm && <AddVehicleForm onClose={toggleAddForm}/> }
        </div>
    );
}

export default VehicleList;