import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const GlobalErrorContext = createContext(null);

export function GlobalErrorProvider({ children }) {
    const [globalError, setGlobalError] = useState(null);

    const handleClose = useCallback(() => {
        setGlobalError(null);
    }, []);

    // Mémoriser la valeur du contexte pour éviter les re-renders inutiles
    const contextValue = useMemo(() => ({ 
        globalError, 
        setGlobalError 
    }), [globalError]);

    return (
        <GlobalErrorContext.Provider value={contextValue}>
            {globalError && (
                <div 
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        maxWidth: '500px',
                        minWidth: '300px'
                    }}
                >
                    <div className="alert alert-danger d-flex align-items-center shadow" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <span className="flex-grow-1">{globalError}</span>
                        <button 
                            type="button" 
                            className="btn-close ms-2" 
                            onClick={handleClose}
                            aria-label="Fermer"
                        ></button>
                    </div>
                </div>
            )}
            {children}
        </GlobalErrorContext.Provider>
    );
}

export function useGlobalErrorContext() {
    return useContext(GlobalErrorContext);
}