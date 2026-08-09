import { apiClient } from '../api/client'; // Adjust path to your axios instance
import {
    EmployerProfile,
    UpsertEmployerProfileRequest,

} from '../types/employerProfile';
import { ApiResponse } from '../types/http';

export const employerService = {
    // Get the authenticated employer's profile
    async getMyProfile(): Promise<EmployerProfile> {
        const response = await apiClient.get<ApiResponse<EmployerProfile>>('/employers/me/profile');
        return response.data.data;
    },

    // Create or update the authenticated employer's profile
    async upsertMyProfile(payload: UpsertEmployerProfileRequest): Promise<EmployerProfile> {
        const response = await apiClient.put<ApiResponse<EmployerProfile>>('/employers/me/profile', payload);
        return response.data.data;
    },
};