
export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string; // Change to number if user.ID is an auto-incrementing integer
    email: string;
}

export interface LoginResponse {
    message: string;
    user: User;
}
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    expiry: string; // ISO timestamp
}

export interface RegisterResponseData {
    user_id: string;
}

export interface MeResponseData {
    id: string;
    email: string;
    full_name: string;
    role: "student" | "employer" | string;
}

// Wrapper matches responses.Success(c, status, message, data)
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Wrapper matches responses.Error / ErrorWithDetails
export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    details?: Record<string, unknown>;
}