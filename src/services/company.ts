import { apiClient } from "../api/client";
import { Company } from "../types/company";
import { ApiResponse } from "../types/http";

export interface CreateCompanyPayload {
    name: string;
    website?: string;
}

export interface UpdateCompanyPayload {
    name: string;
    website?: string;
}

export interface AddTeamMemberPayload {
    user_id: string;
    designation?: string;
}

export const companyService = {
    // Fetch company linked to current employer profile (preloaded with employees)
    async getMyCompany(): Promise<Company> {
        const res = await apiClient.get<ApiResponse<Company>>('/employers/companies/me');
        return res.data.data;
    },

    // Create company and link current user as owner
    async createCompany(payload: CreateCompanyPayload): Promise<Company> {
        const res = await apiClient.post<ApiResponse<Company>>('/employers/companies', payload);
        return res.data.data;
    },

    // Update existing company profile
    async updateCompany(id: string, payload: UpdateCompanyPayload): Promise<Company> {
        const res = await apiClient.put<ApiResponse<Company>>(`/employers/companies/${id}`, payload);
        return res.data.data;
    },

    // Delete company (owner only)
    async deleteCompany(id: string): Promise<void> {
        await apiClient.delete(`/employers/companies/${id}`);
    },

    // Upload logo image to MinIO
    async uploadLogo(id: string, file: File): Promise<Company> {
        const formData = new FormData();
        formData.append('file', file);

        const res = await apiClient.post<ApiResponse<Company>>(
            `/employers/companies/${id}/logo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data.data;
    },

    async searchCompanies(query: string): Promise<Company[]> {
        const res = await apiClient.get<ApiResponse<Company[]>>('/employers/companies/search', {
            params: { q: query },
        });
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
};