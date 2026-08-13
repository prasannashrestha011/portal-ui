import { User } from "./auth";


export interface EmployerProfile {
    id: string;
    user_id: string;
    organization_name: string;
    designation?: string;
    organization_logo?: string;
    organization_website?: string;
    organization_address?: string;
    industry?: string;
    organization_size?: string;
    organization_about?: string;
    user?: User;
    created_at: string;
    updated_at: string;
    verification_status: "draft" | "pending" | "verified" | "rejected";
}

export interface UpsertEmployerProfileRequest {
    organization_name: string;
    designation?: string;
    organization_website?: string;
    organization_address?: string;
    industry?: string;
    organization_size?: string;
    organization_about?: string;

    // profile/me/logo
    organization_logo?: File;
}
