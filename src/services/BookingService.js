import { apiRequest } from "../utils/ApiRequest";

export const getBookingsAsVehicleOwner = async () => {
    return await apiRequest('/bookings/as-vehicle-owner', 'GET');
}

export const getBookingsAsStationOwner = async () => {
    return await apiRequest('/bookings/as-station-owner', 'GET');
}

export const addBooking = async (bookingData) => {
    return await apiRequest('/bookings', 'POST', bookingData);
}

export const acceptBooking = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/accept`, 'PATCH');
}

export const rejectBooking = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/reject`, 'PATCH');
}

export const cancelBooking = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/cancel`, 'PATCH');
}

export const startBooking = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/start`, 'PATCH');
}

export const endBooking = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/end`, 'PATCH');
}

export const reviewBooking = async (bookingId, reviewData) => {
    return await apiRequest(`/bookings/${bookingId}/review`, 'PATCH', reviewData);
}

export const getBookingPdf = async (bookingId) => {
    return await apiRequest(`/bookings/${bookingId}/export/pdf`, 'GET');
}

export const exportBookingsExcelFormat = async () => {
    return await apiRequest('/bookings/export/xlsx', 'GET');
}