import { useState } from 'react';
import { addStation } from '../../../services/StationService';
import { useListDispatchMethodsContext } from '../../../contexts/ListContext';
import MapCoordinateInput from "../../form/MapCoordinateInput";
import Input from "../../form/Input";
import Button from "../../form/Button";

function AddStationForm({ onClose, place }) {
    const [formData, setFormData] = useState({
        name: '',
        latitude: null,
        longitude: null,
        price_per_kwh: '',
        power_kw: '',
        instructions: ''
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { updateItem } = useListDispatchMethodsContext();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }

        // Effacer l'erreur générale
        if (generalError) {
            setGeneralError('');
        }
    };

    const handleCoordinateChange = (coordinates) => {
        setFormData(prev => ({
            ...prev,
            latitude: coordinates.lat,
            longitude: coordinates.lng
        }));
        
        // Effacer les erreurs de coordonnées
        if (errors.coordinates) {
            setErrors(prev => ({
                ...prev,
                coordinates: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validation des champs obligatoires
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom de la station est obligatoire';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères';
        }

        if (!formData.latitude || !formData.longitude) {
            newErrors.coordinates = 'Les coordonnées sont obligatoires';
        }

        if (!formData.price_per_kwh) {
            newErrors.price_per_kwh = 'Le prix par kWh est obligatoire';
        } else if (isNaN(formData.price_per_kwh) || parseFloat(formData.price_per_kwh) <= 0) {
            newErrors.price_per_kwh = 'Le prix doit être un nombre positif';
        }

        if (!formData.power_kw) {
            newErrors.power_kw = 'La puissance est obligatoire';
        } else if (isNaN(formData.power_kw) || parseFloat(formData.power_kw) <= 0) {
            newErrors.power_kw = 'La puissance doit être un nombre positif';
        }

        if (!place.id) {
            newErrors.place_id = 'L\'identifiant du lieu est manquant';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Soumission du formulaire avec les données:', formData);
        
        if (!validateForm()) {
            console.log('Erreurs de validation:', errors);
            return;
        }

        setIsSubmitting(true);
        
        try {
            const stationData = {
                name: formData.name.trim(),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                price_per_kwh: parseFloat(formData.price_per_kwh),
                power_kw: parseFloat(formData.power_kw),
                instructions: formData.instructions.trim() || null,
                place_id: parseInt(place.id)
            };

            console.log('Données validées, création de la station avec:', stationData);

            // Créer la station via l'API
            const newStation = await addStation(stationData);
            
            // Mettre à jour la liste locale en ajoutant la station au lieu correspondant
            updateItem({
                ...place,
                charging_stations: [...(place.charging_stations || []), newStation]
            });
            
            // Fermer la modal
            if (onClose) {
                onClose();
            }
            
        } catch (error) {
            console.error('Erreur lors de la création de la station:', error);
            const errorMessage = error?.message || 'Erreur lors de la création de la station';
            setErrors({ submit: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Réinitialiser le formulaire
        setFormData({
            name: '',
            latitude: null,
            longitude: null,
            price_per_kwh: '',
            power_kw: '',
            instructions: ''
        });
        setErrors({});
        
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-lightning-charge me-2"></i>
                            Ajouter une nouvelle station
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            aria-label="Close"
                        ></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {errors.submit && (
                                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{errors.submit}</div>
                                    <button 
                                        type="button" 
                                        className="btn-close ms-auto" 
                                        onClick={() => setErrors(prev => ({ ...prev, submit: null }))}
                                    ></button>
                                </div>
                            )}
                            
                            <div className="row">
                                {/* Nom de la station */}
                                <div className="col-lg-6 mb-3">
                                    <Input
                                        id="station-name"
                                        name="name"
                                        label="Nom de la station"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        error={errors.name}
                                        required
                                        placeholder="Ex: Borne de recharge Centre-ville"
                                        helpText="Ce nom sera affiché aux utilisateurs pour identifier la station."
                                        disabled={isSubmitting}
                                        maxLength="100"
                                    />
                                </div>
                                {/* Prix par kWh */}
                                <div className="col-lg-3 col-6 mb-3">
                                    <Input
                                        id="price-per-kwh"
                                        name="price_per_kwh"
                                        label="Prix par kWh (€)"
                                        type="number"
                                        value={formData.price_per_kwh}
                                        onChange={(e) => handleInputChange('price_per_kwh', e.target.value)}
                                        error={errors.price_per_kwh}
                                        required
                                        placeholder="Ex: 0.15"
                                        min="0"
                                        step="0.01"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Puissance */}
                                <div className="col-lg-3 col-6 mb-3">
                                    <Input
                                        id="power-kw"
                                        name="power_kw"
                                        label="Puissance (kW)"
                                        type="number"
                                        value={formData.power_kw}
                                        onChange={(e) => handleInputChange('power_kw', e.target.value)}
                                        error={errors.power_kw}
                                        required
                                        placeholder="Ex: 7"
                                        min="0"
                                        step="0.1"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                {/* Coordonnées */}
                                <div className="col-lg-7 mb-4">
                                    <MapCoordinateInput
                                        id="station-coordinates"
                                        label="Localisation de la station"
                                        latitude={formData.latitude}
                                        longitude={formData.longitude}
                                        onCoordinateChange={handleCoordinateChange}
                                        error={errors.coordinates}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Instructions */}
                                <div className="col-lg-5 mb-3">
                                    <label htmlFor="instructions" className="form-label">
                                        Instructions d'utilisation
                                    </label>
                                    <textarea
                                        id="instructions"
                                        name="instructions"
                                        className={`form-control ${errors.instructions ? 'is-invalid' : ''}`}
                                        value={formData.instructions}
                                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                                        placeholder="Instructions spéciales pour l'utilisation de cette borne..."
                                        rows="3"
                                        disabled={isSubmitting}
                                        maxLength="500"
                                    />
                                    {errors.instructions && (
                                        <div className="invalid-feedback">
                                            {errors.instructions}
                                        </div>
                                    )}
                                    <div className="form-text">
                                        {formData.instructions.length}/500 caractères
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                loadingText="Création en cours..."
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Créer la station
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddStationForm;