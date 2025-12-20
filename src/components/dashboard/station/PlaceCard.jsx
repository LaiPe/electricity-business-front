import { useState } from "react";
import { deletePlace } from '../../../services/StationService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import AddStationForm from "./AddStationForm";
import UpdatePlaceForm from "./UpdatePlaceForm";
import Button from "../../form/Button";
import StationItem from "./StationItem";

function PlaceCard({ place, onError }) {
    const { deleteItem } = useListDispatchMethodsContext();
    const [openedAddForm, setOpenedAddForm] = useState(false);
    const toggleAddForm = () => {
        setOpenedAddForm(!openedAddForm);
    };

    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu et toutes ses bornes de recharge ?')) {
            try {
                await deletePlace(place.id);
                deleteItem(place);
            } catch (error) {
                const errorMessage = error?.message || 'Erreur lors de la suppression du lieu';
                onError(errorMessage);
                console.error('Erreur suppression lieu:', error);
            }
        }
    };
    

    return (
        <div className="card mb-2" style={{ minWidth: '23rem', width: '30%' }}>
            <div className="card-header py-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title">
                        <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                        {place.name}
                    </h5>
                    <div className="d-flex gap-2">
                        <Button 
                            className="btn-sm"
                            variant="outline-primary"
                            onClick={toggleEditing}
                            title={'Modifier le lieu'}
                        >
                            <i className={'bi bi-pencil'}></i>
                        </Button>
                        <Button  
                            className="btn-sm"
                            variant="outline-danger"
                            onClick={handleDelete}
                            title="Supprimer le lieu"
                        >
                            <i className="bi bi-trash"></i>
                        </Button>
                    </div>
                </div>
                <p className="card-text">{place.description}</p>
            </div>
            {place.charging_stations.length === 0 ? (
                <div className="card-body">
                    <p className="text-muted m-0">Aucune borne de charge disponible.</p>
                </div>
            ) : (
                <ul className="list-group list-group-flush">
                    {place?.charging_stations.map((station) => (
                        <StationItem key={station.id} station={station} place={place} onError={onError} />
                    ))}
                </ul>
                
            )}
            <Button 
                className="btn-sm m-2 mt-3"
                onClick={toggleAddForm}
                variant="outline-secondary"
            >
                <i className="bi bi-plus-circle me-2"></i>
                Ajouter une borne de charge
            </Button>


            { openedAddForm && <AddStationForm onClose={toggleAddForm} place={place} /> }
            { isEditing && <UpdatePlaceForm place={place} onClose={toggleEditing} /> }
        </div>
    );
}

export default PlaceCard;