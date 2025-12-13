import { useState, useEffect } from 'react';
import { searchVehiclesModels, addVehicle } from '../../../services/VehicleService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import Input from '../../form/Input';
import Button from '../../form/Button';

function AddVehicleForm({ onError, onClose }) {
    const [vehicleModels, setVehicleModels] = useState([]);
    const [formData, setFormData] = useState({
        modelId: '',
        licensePlate: '',
        searchQuery: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    
    const { addItem } = useListDispatchMethodsContext();

    useEffect(() => {
        if (selectedModel) {
            setShowDropdown(false);
            return;
        }

        // Debounce pour la recherche
        if (formData.searchQuery.trim().length >= 2) {
            const timer = setTimeout(() => {
                searchVehicleModels(formData.searchQuery);
            }, 250);
            
            return () => clearTimeout(timer);
        } else {
            setVehicleModels([]);
            setShowDropdown(false);
        }
    }, [formData.searchQuery]);

    const searchVehicleModels = async (query) => {
        try {
            setLoadingModels(true);
            const models = await searchVehiclesModels(query);
            setVehicleModels(models);
            setShowDropdown(models.length > 0);
        } catch (error) {
            onError('Erreur lors de la recherche des modèles');
            console.error('Erreur recherche modèles:', error);
            setVehicleModels([]);
            setShowDropdown(false);
        } finally {
            setLoadingModels(false);
        }
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
        
        // Si c'est le champ de recherche et qu'un modèle était sélectionné, le déselectionner
        if (name === 'searchQuery' && selectedModel) {
            setSelectedModel(null);
            setFormData(prev => ({
                ...prev,
                modelId: ''
            }));
        }
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setFormData(prev => ({
            ...prev,
            modelId: model.id,
            searchQuery: `${model.make} ${model.model} ${model.year}`
        }));
        setShowDropdown(false);
        
        // Effacer l'erreur du modèle si elle existe
        if (errors.modelId) {
            setErrors(prev => ({
                ...prev,
                modelId: ''
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
            onError(errorMessage);
            console.error('Erreur ajout véhicule:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            modelId: '',
            licensePlate: '',
            searchQuery: ''
        });
        setErrors({});
        setSelectedModel(null);
        setVehicleModels([]);
        setShowDropdown(false);
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
                            <div className="mb-3 position-relative">
                                <label htmlFor="searchQuery" className="form-label">
                                    Modèle de véhicule <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                    <input
                                        id="searchQuery"
                                        name="searchQuery"
                                        type="text"
                                        className={`form-control ${errors.modelId ? 'is-invalid' : ''}`}
                                        value={formData.searchQuery}
                                        onChange={handleInputChange}
                                        placeholder="Tapez pour rechercher un modèle (ex: Tesla Model 3)"
                                        disabled={loading}
                                        autoComplete="off"
                                    />
                                    {loadingModels && (
                                        <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Recherche...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Dropdown des résultats */}
                                {showDropdown && vehicleModels.length > 0 && (
                                    <div className="dropdown-menu show w-100 mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {vehicleModels.map((model) => (
                                            <button
                                                key={model.id}
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => handleModelSelect(model)}
                                            >
                                                <div>
                                                    <strong>{model.brand} {model.model}</strong>
                                                    <small className="text-muted d-block">Année: {model.year}</small>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                
                                {formData.searchQuery.trim().length >= 2 && !loadingModels && vehicleModels.length === 0 && (
                                    <div className="text-muted small mt-1">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Aucun modèle trouvé pour cette recherche
                                    </div>
                                )}
                                
                                {formData.searchQuery.trim().length > 0 && formData.searchQuery.trim().length < 2 && (
                                    <div className="text-muted small mt-1">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Tapez au moins 2 caractères pour rechercher
                                    </div>
                                )}
                                
                                {errors.modelId && (
                                    <div className="invalid-feedback d-block">
                                        {errors.modelId}
                                    </div>
                                )}
                            </div>

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
                                disabled={loadingModels || !selectedModel}
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
