import { useState, useEffect } from 'react';
import { updatePlace } from '../../../services/StationService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import { useApiCall } from '../../../hooks/useApiCall';
import Input from '../../form/Input';
import Button from '../../form/Button';

function UpdatePlaceForm({ place, onClose, onSuccess }) {
    const { execute, loading } = useApiCall();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    
    const { updateItem } = useListDispatchMethodsContext();

    // Initialiser le formulaire avec les données de la place
    useEffect(() => {
        if (place) {
            setFormData({
                name: place.name || '',
                description: place.description || ''
            });
        }
    }, [place]);

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
        
        if (!formData.name.trim()) {
            newErrors.name = 'Veuillez saisir un nom pour le lieu';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const placeData = {
            name: formData.name.trim(),
            description: formData.description.trim()
        };
        
        await execute(() => updatePlace(place.id, placeData), {
            onSuccess: (updatedPlace) => {
                updateItem(updatedPlace);
                if (onSuccess) {
                    onSuccess('Place mise à jour avec succès');
                }
                if (onClose) {
                    onClose();
                }
            }
        });
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: ''
        });
        setErrors({});
        if (onClose) {
            onClose();
        }
    };

    if (!place) {
        return (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="alert alert-warning">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Aucun lieu sélectionné pour la modification.
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
                            Modifier le lieu
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
                            <Input
                                id="name"
                                name="name"
                                label="Nom du lieu"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={errors.name}
                                placeholder="Ex: Domicile, Bureau, Garage..."
                                required
                                disabled={loading}
                                maxLength="100"
                                helpText="Cette information est privée et ne sera visible que par vous"
                            />

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Description <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Décrivez ce lieu, son emplacement, ses particularités..."
                                    disabled={loading}
                                    rows="4"
                                    maxLength="500"
                                />
                                {errors.description && (
                                    <div className="invalid-feedback">
                                        {errors.description}
                                    </div>
                                )}
                                <div className="form-text">
                                    {formData.description.length}/500 caractères
                                </div>
                            </div>
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

export default UpdatePlaceForm;