import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour effectuer une requête fetch et gérer l'état de chargement, les données et les erreurs
 * @param {string} url - L'URL de la ressource à récupérer
 * @param {FetchEventInit} options - Options supplémentaires pour la requête fetch
 * @returns {Object} Un objet contenant les données, l'erreur et l'état de chargement
 * @returns {any} returns.data - Les données récupérées
 * @returns {Error|null} returns.error - L'erreur survenue lors de la requête, ou null si aucune erreur
 * @returns {boolean} returns.loading - Indique si la requête est en cours de chargement
 */
function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json; charset=utf-8',
                ...options.headers
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            setData(jsonData);
        })
        .catch(err => {
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return { data, error, loading };
}

export default useFetch;