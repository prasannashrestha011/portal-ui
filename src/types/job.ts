// Matches Go models.Job

export interface Job {
    id: string;
    company_id: string;
    employer_id: string;
    title: string;
    description: string;
    location: string;
    remote: boolean;
    salary_range: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Body for POST /employers/jobs — company_id required, rest server-set
export type CreateJobRequest = Pick<
    Job,
    "company_id" | "title" | "description" | "location" | "remote" | "salary_range" | "is_active"
>;

// Body for PUT /employers/jobs/:id — handler only reads these fields
export type UpdateJobRequest = Pick<
    Job,
    "title" | "description" | "location" | "remote" | "salary_range" | "is_active"
>;
