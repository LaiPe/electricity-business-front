import { apiRequest } from "../utils/ApiRequest";

export const getPublicUser = async (userId) => {
    return await apiRequest(`/users/${userId}/public`, 'GET');
}