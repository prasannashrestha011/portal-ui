import { apiClient } from "../api/client";

import {
    Company,
    CreateCompanyPayload,
    UpdateCompanyPayload,
    AddTeamMemberPayload,
    ReviewVerificationPayload,
    ListVerificationParams,
    UploadVerificationDocumentData,
    PaginatedCompaniesData,
} from "../types/company";

import { ApiResponse } from "../types/http";

export const companyService = {
    // ============================================================================
    // EMPLOYER & OWNER METHODS
    // ============================================================================

    // Fetch company linked to current employer profile (preloaded with employees)
    async getMyCompany(): Promise<Company> {
        const res = await apiClient.get<ApiResponse<Company>>("/employers/companies/me");
        return res.data.data;
    },

    // Fetch single company by ID
    async getCompany(id: string): Promise<Company> {
        const res = await apiClient.get<ApiResponse<Company>>(`/employers/companies/${id}`);
        return res.data.data;
    },

    // List all companies
    async listCompanies(): Promise<Company[]> {
        const res = await apiClient.get<ApiResponse<Company[]>>("/employers/companies");
        return res.data.data;
    },

    // Create company and link current user as owner
    async createCompany(payload: CreateCompanyPayload): Promise<Company> {
        const res = await apiClient.post<ApiResponse<Company>>("/employers/companies", payload);
        return res.data.data;
    },

    // Update existing company details
    async updateCompany(id: string, payload: UpdateCompanyPayload): Promise<Company> {
        const res = await apiClient.put<ApiResponse<Company>>(`/employers/companies/${id}`, payload);
        return res.data.data;
    },

    // Delete company (owner only)
    async deleteCompany(id: string): Promise<void> {
        await apiClient.delete(`/employers/companies/${id}`);
    },

    // Search companies by query string
    async searchCompanies(query: string): Promise<Company[]> {
        const res = await apiClient.get<ApiResponse<Company[]>>("/employers/companies/search", {
            params: { q: query },
        });
        return res.data.data;
    },

    // Upload logo image to MinIO
    async uploadLogo(id: string, file: File): Promise<Company> {
        const formData = new FormData();
        formData.append("file", file);

        const res = await apiClient.post<ApiResponse<Company>>(
            `/employers/companies/${id}/logo`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data.data;
    },

    // Upload company registration/PAN verification document (PDF/Image)
    async uploadVerificationDocument(
        id: string,
        file: File
    ): Promise<UploadVerificationDocumentData> {
        const formData = new FormData();
        formData.append("file", file);

        const res = await apiClient.post<ApiResponse<UploadVerificationDocumentData>>(
            `/employers/companies/${id}/verification-document`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return res.data.data;
    },

    // Add employer team member to company
    async addTeamMember(companyId: string, payload: AddTeamMemberPayload): Promise<void> {
        await apiClient.post(`/employers/companies/${companyId}/members`, payload);
    },

    // Remove team member from company
    async removeTeamMember(companyId: string, userId: string): Promise<void> {
        await apiClient.delete(`/employers/companies/${companyId}/members/${userId}`);
    },

    // ============================================================================
    // SUPER ADMIN VERIFICATION METHODS
    // ============================================================================

    // List companies filtered by verification status with pagination
    async listByVerificationStatus(
        params?: ListVerificationParams
    ): Promise<PaginatedCompaniesData> {
        const res = await apiClient.get<ApiResponse<PaginatedCompaniesData>>(
            "/admin/companies/verification",
            {
                params: {
                    status: params?.status ?? "pending",
                    page: params?.page ?? 1,
                    limit: params?.limit ?? 10,
                },
            }
        );
        return res.data.data;
    },

    // Fetch/stream verification document file blob directly from MinIO
    async getVerificationDocumentBlob(companyId: string): Promise<Blob> {
        const res = await apiClient.get<Blob>(
            `/admin/companies/${companyId}/verification-document`,
            {
                responseType: "blob",
            }
        );
        return res.data;
    },

    // Approve or Reject company verification status
    async reviewVerification(
        companyId: string,
        payload: ReviewVerificationPayload
    ): Promise<void> {
        await apiClient.put(`/admin/companies/${companyId}/verification`, payload);
    },
};