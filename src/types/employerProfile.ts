import { User } from "./auth";
import { Company } from "./company";


export interface EmployerProfile {
    id: string;
    user_id: string;
    company_id?: string | null;
    designation?: string;
    is_owner: boolean;
    user?: User;
    company?: Company;
    created_at: string;
    updated_at: string;
}

export interface UpsertEmployerProfileRequest {
    company_id?: string | null;
    designation?: string;
    is_owner: boolean;
}
