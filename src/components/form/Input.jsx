import PropTypes from 'prop-types';

function Input({
    id,
    name,
    type = 'text',
    label,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    placeholder,
    className = '',
    helpText,
    wrapperClassName = 'mb-3',
    options = [], // Pour les select
    ...props
}) {
    const inputClasses = `${type === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''} ${className}`.trim();

    const renderInput = () => {
        if (type === 'select') {
            return (
                <select
                    id={id}
                    name={name}
                    className={inputClasses}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder || 'Sélectionnez une option'}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={type}
                id={id}
                name={name}
                className={inputClasses}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                {...props}
            />
        );
    };

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
            )}
            {renderInput()}
            {helpText && (
                <div className="form-text text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    {helpText}
                </div>
            )}
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
}

Input.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
};

export default Input;