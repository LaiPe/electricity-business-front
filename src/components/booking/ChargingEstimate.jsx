function ChargingEstimate({ station, vehicle, startDate, endDate }) {
    if (!vehicle || !startDate || !endDate) {
        return null;
    }

    const durationMs = new Date(endDate) - new Date(startDate);
    const durationHours = durationMs / (1000 * 60 * 60);
    const powerKw = station?.power_kw || 0;
    const pricePerKwh = station?.price_per_kwh || 0;
    const batteryCapacity = vehicle?.vehicle_model?.battery_capacity_kwh || 0;

    // Énergie estimée (kWh) = puissance (kW) × durée (h)
    const estimatedEnergy = powerKw * durationHours;
    // Coût estimé = énergie × prix/kWh
    const estimatedCost = estimatedEnergy * pricePerKwh;
    // Pourcentage de recharge = (énergie / capacité batterie) × 100
    const rechargePercentage = batteryCapacity > 0
        ? Math.min((estimatedEnergy / batteryCapacity) * 100, 100)
        : 0;

    const formatDuration = (hours) => {
        if (hours >= 1) {
            const fullHours = Math.floor(hours);
            const minutes = Math.round((hours % 1) * 60);
            return `${fullHours}h${minutes > 0 ? minutes + 'min' : ''}`;
        }
        return `${Math.round(hours * 60)} min`;
    };

    return (
        <div className="bg-success bg-opacity-10 rounded-3 p-3 mb-4">
            <h6 className="fw-bold mb-3 text-success">
                <i className="bi bi-graph-up me-2"></i>
                Estimations
            </h6>

            <div className="row g-3">
                {/* Durée */}
                <div className="col-6">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-clock text-muted me-2"></i>
                        <div>
                            <small className="text-muted d-block">Durée</small>
                            <span className="fw-semibold">{formatDuration(durationHours)}</span>
                        </div>
                    </div>
                </div>

                {/* Énergie estimée */}
                {powerKw > 0 && (
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-lightning text-warning me-2"></i>
                            <div>
                                <small className="text-muted d-block">Énergie</small>
                                <span className="fw-semibold">{estimatedEnergy.toFixed(1)} kWh</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coût estimé */}
                {powerKw > 0 && pricePerKwh > 0 && (
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-currency-euro text-success me-2"></i>
                            <div>
                                <small className="text-muted d-block">Coût estimé</small>
                                <span className="fw-semibold">{estimatedCost.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pourcentage de recharge */}
                {powerKw > 0 && batteryCapacity > 0 && (
                    <div className="col-6">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-battery-charging text-primary me-2"></i>
                            <div>
                                <small className="text-muted d-block">Recharge batterie</small>
                                <span className="fw-semibold">+{rechargePercentage.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Barre de progression pour la recharge */}
            {powerKw > 0 && batteryCapacity > 0 && (
                <div className="mt-3">
                    <div className="progress" style={{ height: '8px' }}>
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${rechargePercentage}%` }}
                            aria-valuenow={rechargePercentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                    <small className="text-muted mt-1 d-block">
                        {vehicle?.vehicle_model?.make} {vehicle?.vehicle_model?.model} • Batterie {batteryCapacity} kWh
                    </small>
                </div>
            )}
        </div>
    );
}

export default ChargingEstimate;
