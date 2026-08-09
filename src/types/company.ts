// Matches Go models.Company

export interface Company {
    id: string;
    owner_id: string;
    name: string;
    website?: string;
    logo_key?: string;
    created_at: string;
    updated_at: string;
}

// Body for POST /employers/companies
export type CreateCompanyRequest = Pick<Company, "name" | "website">;

// Body for PUT /employers/companies/:id — handler only reads name/website/logo_key
export type UpdateCompanyRequest = Pick<Company, "name" | "website" | "logo_key">;

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}