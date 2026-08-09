import { CreateJobRequest, Job, UpdateJobRequest } from "../types/job";
import { apiClient } from "../api/client";
import { ApiResponse } from "../types/http";

export const jobService = {
    async create(payload: CreateJobRequest) {
        const { data } = await apiClient.post<ApiResponse<Job>>(
            "/employers/jobs",
            payload
        );
        return data;
    },

    async list() {
        const { data } = await apiClient.get<ApiResponse<Job[]>>("/employers/jobs");
        return data;
    },

    async get(id: string) {
        const { data } = await apiClient.get<ApiResponse<Job>>(`/employers/jobs/${id}`);
        return data;
    },

    async update(id: string, payload: UpdateJobRequest) {
        const { data } = await apiClient.put<ApiResponse<Job>>(
            `/employers/jobs/${id}`,
            payload
        );
        return data;
    },

    async delete(id: string) {
        const { data } = await apiClient.delete<ApiResponse<null>>(
            `/employers/jobs/${id}`
        );
        return data;
    },
};