import { useState } from 'react';
import { addPlace } from '../../../services/StationService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import Input from '../../form/Input';
import Button from '../../form/Button';

function AddPlaceForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { addItem } = useListDispatchMethodsContext();

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
        
        // Effacer l'erreur générale
        if (generalError) {
            setGeneralError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Veuillez saisir un nom pour la place';
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
        
        try {
            setLoading(true);
            setGeneralError('');
            
            const placeData = {
                name: formData.name.trim(),
                description: formData.description.trim()
            };
            
            const newPlace = await addPlace(placeData);
            newPlace.charging_stations = [];
            
            // Ajouter la place à la liste locale
            addItem(newPlace);
            
            // Fermer la modale
            if (onClose) {
                onClose();
            }
            
        } catch (error) {
            const errorMessage = error?.message || 'Erreur lors de l\'ajout de la place';
            setGeneralError(errorMessage);
            console.error('Erreur ajout place:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: ''
        });
        setErrors({});
        setGeneralError('');
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
                            <i className="bi bi-geo-alt me-2"></i>
                            Ajouter une place
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

                            <Input
                                id="name"
                                name="name"
                                label="Nom de la place"
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
                                    placeholder="Décrivez cette place, son emplacement, ses particularités..."
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

export default AddPlaceForm;