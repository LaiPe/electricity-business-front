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
    ...props
}) {
    const inputClasses = `form-control ${error ? 'is-invalid' : ''} ${className}`.trim();

    return (
        <div className="mb-3">
            {label && (
                <label htmlFor={id} className="form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
            )}
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
};

export default Input;