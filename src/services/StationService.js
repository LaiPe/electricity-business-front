import { apiRequest } from "../utils/ApiRequest";

export const getNearbyStations = async (latitude, longitude, radiusInKm) => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius_in_km: radiusInKm.toString()
    });
    
    return await apiRequest(`/stations/nearby?${params}`, 'GET');
}

export const getUserPlacesWithStations = async () => {
    return await apiRequest('/places', 'GET');
}

export const addPlace = async (placeData) => {
    return await apiRequest('/places', 'POST', placeData);
}