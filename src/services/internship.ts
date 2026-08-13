import { apiClient } from "../api/client";
import { ApiResponse } from "../types/http";
import {
    CreateInternshipInput,
    Internship,
    InternshipSearchQueryParams,
    UpdateInternshipInput,
} from "../types/internship";

export const internshipService = {
    /** Public: search and list internships */
    async searchInternship(params?: InternshipSearchQueryParams) {
        const { data } = await apiClient.get<ApiResponse<Internship[]>>(
            "/internships",
            { params }
        );
        return data;
    },

    /** Public: get internship details by ID */
    async getInternshipById(id: string) {
        const { data } = await apiClient.get<ApiResponse<Internship>>(`/internships/${id}`);
        return data;
    },

    /** Employer: list my own internships */
    async listMyInternships(params?: InternshipSearchQueryParams) {
        const { data } = await apiClient.get<ApiResponse<Internship[]>>(
            "/employers/me/internships",
            { params }
        );
        return data;
    },

    /** Employer: create a new internship */
    async createInternship(payload: CreateInternshipInput) {
        const { data } = await apiClient.post<ApiResponse<Internship>>(
            "/employers/me/internships",
            payload
        );
        return data;
    },

    /** Employer: update an existing internship */
    async updateInternship(id: string, payload: UpdateInternshipInput) {
        const { data } = await apiClient.put<ApiResponse<Internship>>(
            `/employers/me/internships/${id}`,
            payload
        );
        return data;
    },

    /** Employer: delete an internship */
    async deleteInternship(id: string) {
        const { data } = await apiClient.delete<ApiResponse<null>>(
            `/employers/me/internships/${id}`
        );
        return data;
    },
};