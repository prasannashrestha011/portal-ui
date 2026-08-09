import axios, {
    // AxiosError,
    AxiosInstance,
    // InternalAxiosRequestConfig,
} from "axios";
// import { ApiResponse, TokenResponse } from "../types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     const { accessToken } = getTokens();
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
// });

// // Queue so concurrent 401s only trigger one refresh call
// let isRefreshing = false;
// let pendingQueue: Array<(token: string) => void> = [];

// function resolveQueue(token: string) {
//     pendingQueue.forEach((cb) => cb(token));
//     pendingQueue = [];
// }

// apiClient.interceptors.response.use(
//     (res) => res,
//     async (error: AxiosError) => {
//         const originalRequest = error.config as InternalAxiosRequestConfig & {
//             _retry?: boolean;
//         };

//         if (error.response?.status !== 401 || originalRequest._retry) {
//             return Promise.reject(error);
//         }

//         const { refreshToken } = getTokens();
//         if (!refreshToken) {
//             clearTokens();
//             return Promise.reject(error);
//         }

//         originalRequest._retry = true;

//         if (isRefreshing) {
//             return new Promise((resolve) => {
//                 pendingQueue.push((token: string) => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     resolve(apiClient(originalRequest));
//                 });
//             });
//         }

//         isRefreshing = true;
//         try {
//             const { data } = await axios.post<ApiResponse<TokenResponse>>(
//                 `${BASE_URL}/auth/refresh`,
//                 { refresh_token: refreshToken }
//             );
//             const tokens = data.data;
//             setTokens(tokens);
//             resolveQueue(tokens.access_token);
//             originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`;
//             return apiClient(originalRequest);
//         } catch (refreshErr) {
//             clearTokens();
//             return Promise.reject(refreshErr);
//         } finally {
//             isRefreshing = false;
//         }
//     }
// );