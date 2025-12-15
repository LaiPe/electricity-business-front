import { useState, useEffect } from 'react';

/**
 * Composant de recherche avec autocomplétion
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - ID de l'input
 * @param {string} props.name - Nom de l'input
 * @param {string} props.label - Label du champ
 * @param {string} props.value - Valeur actuelle
 * @param {Function} props.onChange - Fonction de changement de valeur
 * @param {Function} props.onSearch - Fonction de recherche (query) => Promise<Array>
 * @param {Function} props.onSelect - Fonction de sélection d'un élément
 * @param {Function} props.renderItem - Fonction de rendu des éléments de la liste
 * @param {string} props.placeholder - Texte de placeholder
 * @param {boolean} props.required - Champ obligatoire
 * @param {boolean} props.disabled - Champ désactivé
 * @param {string} props.error - Message d'erreur
 * @param {number} props.minSearchLength - Nombre minimum de caractères pour déclencher la recherche
 * @param {number} props.debounceDelay - Délai de debounce en ms
 * @param {Object} props.selectedItem - Élément sélectionné
 */
function SearchInput({
    id,
    name,
    label,
    value = '',
    onChange,
    onSearch,
    onSelect,
    renderItem,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    minSearchLength = 2,
    debounceDelay = 250,
    selectedItem = null,
    className = '',
    ...props
}) {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialState, setInitialState] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (selectedItem) {
            setShowDropdown(false);
            return;
        }

        // Debounce pour la recherche
        if (value.trim().length >= minSearchLength) {
            const timer = setTimeout(() => {
                performSearch(value);
            }, debounceDelay);
            
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [value, selectedItem, minSearchLength, debounceDelay]);

    const performSearch = async (query) => {
        if (!onSearch) return;
        if (initialState) {
            setInitialState(false);
        }

        try {
            setLoading(true);
            const results = await onSearch(query);
            setSearchResults(results || []);
            setShowDropdown((results || []).length > 0);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchResults([]);
            setShowDropdown(false);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: newValue
                }
            });
        }
    };

    const handleItemSelect = (item) => {
        if (onSelect) {
            onSelect(item);
        }
        setShowDropdown(false);
    };

    const defaultRenderItem = (item, index) => (
        <button
            key={item.id || index}
            type="button"
            className="dropdown-item"
            onClick={() => handleItemSelect(item)}
        >
            {item.label || item.name || JSON.stringify(item)}
        </button>
    );

    const renderFunction = renderItem || defaultRenderItem;

    return (
        <div className={`mb-3 position-relative ${className}`}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="text-danger"> *</span>}
                </label>
            )}
            
            <div className="position-relative">
                <input
                    id={id}
                    name={name}
                    type="text"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    {...props}
                />
                
                {loading && (
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Recherche...</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Dropdown des résultats */}
            {showDropdown && searchResults.length > 0 && (
                <div className="dropdown-menu show w-100 mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.map((item, index) => renderFunction(item, index))}
                </div>
            )}
            
            {/* Messages d'aide */}
            {value.trim().length >= minSearchLength && !loading && !initialState && searchResults.length === 0 && (
                <div className="text-muted small mt-1">
                    <i className="bi bi-info-circle me-1"></i>
                    Aucun résultat trouvé pour cette recherche
                </div>
            )}

            {value.trim().length > 0 && value.trim().length < minSearchLength && (
                <div className="text-muted small mt-1">
                    <i className="bi bi-info-circle me-1"></i>
                    Tapez au moins {minSearchLength} caractères pour rechercher
                </div>
            )}
            
            {error && (
                <div className="invalid-feedback d-block">
                    {error}
                </div>
            )}
        </div>
    );
}

export default SearchInput;