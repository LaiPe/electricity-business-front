import { useState } from 'react';

/**
 * Composant formulaire de recherche de bornes de recharge
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param {boolean} props.isSearching - Indique si une recherche est en cours
 * @param {string} props.searchError - Message d'erreur de recherche
 * @param {Array} props.searchResults - Résultats de la recherche
 * @param {Object} props.searchCoordinates - Coordonnées de la recherche
 */
function SearchForm({ 
    onSubmit, 
    isSearching = false, 
    searchError = null, 
    searchResults = [], 
    searchCoordinates = null 
}) {
    // États pour le formulaire de recherche
    const [searchForm, setSearchForm] = useState({
        address: '',
        startDate: '',
        duration: '1'
    });

    // Gestion des changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(searchForm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form bg-white bg-opacity-90 p-4 rounded shadow">
            {/* Adresse postale */}
            <div className="mb-3">
                <label htmlFor="address" className="form-label text-dark fw-semibold">
                    📍 Adresse ou ville
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={searchForm.address}
                    onChange={handleInputChange}
                    placeholder="Ex: 123 Rue de Rivoli, Paris"
                    required
                />
            </div>

            {/* Date de début */}
            <div className="mb-3">
                <label htmlFor="startDate" className="form-label text-dark fw-semibold">
                    📅 Date et heure de début
                </label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={searchForm.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                />
            </div>

            {/* Durée de réservation */}
            <div className="mb-3">
                <label htmlFor="duration" className="form-label text-dark fw-semibold">
                    ⏰ Durée de réservation
                </label>
                <select
                    className="form-select"
                    id="duration"
                    name="duration"
                    value={searchForm.duration}
                    onChange={handleInputChange}
                    required
                >
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 heure</option>
                    <option value="1.5">1h 30</option>
                    <option value="2">2 heures</option>
                    <option value="3">3 heures</option>
                    <option value="4">4 heures</option>
                    <option value="6">6 heures</option>
                    <option value="8">8 heures</option>
                </select>
            </div>

            {/* Bouton de recherche */}
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSearching}>
                {isSearching ? (
                    <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        Recherche en cours...
                    </>
                ) : (
                    <>🔍 Rechercher des bornes</>
                )}
            </button>
            
            {/* Messages d'erreur et de résultats */}
            {searchError && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                    ❌ {searchError}
                </div>
            )}
            
            {searchResults.length > 0 && !isSearching && (
                <div className="alert alert-success mt-3 mb-0" role="alert">
                    ✅ {searchResults.length} borne{searchResults.length > 1 ? 's' : ''} trouvée{searchResults.length > 1 ? 's' : ''}
                </div>
            )}
            
            {searchResults.length === 0 && !isSearching && searchCoordinates && !searchError && (
                <div className="alert alert-warning mt-3 mb-0" role="alert">
                    ⚠️ Aucune borne disponible pour cette recherche
                </div>
            )}
            
            {/* Petit texte d'aide */}
            <small className="text-muted d-block mt-2 text-center">
                Trouvez les meilleures stations de recharge autour de vous
            </small>
        </form>
    );
}

export default SearchForm;