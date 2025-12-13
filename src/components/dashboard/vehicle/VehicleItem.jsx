import { useState } from 'react';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import { deleteVehicle, updateVehicle } from '../../../services/VehicleService';
import Input from '../../form/Input';
import UpdateVehicleForm from './UpdateVehicleForm';

function VehicleItem({ vehicle, onError }) {
    const {deleteItem, updateItem} = useListDispatchMethodsContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    }

    const handleDelete = (vehicle) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            try {
                deleteVehicle(vehicle);
                deleteItem(vehicle);
            } catch (error) {
                onError('Erreur suppression véhicule.');
            }
        }
    };

    return (
        <div key={vehicle.id} className="list-group-item">
            <div className="d-flex align-items-center">
                <div className="me-3">
                    <i className="bi bi-car-front" style={{fontSize: '2rem', color: '#0d6efd'}}></i>
                </div>
                <div className="flex-grow-1">
                    <h5 className="mb-1">
                        {vehicle.vehicle_model.make} {vehicle.vehicle_model.model}
                    </h5>
                    { isEditing ? (
                        <UpdateVehicleForm vehicle={vehicle} />
                    ) : (
                        <p className="mb-1 text-muted">
                            Immatriculation : {vehicle.registration_number}
                        </p>
                    )}
                </div>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={toggleEditing}
                        title={`${isEditing ? 'Annuler la modification' : 'Modifier le véhicule'}`}
                    >
                        <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil'}`}></i>
                    </button>
                    <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(vehicle)}
                        title="Supprimer le véhicule"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={toggleExpanded}
                        aria-expanded={isExpanded}
                        title={isExpanded ? "Réduire les détails" : "Voir les détails"}
                    >
                        <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>
                </div>
            </div>
            
            {isExpanded && (
                <div className="mt-3 pt-3 border-top">
                    <div className="row">
                        <div className="col-md-4">
                            <strong><i className="bi bi-calendar3 me-1"></i>Année:</strong> {vehicle.vehicle_model.year}
                        </div>
                        <div className="col-md-4">
                            <strong><i className="bi bi-battery me-1"></i>Capacité batterie:</strong> {vehicle.vehicle_model.battery_capacity_kwh} kWh
                        </div>
                        <div className="col-md-4">
                            <strong><i className="bi bi-lightning me-1"></i>Consommation:</strong> {vehicle.vehicle_model.consumption_kwh_per_100km} kWh/100km
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VehicleItem;