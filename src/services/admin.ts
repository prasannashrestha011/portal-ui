import { apiClient } from '../api/client';
import { User } from '../types/auth';
import { ApiResponse } from '../types/http';
import {
    OrganizationVerification,
    ReviewOrganizationVerificationRequest,
} from '../types/organizationVerification';


export const adminService = {

    /*
     * Admin service for managing users
     */
    /*admin: get list of users*/
    async listUsers(
        page = 1,
        pageSize = 10
    ): Promise<ApiResponse<User[]>> {
        const response = await apiClient.get<ApiResponse<User[]>>('/admin/users', {
            params: {
                page,
                page_size: pageSize,
            },
        });

        return response.data as ApiResponse<User[]>;
    },

    /*
     * Admin service for managing organization verification requests
     */
    // Get organization verification requests
    async listOrganizationVerifications(
        page = 1,
        pageSize = 10,
        status?: string
    ): Promise<ApiResponse<OrganizationVerification[]>> {
        const response = await apiClient.get<
            ApiResponse<OrganizationVerification[]>
        >('/admin/organization-verifications', {
            params: {
                page,
                page_size: pageSize,
                ...(status ? { status } : {}),
            },
        });

        return response.data as ApiResponse<OrganizationVerification[]>;
    },

    // Get a single organization verification
    async getOrganizationVerification(
        id: string
    ): Promise<OrganizationVerification> {
        const response = await apiClient.get<
            ApiResponse<{
                verification: OrganizationVerification;
                document_url?: string;
            }>
        >(`/admin/organization-verifications/${id}`);

        return response.data.data.verification;
    },

    // Review an organization verification
    async reviewOrganizationVerification(
        id: string,
        payload: ReviewOrganizationVerificationRequest
    ): Promise<void> {
        await apiClient.put<ApiResponse<null>>(
            `/admin/organization-verifications/${id}/review`,
            payload
        );
    },
};