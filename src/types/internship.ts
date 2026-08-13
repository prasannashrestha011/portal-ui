
export interface Internship {
    id: string;
    issued_by: string;

    // Basic Information
    title: string;
    description: string;
    location: string;
    work_mode: WorkMode;

    // Internship Details
    internship_type: InternshipType
    duration: number;
    duration_unit: DurationUnit;
    working_hours: string;

    // Requirements
    required_skills: string;
    preferred_skills: string;
    required_education: string;

    // Student eligibility
    eligible_programs: string;
    eligible_semester: string;

    // Stipend
    stipend_amount: number;
    stipend_currency: string;
    stipend_period: StipendPeriod

    // Vacancy
    vacancy_count: number;

    // Timeline
    start_date?: string;
    application_deadline?: string;

    // Application
    application_email?: string;
    application_url?: string;

    // Additional Information
    responsibilities: string;
    benefits: string;

    // Status
    status: InternshipStatus
    is_active: boolean;

    created_at: string;
    updated_at: string;
}

export interface CreateInternshipInput {
    issued_by: string;
    title: string;
    description: string;
    location: string;
    work_mode: WorkMode;
    internship_type: InternshipType;
    duration?: number;
    duration_unit?: DurationUnit;
    working_hours?: string;
    required_skills?: string;
    preferred_skills?: string;
    required_education?: string;
    eligible_programs?: string;
    eligible_semester?: string;
    stipend_amount?: number;
    stipend_currency?: string;
    stipend_period?: StipendPeriod;
    vacancy_count: number;
    start_date?: string;
    application_deadline?: string;
    application_email?: string;
    application_url?: string;
    responsibilities?: string;
    benefits?: string;
    status?: InternshipStatus;
}

export interface UpdateInternshipInput extends Partial<CreateInternshipInput> {
    is_active?: boolean;
}

export interface InternshipSearchQueryParams {
    q?: string;
    location?: string;
    work_mode?: WorkMode;
    internship_type?: InternshipType;
    duration_unit?: DurationUnit;
    eligible_programs?: string;
    eligible_semester?: string;
    min_stipend?: number;
    employer_id?: string;
    exclude_expired?: boolean;
    is_active?: boolean;
    status?: InternshipStatus;
    page?: number;
    page_size?: number;
}

export type InternshipType = "paid" | "unpaid";
export type WorkMode = "onsite" | "remote" | "hybrid";
export type DurationUnit = "weeks" | "months";
export type StipendPeriod = "monthly" | "weekly" | "fixed";
export type InternshipStatus = "draft" | "published" | "closed" | "expired";