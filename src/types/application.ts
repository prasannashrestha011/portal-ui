import type { InternshipStatus } from "./internship";

export const APPLICATION_STATUS = {
    SUBMITTED: "submitted",
    REVIEWING: "reviewing",
    SHORTLISTED: "shortlisted",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    WITHDRAWN: "withdrawn",
} as const;

export type ApplicationStatus =
    (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export interface RecruiterCandidate {
    id: string;
    full_name: string;
    phone: string;
    location: string;
    bio: string;
    college_name: string;
    degree: string;
    faculty_or_major: string;
    current_semester: string;
    graduation_year: number;
    availability: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
}

export type RecruiterCandidateSummary = Pick<
    RecruiterCandidate,
    | "id"
    | "full_name"
    | "location"
    | "college_name"
    | "degree"
    | "faculty_or_major"
    | "current_semester"
>;

export interface RecruiterApplicationInternship {
    id: string;
    title: string;
    location: string;
    work_mode: string;
    internship_type: string;
    status: InternshipStatus;
}

export interface RecruiterApplication {
    id: string;
    internship_id: string;
    student_id: string;
    status: ApplicationStatus;
    employer_note: string;
    applied_at: string;
    reviewed_at: string | null;
    shortlisted_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
    withdrawn_at: string | null;
    created_at: string;
    updated_at: string;
    student: RecruiterCandidate | null;
    internship: RecruiterApplicationInternship | null;
}

export interface RecruiterApplicationSummary {
    id: string;
    internship_id: string;
    student_id: string;
    status: ApplicationStatus;
    applied_at: string;
    created_at: string;
    updated_at: string;
    student: RecruiterCandidateSummary | null;
    internship: RecruiterApplicationInternship | null;
}

export interface RecruiterApplicationDocument {
    id: string;
    file_name: string;
    mime_type: string;
    size: number;
}

export interface RecruiterApplicationDetail {
    application: RecruiterApplication;
    document: RecruiterApplicationDocument | null;
    document_url: string | null;
}

export interface RecruiterApplicationListParams {
    page: number;
    page_size: number;
    q?: string;
    internship_id?: string;
    status?: ApplicationStatus;
}

export interface UpdateRecruiterApplicationStatusInput {
    status: Extract<ApplicationStatus, "accepted" | "rejected">;
    employer_note?: string;
}

export type StudentApplicationStatusFilter =
    | "pending"
    | "accepted"
    | "rejected";

export interface StudentApplicationInternship {
    id: string;
    title: string;
    organization_name: string;
    location: string;
    work_mode: string;
    internship_type: string;
    duration: number;
    duration_unit: string;
}

export interface StudentApplicationSummary {
    id: string;
    internship_id: string;
    status: ApplicationStatus;
    employer_note: string;
    applied_at: string;
    reviewed_at: string | null;
    shortlisted_at: string | null;
    accepted_at: string | null;
    rejected_at: string | null;
    withdrawn_at: string | null;
    updated_at: string;
    internship: StudentApplicationInternship | null;
}

export interface StudentApplicationListParams {
    page: number;
    page_size: number;
    status?: StudentApplicationStatusFilter;
}
