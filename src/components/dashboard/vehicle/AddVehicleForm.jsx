import { useState } from 'react';
import { addVehicle } from '../../../services/VehicleService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import Input from '../../form/Input';
import Button from '../../form/Button';
import VehicleModelSearchInput from './VehicleModelSearchInput';

function AddVehicleForm({ onClose }) {
    const [formData, setFormData] = useState({
        modelId: '',
        licensePlate: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    
    const { addItem } = useListDispatchMethodsContext();

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
        
        try {
            setLoading(true);
            
            const vehicleData = {
                vehicle_model_id: formData.modelId,
                registration_number: formData.licensePlate.trim()
            };
            
            const newVehicle = await addVehicle(vehicleData);
            
            // Ajouter le véhicule à la liste locale
            addItem(newVehicle);
            
            // Fermer la modale
            if (onClose) {
                onClose();
            }
            
        } catch (error) {
            const errorMessage = error?.message || 'Erreur lors de l\'ajout du véhicule';
            setGeneralError(errorMessage);
            console.error('Erreur ajout véhicule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            modelId: '',
            licensePlate: ''
        });
        setErrors({});
        setGeneralError('');
        setSelectedModel(null);
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-car-front me-2"></i>
                            Ajouter un véhicule
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
                            {generalError && (
                                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{generalError}</div>
                                    <button 
                                        type="button" 
                                        className="btn-close ms-auto" 
                                        onClick={() => setGeneralError('')}
                                    ></button>
                                </div>
                            )}
                            <VehicleModelSearchInput
                                id="searchQuery"
                                name="searchQuery"
                                onSelect={handleModelSelect}
                                onClearSelection={handleClearModelSelection}
                                onError={(message) => setGeneralError(message)}
                                required
                                disabled={loading}
                                error={errors.modelId}
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
                                loadingText="Ajout en cours..."
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Ajouter
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddVehicleForm;
