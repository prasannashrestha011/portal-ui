// Matches Go models.StudentProfile / StudentDocument

export interface StudentProfile {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    location: string;
    bio: string;
    college_name: string;
    degree: string;
    faculty_or_major: string;
    current_semester: string;
    graduation_year: number;
    preferred_job_categories: string;
    preferred_locations: string;
    preferred_work_mode: string;
    availability: string;
    expected_salary: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    profile_image_key: string;
    is_searchable: boolean;
    profile_completion_percentage: number;
    created_at: string;
    updated_at: string;
}

// Body for POST /students/me/profile — server sets id/user_id/updated_at
export type UpsertStudentProfileRequest = Omit<
    StudentProfile,
    "id" | "user_id" | "created_at" | "updated_at" | "profile_completion_percentage"
>;

export interface StudentDocument {
    id: string;
    profile_id: string;
    user_id: string;
    object_key: string;
    file_name: string;
    mime_type: string;
    size: number;
    is_default: boolean;
    created_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}