import { useState, useEffect } from 'react';
import { getShortAddress } from '../services/GeoService';

/**
 * Hook personnalisé pour enrichir une ou plusieurs stations avec leurs adresses
 * @param {Object|Array} stationOrStations - Station unique ou tableau de stations à enrichir
 * @returns {Object} { enrichedStation(s), isLoadingAddress }
 */
export const useStationAddress = (stationOrStations) => {
    const isArray = Array.isArray(stationOrStations);
    const [enrichedData, setEnrichedData] = useState(stationOrStations);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);

    useEffect(() => {
        const enrichStations = async () => {
            const stations = isArray ? stationOrStations : [stationOrStations];
            
            // Vérifier si toutes les stations ont déjà une adresse
            const needsEnrichment = stations.some(station => !station.address);
            if (!needsEnrichment) {
                setEnrichedData(stationOrStations);
                return;
            }

            setIsLoadingAddress(true);
            
            try {
                const enrichmentPromises = stations.map(async (station) => {
                    // Si la station a déjà une adresse, la retourner telle quelle
                    if (station.address) {
                        return station;
                    }

                    try {
                        // Timeout de 3 secondes par requête
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Timeout')), 3000)
                        );
                        
                        const addressPromise = getShortAddress(station.latitude, station.longitude);
                        const address = await Promise.race([addressPromise, timeoutPromise]);
                        
                        return { ...station, address };
                    } catch (error) {
                        return { ...station, address: null };
                    }
                });

                // Timeout global de 3 secondes pour toutes les requêtes
                const globalTimeout = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(stations.map(station => ({ ...station, address: null })));
                    }, 3000);
                });

                const enrichedStations = await Promise.race([
                    Promise.all(enrichmentPromises),
                    globalTimeout
                ]);

                // Retourner le format approprié selon l'entrée
                setEnrichedData(isArray ? enrichedStations : enrichedStations[0]);
            } catch (error) {
                console.error('Erreur lors de l\'enrichissement des adresses:', error);
                setEnrichedData(isArray ? 
                    stations.map(station => ({ ...station, address: null })) : 
                    { ...stations[0], address: null }
                );
            } finally {
                setIsLoadingAddress(false);
            }
        };

        enrichStations();
    }, [stationOrStations, isArray]);

    // Retourner avec des noms de propriétés appropriés
    return isArray ? 
        { enrichedStations: enrichedData, isLoadingAddress } : 
        { enrichedStation: enrichedData, isLoadingAddress };
};
