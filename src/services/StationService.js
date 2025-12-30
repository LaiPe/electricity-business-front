import { apiRequest } from "../utils/ApiRequest";
import { formatDate } from "../utils/DateUtils";

export const getNearbyStations = async (latitude, longitude, radiusInKm) => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius_in_km: radiusInKm.toString()
    });
    
    return await apiRequest(`/stations/nearby?${params}`, 'GET');
}

export const getFreeNearbyStations = async (latitude, longitude, radiusInKm, searchStart, searchEnd) => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius_in_km: radiusInKm.toString(),
        search_start: formatDate(searchStart),
        search_end: formatDate(searchEnd)
    });
    
    return await apiRequest(`/stations/nearby-and-free?${params}`, 'GET');
}

export const getUserPlacesWithStations = async () => {
    return await apiRequest('/places', 'GET');
}

export const addPlace = async (placeData) => {
    return await apiRequest('/places', 'POST', placeData);
}

export const updatePlace = async (placeId, placeData) => {
    return await apiRequest(`/places/${placeId}`, 'PUT', placeData);
}

export const deletePlace = async (placeId) => {
    return await apiRequest(`/places/${placeId}`, 'DELETE');
}

export const addStation = async (stationData) => {
    return await apiRequest('/stations', 'POST', stationData);
}

export const updateStation = async (stationId, stationData) => {
    return await apiRequest(`/stations/${stationId}`, 'PUT', stationData);
}

export const deleteStation = async (stationId) => {
    return await apiRequest(`/stations/${stationId}`, 'DELETE');
}