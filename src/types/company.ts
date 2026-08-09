
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface Company {
    id: string;
    owner_id: string;
    name: string;
    website?: string;
    logo_key?: string;
    verification_status?: VerificationStatus;
    verification_document_key?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}

// Request Payloads
export interface CreateCompanyPayload {
    name: string;
    website?: string;
}

export interface UpdateCompanyPayload {
    name: string;
    website?: string;
    logo_key?: string;
}

export interface AddTeamMemberPayload {
    user_id: string;
    designation?: string;
}

export interface ReviewVerificationPayload {
    status: VerificationStatus;
    rejection_reason?: string;
}

export interface ListVerificationParams {
    status?: VerificationStatus;
    page?: number;
    limit?: number;
}

// Response Structures
export interface UploadVerificationDocumentData {
    company_id: string;
    document_key: string;
    verification_status: VerificationStatus;
}

export interface PaginatedCompaniesData {
    companies: Company[];
    total: number;
    page: number;
    limit: number;
}

// Aliases for compatibility
export type CreateCompanyRequest = CreateCompanyPayload;
export type UpdateCompanyRequest = UpdateCompanyPayload;