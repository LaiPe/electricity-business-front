function ToggleSwitch({ 
    leftLabel, 
    rightLabel, 
    leftValue, 
    rightValue, 
    value, 
    onChange, 
    variant = 'primary',
    className = '' 
}) {
    const handleLeftClick = () => {
        if (value !== leftValue) {
            onChange(leftValue);
        }
    };

    const handleRightClick = () => {
        if (value !== rightValue) {
            onChange(rightValue);
        }
    };

    return (
        <div className={`btn-group ${className}`} role="group">
            <button
                type="button"
                className={`btn ${value === leftValue ? `btn-${variant}` : `btn-outline-${variant}`}`}
                onClick={handleLeftClick}
            >
                {leftLabel}
            </button>
            <button
                type="button"
                className={`btn ${value === rightValue ? `btn-${variant}` : `btn-outline-${variant}`}`}
                onClick={handleRightClick}
            >
                {rightLabel}
            </button>
        </div>
    );
}

export default ToggleSwitch;