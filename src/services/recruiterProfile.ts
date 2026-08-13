import { apiClient } from '../api/client'; // Adjust path to your axios instance
import {
    EmployerProfile,
    UpsertEmployerProfileRequest,

} from '../types/recruiterProfile';
import { ApiResponse } from '../types/http';
import { OrganizationVerification, OrganizationVerificationResponse, SubmitVerificationRequest } from '../types/organizationVerification';

export const employerService = {
    // Get the authenticated employer's profile
    async getMyProfile(): Promise<EmployerProfile> {
        const response = await apiClient.get<ApiResponse<EmployerProfile>>('/recruiters/me/profile');
        return response.data.data;
    },

    // Create or update the authenticated employer's profile
    async upsertMyProfile(payload: UpsertEmployerProfileRequest): Promise<EmployerProfile> {
        const response = await apiClient.put<ApiResponse<EmployerProfile>>('/recruiters/me/profile', payload);
        return response.data.data;
    },

    async updateLogo(logo: File): Promise<EmployerProfile> {
        const formData = new FormData();
        formData.append('logo', logo);
        const response = await apiClient.post<ApiResponse<EmployerProfile>>('/recruiters/me/profile/logo', formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data.data;
    },

    // Get current organization verification
    async getMyVerification(): Promise<OrganizationVerificationResponse> {
        const response = await apiClient.get<
            ApiResponse<OrganizationVerificationResponse>
        >('/recruiters/me/verification');

        return response.data.data;
    },

    // Submit organization verification
    async submitVerification(
        payload: SubmitVerificationRequest
    ): Promise<OrganizationVerificationResponse> {
        const response = await apiClient.post<
            ApiResponse<OrganizationVerificationResponse>
        >('/recruiters/me/verification', payload);

        return response.data.data;
    },

    // Upload verification document
    async uploadVerificationDocument(
        document: File
    ): Promise<OrganizationVerification> {
        const formData = new FormData();
        formData.append('document', document);

        const response = await apiClient.post<
            ApiResponse<OrganizationVerification>
        >('/recruiters/me/verification/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};
