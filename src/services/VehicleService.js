import { apiRequest } from "../utils/ApiRequest";

export const getUserVehicles = async () => {
    return await apiRequest('/vehicles', 'GET');
}

export const addVehicle = async (vehicleData) => {
    return await apiRequest('/vehicles', 'POST', vehicleData);
}

export const deleteVehicle = async (vehicle) => {
    return await apiRequest(`/vehicles/${vehicle.id}`, 'DELETE');
}

export const updateVehicle = async (vehicle, vehicleData) => {
    return await apiRequest(`/vehicles/${vehicle.id}`, 'PUT', vehicleData);
}

export const getVehicleById = async (vehicle) => {
    return await apiRequest(`/vehicles/${vehicle.id}`, 'GET');
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
