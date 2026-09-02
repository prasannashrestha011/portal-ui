import { apiClient } from "../api/client";
import type {
    RecruiterApplication,
    RecruiterApplicationDetail,
    RecruiterApplicationListParams,
    RecruiterApplicationSummary,
    StudentApplicationListParams,
    StudentApplicationSummary,
    UpdateRecruiterApplicationStatusInput,
} from "../types/application";
import type { ApiResponse } from "../types/http";

export const applicationService = {
    async findStudentApplicationForInternship(
        internshipId: string,
        signal?: AbortSignal
    ) {
        const { data } = await apiClient.get<
            ApiResponse<StudentApplicationSummary | null>
        >(`/students/me/applications/internships/${internshipId}`, { signal });
        return data;
    },

    async listStudentApplications(
        params: StudentApplicationListParams,
        signal?: AbortSignal
    ) {
        const { data } = await apiClient.get<
            ApiResponse<StudentApplicationSummary[]>
        >("/students/me/applications", { params, signal });
        return data;
    },

    async listRecruiterApplications(
        params: RecruiterApplicationListParams,
        signal?: AbortSignal
    ) {
        const { data } = await apiClient.get<
            ApiResponse<RecruiterApplicationSummary[]>
        >("/recruiters/applications", { params, signal });
        return data;
    },

    async getRecruiterApplication(id: string, signal?: AbortSignal) {
        const { data } = await apiClient.get<
            ApiResponse<RecruiterApplicationDetail>
        >(`/recruiters/applications/${id}`, { signal });
        return data;
    },

    async updateRecruiterApplicationStatus(
        id: string,
        payload: UpdateRecruiterApplicationStatusInput
    ) {
        const { data } = await apiClient.put<ApiResponse<RecruiterApplication>>(
            `/recruiters/applications/${id}/status`,
            payload
        );
        return data;
    },
};
