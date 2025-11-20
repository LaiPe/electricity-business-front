import PropTypes from 'prop-types';

function Button({
    type = 'button',
    children,
    onClick,
    disabled = false,
    loading = false,
    loadingText = 'Chargement...',
    variant = 'primary',
    size = '',
    className = '',
    ...props
}) {
    const buttonClasses = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`.trim();

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}

Button.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    loadingText: PropTypes.string,
    variant: PropTypes.oneOf([
        'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link',
        'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 
        'outline-warning', 'outline-info', 'outline-light', 'outline-dark'
    ]),
    size: PropTypes.oneOf(['', 'sm', 'lg']),
    className: PropTypes.string,
};

export default Button;