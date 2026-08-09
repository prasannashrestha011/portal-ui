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
        <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Profile</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your personal details, academic background, and job preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Section title="Personal Information" description="Basic information for your public profile.">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                rows={3}
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Tell recruiters briefly about yourself, your skills, and what drives you..."
                            />
                        </Field>
                    </div>
                </Section>

                <Section title="Academic Background" description="Your educational history and graduation timeline.">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                        any
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

                <Section title="Work & Career Preferences" description="Help recruiters match you with relevant opportunities.">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

                <Section title="Links & Online Presence" description="Where employers can check your work and history.">
                    <div className="space-y-4">
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

                <Section title="Privacy & Settings" description="Control how your profile appears to employers.">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="space-y-0.5">
                            <label htmlFor="is_searchable" className="cursor-pointer text-sm font-semibold text-slate-900">
                                Employer Visibility
                            </label>
                            <p className="text-xs text-slate-500">
                                Allow employers and recruiters to discover your profile in search results.
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={form.is_searchable}
                            onClick={() => setForm((prev) => ({ ...prev, is_searchable: !prev.is_searchable }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${form.is_searchable ? "bg-slate-900" : "bg-slate-200"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_searchable ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </Section>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                        Profile saved successfully!
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving profile..." : "Save profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}

