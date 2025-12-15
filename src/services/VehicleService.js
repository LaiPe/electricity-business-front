import { apiRequest } from "../utils/ApiRequest";

export const getUserVehicles = async () => {
    return await apiRequest('/vehicles', 'GET');
}

export const addVehicle = async (vehicleData) => {
    return await apiRequest('/vehicles', 'POST', vehicleData);
}

export const deleteVehicle = async (vehicleId) => {
    return await apiRequest(`/vehicles/${vehicleId}`, 'DELETE');
}

export const updateVehicle = async (vehicleId, vehicleData) => {
    return await apiRequest(`/vehicles/${vehicleId}`, 'PUT', vehicleData);
}

export const getVehicleById = async (vehicleId) => {
    return await apiRequest(`/vehicles/${vehicleId}`, 'GET');
}

export const searchVehiclesModels = async (query) => {
    const params = new URLSearchParams({
        q: query
    });
    return await apiRequest(`/vehicles/models/search?${params}`, 'GET');
}

export const getAllVehicleModels = async () => {
    return await apiRequest('/vehicles/models', 'GET');
}
