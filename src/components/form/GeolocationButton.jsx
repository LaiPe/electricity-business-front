import { useState } from 'react';

/**
 * Bouton de géolocalisation pour réactualiser la position de l'utilisateur
 */
function GeolocationButton({ onClick }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            await onClick();
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };


    return (
        <button 
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={`btn btn-light d-flex align-items-center gap-2`}
            style={{
                width: '140px',
                height: '42px',
                pointerEvents: 'auto'
            }}
        >
            {isLoading ? (
                <>
                    <span 
                        className="spinner-border spinner-border-sm" 
                        role="status" 
                        aria-hidden="true"
                    ></span>
                    <span>Localisation...</span>
                </>
            ) : (
                <>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Ma position</span>
                </>
            )}
        </button>
    );
}

export default GeolocationButton;