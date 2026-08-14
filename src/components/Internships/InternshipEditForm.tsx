"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    useForm,
    SubmitHandler,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Save,
    Wallet,
} from "lucide-react"

import { internshipService } from "@/src/services/internship"

import {
    WorkMode,
    InternshipType,
    DurationUnit,
    StipendPeriod,
    UpdateInternshipInput,
} from "@/src/types/internship"

import {
    updateInternshipSchema,
    UpdateInternshipFormValues,
} from "@/src/schemas/internship"

interface InternshipEditFormProps {
    id: string
}

const InternshipEditForm = ({
    id,
}: InternshipEditFormProps) => {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(
        null
    )
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isDirty,
        },
    } = useForm<UpdateInternshipFormValues>({
        resolver: zodResolver(
            updateInternshipSchema
        ),
        defaultValues: {
            title: "",
            description: "",
            location: "",

            work_mode: "onsite",
            internship_type: "paid",

            duration: 1,
            duration_unit: "months",

            working_hours: "",

            required_skills: "",
            preferred_skills: "",
            required_education: "",

            eligible_programs: "",
            eligible_semester: "",

            stipend_amount: 0,
            stipend_currency: "NPR",
            stipend_period: "monthly",

            vacancy_count: 1,

            start_date: "",
            application_deadline: "",

            application_email: "",
            application_url: "",

            responsibilities: "",
            benefits: "",
        },
    })

    /*
     * ---------------------------------------------------------
     * LOAD INTERNSHIP
     * ---------------------------------------------------------
     */

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                setLoading(true)
                setLoadError(null)

                const response =
                    await internshipService.getInternshipById(
                        id
                    )

                const internship = response.data

                reset({
                    title: internship.title ?? "",

                    description:
                        internship.description ?? "",

                    location:
                        internship.location ?? "",

                    work_mode:
                        internship.work_mode,

                    internship_type:
                        internship.internship_type,

                    duration:
                        internship.duration ?? 1,

                    duration_unit:
                        internship.duration_unit,

                    working_hours:
                        internship.working_hours ?? "",

                    required_skills:
                        internship.required_skills ?? "",

                    preferred_skills:
                        internship.preferred_skills ?? "",

                    required_education:
                        internship.required_education ?? "",

                    eligible_programs:
                        internship.eligible_programs ?? "",

                    eligible_semester:
                        internship.eligible_semester ?? "",

                    stipend_amount:
                        internship.stipend_amount ?? 0,

                    stipend_currency:
                        internship.stipend_currency ?? "NPR",

                    stipend_period:
                        internship.stipend_period,

                    vacancy_count:
                        internship.vacancy_count ?? 1,

                    start_date:
                        toDateInputValue(
                            internship.start_date
                        ),

                    application_deadline:
                        toDateInputValue(
                            internship.application_deadline
                        ),

                    application_email:
                        internship.application_email ??
                        "",

                    application_url:
                        internship.application_url ??
                        "",

                    responsibilities:
                        internship.responsibilities ??
                        "",

                    benefits:
                        internship.benefits ?? "",
                })
            } catch (error) {
                console.error(error)

                setLoadError(
                    "Unable to load internship details."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchInternship()
    }, [id, reset])

    /*
     * ---------------------------------------------------------
     * SUBMIT
     * ---------------------------------------------------------
     */

    const onSubmit: SubmitHandler<
        UpdateInternshipFormValues
    > = async (values) => {
        try {
            setSaving(true)
            setSuccess(false)

            const payload: UpdateInternshipInput = {
                title: values.title.trim(),

                description:
                    values.description.trim(),

                location:
                    values.location?.trim() || "",

                work_mode:
                    values.work_mode as WorkMode,

                internship_type:
                    values.internship_type as InternshipType,

                duration:
                    values.duration,

                duration_unit:
                    values.duration_unit as DurationUnit,

                working_hours:
                    values.working_hours?.trim() || "",

                required_skills:
                    values.required_skills?.trim() || "",

                preferred_skills:
                    values.preferred_skills?.trim() || "",

                required_education:
                    values.required_education?.trim() ||
                    "",

                eligible_programs:
                    values.eligible_programs?.trim() ||
                    "",

                eligible_semester:
                    values.eligible_semester?.trim() ||
                    "",

                stipend_amount:
                    values.stipend_amount,

                stipend_currency:
                    values.stipend_currency,

                stipend_period:
                    values.stipend_period as StipendPeriod,

                vacancy_count:
                    values.vacancy_count,

                start_date:
                    toRFC3339(
                        values.start_date
                    ),

                application_deadline:
                    toRFC3339(
                        values.application_deadline
                    ),

                application_email:
                    values.application_email?.trim() ||
                    undefined,

                application_url:
                    values.application_url?.trim() ||
                    undefined,

                responsibilities:
                    values.responsibilities?.trim() ||
                    "",

                benefits:
                    values.benefits?.trim() || "",
            }

            await internshipService.updateInternship(
                id,
                payload
            )

            setSuccess(true)

            /*
             * Give the user a moment to see success
             * before navigating.
             */
            setTimeout(() => {
                router.push(
                    `/recruiter/internships/list/${id}`
                )
            }, 700)
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (loading) {
        return <EditSkeleton />
    }

    /*
     * ---------------------------------------------------------
     * LOAD ERROR
     * ---------------------------------------------------------
     */

    if (loadError) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            !
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-slate-900">
                            Unable to load internship
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {loadError}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                router.back()
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </button>

                    </div>
                </div>
            </div>
        )
    }

    /*
     * ---------------------------------------------------------
     * FORM
     * ---------------------------------------------------------
     */

    return (
        <div className="min-h-screen bg-slate-50">

            {/* HEADER */}

            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    router.back()
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                    Recruiter
                                </p>

                                <h1 className="text-xl font-bold text-slate-900">
                                    Edit Internship
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update your internship
                                    posting
                                </p>
                            </div>

                        </div>

                        <button
                            type="submit"
                            form="internship-edit-form"
                            disabled={saving}
                            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 sm:flex"
                        >
                            <Save className="h-4 w-4" />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </div>
            </header>

            {/* CONTENT */}

            <main className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-8">

                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                        Internship updated successfully.
                    </div>
                )}

                <form
                    id="internship-edit-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    {/* BASIC INFORMATION */}

                    <Section
                        icon={
                            <BriefcaseBusiness className="h-5 w-5" />
                        }
                        title="Basic Information"
                        description="Update the main information about your internship."
                    >
                        <div className="space-y-5">

                            <Field
                                label="Internship Title"
                                required
                                error={
                                    errors.title?.message
                                }
                            >
                                <input
                                    {...register("title")}
                                    className={inputClass(
                                        !!errors.title
                                    )}
                                    placeholder="Software Engineering Intern"
                                />
                            </Field>

                            <Field
                                label="Description"
                                required
                                error={
                                    errors.description
                                        ?.message
                                }
                            >
                                <textarea
                                    {...register(
                                        "description"
                                    )}
                                    rows={6}
                                    className={textareaClass(
                                        !!errors.description
                                    )}
                                    placeholder="Describe the internship..."
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">

                                <Field
                                    label="Location"
                                    error={
                                        errors.location
                                            ?.message
                                    }
                                >
                                    <input
                                        {...register(
                                            "location"
                                        )}
                                        className={inputClass(
                                            !!errors.location
                                        )}
                                        placeholder="Kathmandu, Nepal"
                                    />
                                </Field>

                                <Field
                                    label="Work Mode"
                                    required
                                    error={
                                        errors.work_mode
                                            ?.message
                                    }
                                >
                                    <select
                                        {...register(
                                            "work_mode"
                                        )}
                                        className={inputClass(
                                            !!errors.work_mode
                                        )}
                                    >
                                        <option value="">
                                            Select work mode
                                        </option>
                                        <option value="onsite">
                                            On-site
                                        </option>
                                        <option value="remote">
                                            Remote
                                        </option>
                                        <option value="hybrid">
                                            Hybrid
                                        </option>
                                    </select>
                                </Field>

                            </div>
                        </div>
                    </Section>

                    {/* INTERNSHIP DETAILS */}

                    <Section
                        icon={
                            <Clock3 className="h-5 w-5" />
                        }
                        title="Internship Details"
                        description="Set the internship type, duration and working schedule."
                    >
                        <div className="grid gap-5 md:grid-cols-2">

                            <Field
                                label="Internship Type"
                                required
                                error={
                                    errors.internship_type
                                        ?.message
                                }
                            >
                                <select
                                    {...register(
                                        "internship_type"
                                    )}
                                    className={inputClass(
                                        !!errors.internship_type
                                    )}
                                >
                                    <option value="">
                                        Select type
                                    </option>
                                    <option value="paid">
                                        Paid
                                    </option>
                                    <option value="unpaid">
                                        Unpaid
                                    </option>
                                </select>
                            </Field>

                            <Field
                                label="Working Hours"
                                error={
                                    errors.working_hours
                                        ?.message
                                }
                            >
                                <input
                                    {...register(
                                        "working_hours"
                                    )}
                                    className={inputClass(
                                        !!errors.working_hours
                                    )}
                                    placeholder="10:00 AM - 5:00 PM"
                                />
                            </Field>

                            <Field
                                label="Duration"
                                required
                                error={
                                    errors.duration
                                        ?.message
                                }
                            >
                                <input
                                    type="number"
                                    {...register(
                                        "duration",
                                        {
                                            valueAsNumber:
                                                true,
                                        }
                                    )}
                                    className={inputClass(
                                        !!errors.duration
                                    )}
                                />
                            </Field>

                            <Field
                                label="Duration Unit"
                                required
                                error={
                                    errors.duration_unit
                                        ?.message
                                }
                            >
                                <select
                                    {...register(
                                        "duration_unit"
                                    )}
                                    className={inputClass(
                                        !!errors.duration_unit
                                    )}
                                >
                                    <option value="">
                                        Select unit
                                    </option>
                                    <option value="weeks">
                                        Weeks
                                    </option>
                                    <option value="months">
                                        Months
                                    </option>
                                </select>
                            </Field>

                            <Field
                                label="Vacancy Count"
                                required
                                error={
                                    errors.vacancy_count
                                        ?.message
                                }
                            >
                                <input
                                    type="number"
                                    min={1}
                                    {...register(
                                        "vacancy_count",
                                        {
                                            valueAsNumber:
                                                true,
                                        }
                                    )}
                                    className={inputClass(
                                        !!errors.vacancy_count
                                    )}
                                />
                            </Field>

                        </div>
                    </Section>

                    {/* REQUIREMENTS */}

                    <Section
                        icon={
                            <GraduationCap className="h-5 w-5" />
                        }
                        title="Requirements & Eligibility"
                        description="Define which students are eligible to apply."
                    >
                        <div className="space-y-5">

                            <Field
                                label="Required Education"
                                error={
                                    errors.required_education
                                        ?.message
                                }
                            >
                                <input
                                    {...register(
                                        "required_education"
                                    )}
                                    className={inputClass(
                                        !!errors.required_education
                                    )}
                                    placeholder="BCA, BIT, BSc CSIT or related degree"
                                />
                            </Field>

                            <Field
                                label="Required Skills"
                                error={
                                    errors.required_skills
                                        ?.message
                                }
                            >
                                <textarea
                                    {...register(
                                        "required_skills"
                                    )}
                                    rows={4}
                                    className={textareaClass(
                                        !!errors.required_skills
                                    )}
                                    placeholder="Go, React, TypeScript, Git..."
                                />
                            </Field>

                            <Field
                                label="Preferred Skills"
                                error={
                                    errors.preferred_skills
                                        ?.message
                                }
                            >
                                <textarea
                                    {...register(
                                        "preferred_skills"
                                    )}
                                    rows={4}
                                    className={textareaClass(
                                        !!errors.preferred_skills
                                    )}
                                    placeholder="Docker, PostgreSQL, AWS..."
                                />
                            </Field>

                            <div className="grid gap-5 md:grid-cols-2">

                                <Field
                                    label="Eligible Programs"
                                    error={
                                        errors.eligible_programs
                                            ?.message
                                    }
                                >
                                    <input
                                        {...register(
                                            "eligible_programs"
                                        )}
                                        className={inputClass(
                                            !!errors.eligible_programs
                                        )}
                                        placeholder="BCA, BIT, BSc CSIT"
                                    />
                                </Field>

                                <Field
                                    label="Eligible Semester"
                                    error={
                                        errors.eligible_semester
                                            ?.message
                                    }
                                >
                                    <input
                                        {...register(
                                            "eligible_semester"
                                        )}
                                        className={inputClass(
                                            !!errors.eligible_semester
                                        )}
                                        placeholder="5th semester and above"
                                    />
                                </Field>

                            </div>
                        </div>
                    </Section>

                    {/* STIPEND */}

                    <Section
                        icon={
                            <Wallet className="h-5 w-5" />
                        }
                        title="Stipend"
                        description="Configure the compensation offered to interns."
                    >
                        <div className="grid gap-5 md:grid-cols-3">

                            <Field
                                label="Amount"
                                error={
                                    errors.stipend_amount
                                        ?.message
                                }
                            >
                                <input
                                    type="number"
                                    min={0}
                                    {...register(
                                        "stipend_amount",
                                        {
                                            valueAsNumber:
                                                true,
                                        }
                                    )}
                                    className={inputClass(
                                        !!errors.stipend_amount
                                    )}
                                />
                            </Field>

                            <Field
                                label="Currency"
                                error={
                                    errors.stipend_currency
                                        ?.message
                                }
                            >
                                <select
                                    {...register(
                                        "stipend_currency"
                                    )}
                                    className={inputClass(
                                        !!errors.stipend_currency
                                    )}
                                >
                                    <option value="NPR">
                                        NPR
                                    </option>
                                    <option value="USD">
                                        USD
                                    </option>
                                </select>
                            </Field>

                            <Field
                                label="Payment Period"
                                error={
                                    errors.stipend_period
                                        ?.message
                                }
                            >
                                <select
                                    {...register(
                                        "stipend_period"
                                    )}
                                    className={inputClass(
                                        !!errors.stipend_period
                                    )}
                                >
                                    <option value="">
                                        Select period
                                    </option>
                                    <option value="monthly">
                                        Monthly
                                    </option>
                                    <option value="weekly">
                                        Weekly
                                    </option>
                                    <option value="fixed">
                                        Fixed
                                    </option>
                                </select>
                            </Field>

                        </div>
                    </Section>

                    {/* TIMELINE */}

                    <Section
                        icon={
                            <CalendarDays className="h-5 w-5" />
                        }
                        title="Timeline & Application"
                        description="Set the dates and application method."
                    >
                        <div className="grid gap-5 md:grid-cols-2">

                            <Field
                                label="Start Date"
                                error={
                                    errors.start_date
                                        ?.message
                                }
                            >
                                <input
                                    type="date"
                                    {...register(
                                        "start_date"
                                    )}
                                    className={inputClass(
                                        !!errors.start_date
                                    )}
                                />
                            </Field>

                            <Field
                                label="Application Deadline"
                                error={
                                    errors.application_deadline
                                        ?.message
                                }
                            >
                                <input
                                    type="date"
                                    {...register(
                                        "application_deadline"
                                    )}
                                    className={inputClass(
                                        !!errors.application_deadline
                                    )}
                                />
                            </Field>

                            <Field
                                label="Application Email"
                                error={
                                    errors.application_email
                                        ?.message
                                }
                            >
                                <input
                                    type="email"
                                    {...register(
                                        "application_email"
                                    )}
                                    className={inputClass(
                                        !!errors.application_email
                                    )}
                                    placeholder="careers@example.com"
                                />
                            </Field>

                            <Field
                                label="Application URL"
                                error={
                                    errors.application_url
                                        ?.message
                                }
                            >
                                <input
                                    type="url"
                                    {...register(
                                        "application_url"
                                    )}
                                    className={inputClass(
                                        !!errors.application_url
                                    )}
                                    placeholder="https://example.com/apply"
                                />
                            </Field>

                        </div>
                    </Section>

                    {/* RESPONSIBILITIES */}

                    <Section
                        icon={
                            <CheckCircle2 className="h-5 w-5" />
                        }
                        title="Responsibilities & Benefits"
                        description="Describe what the intern will do and what they receive."
                    >
                        <div className="space-y-5">

                            <Field
                                label="Responsibilities"
                                error={
                                    errors.responsibilities
                                        ?.message
                                }
                            >
                                <textarea
                                    {...register(
                                        "responsibilities"
                                    )}
                                    rows={7}
                                    className={textareaClass(
                                        !!errors.responsibilities
                                    )}
                                    placeholder="Develop features, participate in code reviews..."
                                />
                            </Field>

                            <Field
                                label="Benefits"
                                error={
                                    errors.benefits
                                        ?.message
                                }
                            >
                                <textarea
                                    {...register(
                                        "benefits"
                                    )}
                                    rows={5}
                                    className={textareaClass(
                                        !!errors.benefits
                                    )}
                                    placeholder="Mentorship, certificate, flexible hours..."
                                />
                            </Field>

                        </div>
                    </Section>

                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">

                        <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                                router.back()
                            }
                            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || !isDirty}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>
            </main>
        </div>
    )
}

