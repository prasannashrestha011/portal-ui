export type JobType = "full_time" | "part_time" | "internship" | "contract";
export type WorkMode = "onsite" | "remote" | "hybrid";
export type ExperienceLevel = "entry" | "junior" | "mid" | "senior";
export type JobStatus = "draft" | "published" | "closed" | "expired";
export type SalaryPeriod = "hourly" | "daily" | "weekly" | "monthly" | "yearly";

export interface CompanySummary {
    id: string;
    name: string;
    website?: string;
    logo_key?: string;
    verification_status: string;
}

export interface Job {
    id: string;
    company_id: string;
    issued_by: string;
    company?: CompanySummary;
    title: string;
    description: string;
    location: string;
    remote: boolean;
    job_type: JobType;
    work_mode: WorkMode;
    experience_level: ExperienceLevel;
    required_skills: string;
    required_education?: string;
    experience_required: number;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    salary_period: SalaryPeriod;
    vacancy_count: number;
    application_deadline?: string;
    application_email?: string;
    application_url?: string;
    is_active: boolean;
    status: JobStatus;
    benefits?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateJobInput {
    company_id: string;
    title: string;
    description: string;
    location: string;
    remote: boolean;
    job_type: JobType;
    work_mode: WorkMode;
    experience_level: ExperienceLevel;
    required_skills: string;
    required_education?: string;
    experience_required?: number;
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
    salary_period?: SalaryPeriod;
    vacancy_count: number;
    application_deadline?: string;
    application_email?: string;
    application_url?: string;
    status?: JobStatus;
    benefits?: string;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
    is_active?: boolean;
}

export interface JobSearchQueryParams {
    q?: string;
    location?: string;
    remote?: boolean;
    job_type?: JobType;
    work_mode?: WorkMode;
    experience_level?: ExperienceLevel;
    company_id?: string;
    employer_id?: string;
    min_salary?: number;
    exclude_expired?: boolean;
    is_active?: boolean;
    status?: JobStatus;
    page?: number;
    page_size?: number;
}

export interface PaginationMeta {
    page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
}

export interface PaginatedJobsResponseData {
    jobs: Job[];
    pagination: PaginationMeta;
}