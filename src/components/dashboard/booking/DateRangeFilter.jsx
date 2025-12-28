export default function DateRangeFilter({ startDate, endDate, onFilterChange }) {
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        onFilterChange({ startDate: newStartDate, endDate });
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        onFilterChange({ startDate, endDate: newEndDate });
    };

    const handleReset = () => {
        onFilterChange({ startDate: '', endDate: '' });
    };

    return (
        <div>
            <div className="row g-3">
                    <div className="col-12">
                        <label htmlFor="startDate" className="form-label">
                            Date de début
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="startDate"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="endDate" className="form-label">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="endDate"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate}
                        />
                    </div>
                    <div className="col-12">
                        <button 
                            className="btn btn-secondary w-100" 
                            onClick={handleReset}
                            disabled={!startDate && !endDate}
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
                {(startDate || endDate) && (
                    <div className="mt-2">
                        <small className="text-muted">
                            {startDate && endDate 
                                ? `Filtrage: du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}`
                                : startDate 
                                ? `Filtrage: à partir du ${new Date(startDate).toLocaleDateString('fr-FR')}`
                                : `Filtrage: jusqu'au ${new Date(endDate).toLocaleDateString('fr-FR')}`
                            }
                        </small>
                    </div>
                )}
        </div>
    );
}