/*
|--------------------------------------------------------------------------
| Reusable UI
|--------------------------------------------------------------------------
*/

interface SectionProps {
    icon: React.ReactNode
    title: string
    description: string
    children: React.ReactNode
}

const Section = ({
    icon,
    title,
    description,
    children,
}: SectionProps) => (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

            <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {icon}
                </div>

                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>

            </div>

        </div>

        <div className="p-6 sm:p-8">
            {children}
        </div>

    </section>
)

interface FieldProps {
    label: string
    required?: boolean
    error?: string
    children: React.ReactNode
}

const Field = ({
    label,
    required,
    error,
    children,
}: FieldProps) => (
    <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
            {label}

            {required && (
                <span className="ml-1 text-red-500">
                    *
                </span>
            )}
        </label>

        {children}

        {error && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
                {error}
            </p>
        )}
    </div>
)

const inputClass = (hasError = false) =>
    `h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:ring-2 ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
    }`

const textareaClass = (hasError = false) =>
    `w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:ring-2 ${hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
    }`

/*
|--------------------------------------------------------------------------
| Date helpers
|--------------------------------------------------------------------------
*/

/**
 * Backend:
 *     2026-09-01T00:00:00Z
 *
 * HTML date input:
 *     2026-09-01
 */
const toDateInputValue = (
    value?: string
) => {
    if (!value) return ""

    return value.slice(0, 10)
}

/**
 * HTML date input:
 *     2026-09-01
 *
 * Backend:
 *     2026-09-01T00:00:00Z
 */
const toRFC3339 = (
    value?: string
) => {
    if (!value) return undefined

    return `${value}T00:00:00Z`
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

const EditSkeleton = () => (
    <div className="min-h-screen bg-slate-50">

        <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
            </div>
        </div>

        <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

            {Array.from({ length: 5 }).map(
                (_, index) => (
                    <div
                        key={index}
                        className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white"
                    />
                )
            )}

        </main>
    </div>
)

export default InternshipEditForm