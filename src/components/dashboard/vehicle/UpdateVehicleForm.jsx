import { useState, useEffect } from 'react';
import { updateVehicle, getVehicleById } from '../../../services/VehicleService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import { useApiCall } from '../../../hooks/useApiCall';
import Input from '../../form/Input';
import Button from '../../form/Button';
import VehicleModelSearchInput from './VehicleModelSearchInput';

function UpdateVehicleForm({ vehicle, onClose, onSuccess }) {
    const { execute, loading } = useApiCall();
    const [formData, setFormData] = useState({
        modelId: '',
        licensePlate: ''
    });
    const [errors, setErrors] = useState({});
    const [selectedModel, setSelectedModel] = useState(null);
    
    const { updateItem } = useListDispatchMethodsContext();

    // Initialiser le formulaire avec les données du véhicule
    useEffect(() => {
        if (vehicle) {
            // Si on a les informations du modèle, créer l'objet selectedModel
            if (vehicle.vehicle_model) {
                setSelectedModel(vehicle.vehicle_model);
            }
            setFormData({
                modelId: vehicle.vehicle_model?.id || '',
                licensePlate: vehicle.registration_number || ''
            });
        }
    }, [vehicle]);

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setFormData(prev => ({
            ...prev,
            modelId: model.id
        }));
        
        // Effacer l'erreur du modèle si elle existe
        if (errors.modelId) {
            setErrors(prev => ({
                ...prev,
                modelId: ''
            }));
        }
    };

    const handleClearModelSelection = () => {
        setSelectedModel(null);
        setFormData(prev => ({
            ...prev,
            modelId: ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.modelId) {
            newErrors.modelId = 'Veuillez sélectionner un modèle de véhicule';
        }
        
        if (!formData.licensePlate.trim()) {
            newErrors.licensePlate = 'Veuillez saisir une plaque d\'immatriculation';
        } else if (formData.licensePlate.trim().length < 2) {
            newErrors.licensePlate = 'La plaque d\'immatriculation doit contenir au moins 2 caractères';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const vehicleData = {
            vehicle_model_id: formData.modelId,
            registration_number: formData.licensePlate.trim()
        };
        
        await execute(() => updateVehicle(vehicle.id, vehicleData), {
            onSuccess: (updatedVehicle) => {
                updateItem(updatedVehicle);
                if (onSuccess) {
                    onSuccess('Véhicule mis à jour avec succès');
                }
                if (onClose) {
                    onClose();
                }
            }
        });
    };

    const handleClose = () => {
        setFormData({
            modelId: '',
            licensePlate: ''
        });
        setErrors({});
        setSelectedModel(null);
        if (onClose) {
            onClose();
        }
    };

    if (!vehicle) {
        return (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Aucun véhicule sélectionné pour la modification.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-pencil me-2"></i>
                            Modifier le véhicule
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleClose}
                            disabled={loading}
                        ></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <VehicleModelSearchInput
                                id="searchQuery"
                                name="searchQuery"
                                initialValue={selectedModel ? `${selectedModel.make} ${selectedModel.model} ${selectedModel.year}` : ''}
                                onSelect={handleModelSelect}
                                onClearSelection={handleClearModelSelection}
                                required
                                disabled={loading}
                                error={errors.modelId}
                                initialSelectedModel={selectedModel}
                            />

                            <Input
                                id="licensePlate"
                                name="licensePlate"
                                label="Plaque d'immatriculation"
                                value={formData.licensePlate}
                                onChange={handleInputChange}
                                error={errors.licensePlate}
                                placeholder="Ex: AB-123-CD"
                                required
                                disabled={loading}
                                className="text-uppercase"
                                maxLength="15"
                            />
                        </div>
                        
                        <div className="modal-footer">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                loadingText="Mise à jour en cours..."
                                disabled={!selectedModel}
                            >
                                <i className="bi bi-check-circle me-2"></i>
                                Mettre à jour
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateVehicleForm;