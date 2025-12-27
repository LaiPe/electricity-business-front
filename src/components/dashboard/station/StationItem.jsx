import { useState } from "react";
import UpdateStationForm from "./UpdateStationForm";
import Button from "../../form/Button";
import { deleteStation } from "../../../services/StationService";
import { useListDispatchMethodsContext } from "../../../contexts/ListContext";
import { useApiCall } from '../../../hooks/useApiCall';

function StationItem({ station, place }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(price);
    };

    const { execute, loading } = useApiCall();
    const [isEditing, setIsEditing] = useState(false);
    const { updateItem } = useListDispatchMethodsContext();
    
    const toggleEditing = () => {
        setIsEditing(!isEditing);
    }

    const handleDelete = async () => {
        // Confirmation de suppression
        const confirmDelete = window.confirm(
            `Êtes-vous sûr de vouloir supprimer la station "${station.name}" ?\n\nCette action est irréversible.`
        );
        
        if (!confirmDelete) {
            return;
        }
        
        await execute(() => deleteStation(station.id), {
            onSuccess: () => {
                const updatedPlace = {
                    ...place,
                    charging_stations: place.charging_stations.filter(s => s.id !== station.id)
                };
                updateItem(updatedPlace);
            }
        });
    }

    return (
        <li className="list-group-item py-3">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" style={{width: '48px', height: '48px'}}>
                            <i className="bi bi-lightning-charge-fill text-success" style={{fontSize: '1.5rem'}}></i>
                        </div>
                        <div>
                            <h6 className="card-title mb-1">
                                {station.name}
                            </h6>
                            <div className="d-flex gap-2 align-items-center">
                                <span className="badge bg-secondary">
                                    <i className="bi bi-speedometer2 me-1"></i>
                                    {station.power_kw} kW
                                </span>
                                <span className="badge bg-secondary">
                                    <i className="bi bi-currency-euro me-1"></i>
                                    {formatPrice(station.price_per_kwh)}/kWh
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            className="btn-sm" 
                            variant="outline-primary" 
                            title="Modifier la borne"
                            onClick={toggleEditing}
                        >
                            <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                            className="btn-sm" 
                            variant="outline-danger" 
                            title="Supprimer la borne"
                            onClick={handleDelete}
                            disabled={loading}
                            loading={loading}
                            loadingText="Suppression..."
                        >
                            <i className="bi bi-trash"></i>
                        </Button>
                    </div>
                </div>
                
                <div className="pt-3">
                    {station.instructions && (
                        <div className="row text-muted small">
                            <div className="col-12">
                                <i className="bi bi-info-circle me-1"></i>
                                Instructions : {station.instructions}
                            </div>
                        </div>
                    )}
                    <div className="row text-muted small">
                        <div className="col-12">
                            <i className="bi bi-geo-alt me-1"></i>
                            Position : {station.latitude?.toFixed(4)}, {station.longitude?.toFixed(4)}
                        </div>
                    </div>
                </div>

                {isEditing && <UpdateStationForm station={station} place={place} onClose={toggleEditing} />}
        </li>
    );
}

export default StationItem;