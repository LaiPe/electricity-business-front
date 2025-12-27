import { useState, useEffect } from 'react';
import { searchVehiclesModels } from '../../../services/VehicleService';
import { useApiCall } from '../../../hooks/useApiCall';
import SearchInput from '../../form/SearchInput';

/**
 * Composant de recherche spécialisé pour les modèles de véhicules
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID de l'input
 * @param {string} props.name - Nom de l'input
 * @param {string} props.initialValue - Valeur initiale
 * @param {Function} props.onSelect - Fonction de sélection d'un modèle
 * @param {Function} props.onClearSelection - Fonction appelée quand la sélection est supprimée
 * @param {boolean} props.required - Champ obligatoire
 * @param {boolean} props.disabled - Champ désactivé
 * @param {string} props.error - Message d'erreur
 * @param {Object} props.initialSelectedModel - Modèle initialement sélectionné
 */
function VehicleModelSearchInput({
    id = "vehicleModelSearch",
    name = "searchQuery",
    initialValue = '',
    onSelect,
    onClearSelection,
    required = false,
    disabled = false,
    error = '',
    initialSelectedModel = null,
    className = '',
    ...props
}) {
    const { execute } = useApiCall();
    const [searchValue, setSearchValue] = useState(initialValue);
    const [selectedModel, setSelectedModel] = useState(initialSelectedModel);

    // Synchroniser avec les valeurs initiales si elles changent
    useEffect(() => {
        setSearchValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setSelectedModel(initialSelectedModel);
    }, [initialSelectedModel]);
    
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchValue(newValue);
        
        // Si un modèle était sélectionné et que l'utilisateur modifie la recherche, le désélectionner
        if (selectedModel) {
            setSelectedModel(null);
            if (onClearSelection) {
                onClearSelection();
            }
        }
    };

    const handleVehicleModelSearch = async (query) => {
        let results = [];
        await execute(() => searchVehiclesModels(query), {
            onSuccess: (models) => {
                results = models || [];
            },
            showGlobalError: false
        });
        return results;
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setSearchValue(`${model.make} ${model.model} ${model.year}`);
        
        if (onSelect) {
            onSelect(model);
        }
    };

    const renderVehicleModelItem = (model) => (
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
    );

    return (
        <SearchInput
            id={id}
            name={name}
            label="Modèle de véhicule"
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleVehicleModelSearch}
            onSelect={handleModelSelect}
            renderItem={renderVehicleModelItem}
            placeholder="Tapez pour rechercher un modèle (ex: Tesla Model 3)"
            required={required}
            disabled={disabled}
            error={error}
            selectedItem={selectedModel}
            className={className}
            {...props}
        />
    );
}

export default VehicleModelSearchInput;