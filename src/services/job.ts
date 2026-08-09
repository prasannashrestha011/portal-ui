import { apiClient } from "../api/client";
import { ApiResponse } from "../types/http";
import {
    CreateJobInput,
    Job,
    JobSearchQueryParams,
    PaginatedJobsResponseData,
    UpdateJobInput,
} from "../types/job";

export const jobService = {
    /**
     * Search and list jobs with query parameters and pagination
     */
    async searchJobs(params?: JobSearchQueryParams) {
        const { data } = await apiClient.get<ApiResponse<PaginatedJobsResponseData>>(
            "/jobs",
            { params }
        );
        return data;
    },

    /**
     * Get job details by ID
     */
    async getJobById(id: string) {
        const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
        return data;
    },

    /**
     * List jobs associated with a specific company
     */
    async getCompanyJobs(companyId: string, page = 1, pageSize = 10) {
        const { data } = await apiClient.get<ApiResponse<PaginatedJobsResponseData>>(
            `/companies/${companyId}/jobs`,
            {
                params: { page, page_size: pageSize },
            }
        );
        return data;
    },

    /**
     * Create a new job posting (Employer / Admin)
     */
    async createJob(payload: CreateJobInput) {
        const { data } = await apiClient.post<ApiResponse<Job>>(
            "/jobs",
            payload
        );
        return data;
    },

    /**
     * Update an existing job posting (Employer / Admin)
     */
    async updateJob(id: string, payload: UpdateJobInput) {
        const { data } = await apiClient.put<ApiResponse<Job>>(
            `/jobs/${id}`,
            payload
        );
        return data;
    },

    /**
     * Delete a job posting (Employer / Admin)
     */
    async deleteJob(id: string) {
        const { data } = await apiClient.delete<ApiResponse<null>>(`/jobs/${id}`);
        return data;
    },
};