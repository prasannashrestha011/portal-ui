import {
    ApiResponse,
    StudentApplicationStats,
    StudentDocument,
    StudentProfile,
    UpsertStudentProfileRequest,
} from "../types/studentProfile";
import { apiClient } from "../api/client";

export const studentService = {
    async getProfile() {
        const { data } = await apiClient.get<ApiResponse<StudentProfile>>(
            "/students/me/profile"
        );
        return data;
    },

    async upsertProfile(payload: UpsertStudentProfileRequest) {
        const { data } = await apiClient.post<ApiResponse<StudentProfile>>(
            "/students/me/profile",
            payload
        );
        return data;
    },

    async getApplicationStats() {
        const { data } = await apiClient.get<ApiResponse<StudentApplicationStats>>(
            "/students/me/stats"
        );
        return data;
    },

    async uploadDocument(file: File) {
        const form = new FormData();
        form.append("file", file);
        const { data } = await apiClient.post<ApiResponse<StudentDocument>>(
            "/students/me/documents",
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    },

    async listDocuments() {
        const { data } = await apiClient.get<ApiResponse<StudentDocument[]>>(
            "/students/me/documents"
        );
        return data;
    },

    async setDefaultDocument(id: string) {
        const { data } = await apiClient.post<ApiResponse<null>>(
            `/students/me/documents/${id}/default`
        );
        return data;
    },

    async deleteDocument(id: string) {
        const { data } = await apiClient.delete<ApiResponse<null>>(
            `/students/me/documents/${id}`
        );
        return data;
    },
};
