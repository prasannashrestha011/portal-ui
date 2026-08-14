import { apiClient } from "../api/client";
import { ApiResponse, Page } from "../types/http";
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
    async listMyInternships(params?: Page) {
        const { data } = await apiClient.get<ApiResponse<Internship[]>>(
            "/recruiters/me/internships",
            { params }
        );
        return data;
    },

    /** Employer: list my recent top 3 job */
    async listRecentInternship() {
        const { data } = await apiClient.get<ApiResponse<Internship[]>>(
            "/recruiters/me/internships",
            { params: { page: 1, page_size: 3 } }
        );
        return data;
    },

    /** Recruiter: create a new internship */
    async createInternship(payload: CreateInternshipInput) {
        const { data } = await apiClient.post<ApiResponse<Internship>>(
            "/recruiters/me/internships",
            payload
        );
        return data;
    },

    /** Recruiter: update an existing internship */
    async updateInternship(id: string, payload: UpdateInternshipInput) {
        const { data } = await apiClient.put<ApiResponse<Internship>>(
            `/recruiters/me/internships/${id}`,
            payload
        );
        console.log("Updated internship data:", data);
        return data;
    },

    /** Recruiter: delete an internship */
    async deleteInternship(id: string) {
        const { data } = await apiClient.delete<ApiResponse<null>>(
            `/recruiters/me/internships/${id}`
        );
        return data;
    },
};