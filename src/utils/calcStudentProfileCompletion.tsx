
// Completion Score Calculation
export function calculateCompletionScore(profile: any): number {
    if (!profile) return 0;
    const fields = [
        "full_name",
        "phone",
        "location",
        "bio",
        "college_name",
        "degree",
        "faculty_or_major",
        "preferred_job_categories",
        "preferred_locations",
        "linkedin_url",
        "github_url",
    ];
    const filled = fields.filter((f) => Boolean(profile[f])).length;
    return Math.round((filled / fields.length) * 100);
}
