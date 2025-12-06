import { apiRequest } from "../utils/ApiRequest";

export const getNearbyStations = async (latitude, longitude, radiusInKm) => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius_in_km: radiusInKm.toString()
    });
    
    return await apiRequest(`/stations/nearby?${params}`, 'GET');
}