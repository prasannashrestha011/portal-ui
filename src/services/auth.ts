import { apiClient } from "../api/client";
import { LoginRequest, MeResponseData, RegisterRequest, RegisterResponseData, TokenResponse } from "../types/auth";
import { ApiResponse } from "../types/http";

export const authService = {
    async registerStudent(payload: RegisterRequest) {
        const { data } = await apiClient.post<ApiResponse<RegisterResponseData>>(
            "/auth/register/student",
            payload
        );
        return data;
    },

    async registerEmployer(payload: RegisterRequest) {
        const { data } = await apiClient.post<ApiResponse<RegisterResponseData>>(
            "/auth/register/employer",
            payload
        );
        return data;
    },

    async login(payload: LoginRequest) {
        const { data } = await apiClient.post<ApiResponse<TokenResponse>>(
            "/auth/login",
            payload
        );
        return data;
    },

    async refresh(refreshToken: string) {
        const { data } = await apiClient.post<ApiResponse<TokenResponse>>(
            "/auth/refresh",
            { refresh_token: refreshToken }
        );
        return data;
    },

    async logout() {
        try {
            await apiClient.post<ApiResponse<null>>("/auth/logout");
        } finally {
        }
    },

    async me() {
        const { data } = await apiClient.get<ApiResponse<MeResponseData>>(
            "/auth/me"
        );
        return data;
    },
};