import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import { StudentProfile, UpsertStudentProfileRequest } from "@/src/types/studentProfile";
import { useState } from "react";
import { Section, Field, Input, Select, Textarea } from "../Form/common";

const initialForm: UpsertStudentProfileRequest = {
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    college_name: "",
    degree: "",
    faculty_or_major: "",
    current_semester: "",
    graduation_year: new Date().getFullYear(),
    preferred_job_categories: "",
    preferred_locations: "",
    preferred_work_mode: "",
    availability: "",
    expected_salary: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    profile_image_key: "",
    is_searchable: true,
};

export function StudentProfileFormContent({ profile }: { profile: StudentProfile | null }) {
    const { saveProfile } = useStudentProfileStore();

    const [form, setForm] = useState<UpsertStudentProfileRequest>(() => ({
        ...initialForm,
        ...(profile || {}),
    }));

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        const val =
            type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                    ? Number(value)
                    : value;

        setForm((prev) => ({ ...prev, [name]: val }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await saveProfile(form as StudentProfile);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch {
            setError("Failed to save profile. Please check your connection and try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="mx-auto my-6 max-w-4xl px-4 sm:px-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-10 md:p-12 space-y-8 sm:space-y-10">
                {/* Header */}
                <div className="border-b border-slate-100 pb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Student Workspace
                    </p>
                    <h1 className="workspace-page-title mt-1 text-slate-900">
                        Student Profile
                    </h1>
                    <p className="workspace-body mt-2 text-slate-600">
                        Manage your personal details, academic background, and job preferences.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 text-sm sm:text-base font-medium text-red-800">
                        <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Banner */}
                {success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-sm sm:text-base font-medium text-emerald-800">
                        <svg className="h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Profile saved successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Personal Information */}
                    <Section title="Personal Information" description="Basic information for your public profile.">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field label="Full Name" required>
                                <Input
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Jane Doe"
                                    required
                                />
                            </Field>

                            <Field label="Phone Number">
                                <Input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </Field>

                            <Field label="Location" className="sm:col-span-2">
                                <Input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </Field>

                            <Field label="Bio" className="sm:col-span-2">
                                <Textarea
                                    name="bio"
                                    rows={4}
                                    value={form.bio}
                                    onChange={handleChange}
                                    placeholder="Tell recruiters briefly about yourself, your skills, and what drives you..."
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Academic Background */}
                    <Section title="Academic Background" description="Your educational history and graduation timeline.">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field label="College / University" className="sm:col-span-2">
                                <Input
                                    name="college_name"
                                    value={form.college_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Stanford University"
                                />
                            </Field>

                            <Field label="Degree">
                                <Input
                                    name="degree"
                                    value={form.degree}
                                    onChange={handleChange}
                                    placeholder="e.g. Bachelor of Science"
                                />
                            </Field>

                            <Field label="Faculty / Major">
                                <Input
                                    name="faculty_or_major"
                                    value={form.faculty_or_major}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                />
                            </Field>

                            <Field label="Current Semester">
                                <Input
                                    name="current_semester"
                                    value={form.current_semester}
                                    onChange={handleChange}
                                    placeholder="e.g. 6th Semester / Spring"
                                />
                            </Field>

                            <Field label="Graduation Year">
                                <Input
                                    type="number"
                                    name="graduation_year"
                                    value={form.graduation_year}
                                    onChange={handleChange}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Work & Career Preferences */}
                    <Section title="Work & Career Preferences" description="Help recruiters match you with relevant opportunities.">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Field label="Work Mode Preference">
                                <Select
                                    name="preferred_work_mode"
                                    value={form.preferred_work_mode}
                                    onChange={handleChange}
                                >
                                    <option value="">Select preference</option>
                                    <option value="remote">Remote</option>
                                    <option value="onsite">Onsite</option>
                                    <option value="hybrid">Hybrid</option>
                                </Select>
                            </Field>

                            <Field label="Availability">
                                <Input
                                    name="availability"
                                    value={form.availability}
                                    onChange={handleChange}
                                    placeholder="e.g. Immediate / 2 Weeks"
                                />
                            </Field>

                            <Field label="Preferred Job Categories" className="sm:col-span-2">
                                <Input
                                    name="preferred_job_categories"
                                    value={form.preferred_job_categories}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend, Fullstack, UI/UX (comma separated)"
                                />
                            </Field>

                            <Field label="Preferred Locations">
                                <Input
                                    name="preferred_locations"
                                    value={form.preferred_locations}
                                    onChange={handleChange}
                                    placeholder="e.g. Remote, New York, Austin"
                                />
                            </Field>

                            <Field label="Expected Salary">
                                <Input
                                    name="expected_salary"
                                    value={form.expected_salary}
                                    onChange={handleChange}
                                    placeholder="e.g. $80,000/year"
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Links & Online Presence */}
                    <Section title="Links & Online Presence" description="Where employers can check your work and history.">
                        <div className="grid grid-cols-1 gap-6">
                            <Field label="LinkedIn URL">
                                <Input
                                    name="linkedin_url"
                                    value={form.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </Field>

                            <Field label="GitHub URL">
                                <Input
                                    name="github_url"
                                    value={form.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                            </Field>

                            <Field label="Portfolio URL">
                                <Input
                                    name="portfolio_url"
                                    value={form.portfolio_url}
                                    onChange={handleChange}
                                    placeholder="https://yourportfolio.com"
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* Privacy & Settings */}
                    <Section title="Privacy & Settings" description="Control how your profile appears to employers.">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 transition-colors hover:bg-slate-50">
                            <div className="space-y-1">
                                <label htmlFor="is_searchable" className="workspace-section-title cursor-pointer text-slate-900">
                                    Employer Visibility
                                </label>
                                <p className="workspace-body text-slate-500">
                                    Allow employers and recruiters to discover your profile in search results.
                                </p>
                            </div>

                            <button
                                type="button"
                                role="switch"
                                aria-checked={form.is_searchable}
                                onClick={() => setForm((prev) => ({ ...prev, is_searchable: !prev.is_searchable }))}
                                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${form.is_searchable ? "bg-blue-600" : "bg-slate-300"
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${form.is_searchable ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </Section>

                    {/* Form Action Controls */}
                    <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="workspace-action inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                        >
                            {saving && (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span>{saving ? "Saving profile..." : "Save profile"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
