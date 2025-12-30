import Input from "../form/Input";
import Button from "../form/Button";
import { formatDate } from "../../utils/DateUtils";

/**
 * Formulaire de recherche de bornes avec filtres de date et durée
 */
function SearchForm({ 
    formData, 
    onInputChange, 
    onSubmit, 
    onReset, 
    isLoading, 
    isFormSubmitted 
}) {
    // Date minimale pour l'input datetime-local (maintenant)
    const getMinDateTime = () => {
        const now = new Date();
        return formatDate(now).slice(0, 16); // Format 'YYYY-MM-DDTHH:MM'
    };

    return (
        <form 
            className="search-form p-4 w-100 d-flex gap-3 align-items-end justify-content-between flex-wrap border rounded" 
            style={{backgroundColor: '#f8f9fa', zIndex: 10, width: 'calc(100% - 32px)'}}
            onSubmit={onSubmit}
        >
            <Input
                id="search-address"
                name="address"
                type="text"
                label="📍 Adresse ou ville" 
                placeholder="Ex: Paris, Lyon, Marseille..."
                value={formData.address}
                onChange={onInputChange}
                wrapperClassName=""
                style={{minWidth: '300px'}}
                required
            />
            <Input
                id="search-date"
                name="date"
                type="datetime-local"
                label="📅 Date"
                value={formData.date}
                onChange={onInputChange}
                wrapperClassName=""
                min={getMinDateTime()}
            />
            <Input
                id="search-duration"
                name="duration"
                type="select"
                label="⏱️ Durée"
                options={[
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 heure' },
                    { value: '120', label: '2 heures' },
                    { value: '240', label: '4 heures' },
                    { value: '480', label: '8 heures' },
                ]}
                value={formData.duration}
                onChange={onInputChange}
                wrapperClassName=""
            />
            <div className="d-flex gap-2">
                {isFormSubmitted && (
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={onReset} 
                        disabled={isLoading} 
                        style={{minWidth: '140px'}}
                    >
                        Réinitialiser
                    </button>
                )}
                <Button type="submit" style={{minWidth: '140px'}} disabled={isLoading}>
                    {isLoading ? '🔄 Recherche...' : '🔍 Rechercher'}
                </Button>
            </div>
        </form>
    );
}

export default SearchForm;
