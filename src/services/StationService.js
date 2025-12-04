import { apiRequest } from "../utils/ApiRequest";

export const getNearbyAndFreeStations = async (latitude, longitude, radiusInKm, searchStart, searchEnd) => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius_in_km: radiusInKm.toString(),
        search_start: searchStart,
        search_end: searchEnd
    });
    
    return await apiRequest(`/stations/nearby-and-free?${params}`, 'GET');
}