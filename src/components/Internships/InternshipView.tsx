"use client"

import { internshipService } from "@/src/services/internship"
import { Internship } from "@/src/types/internship"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    GraduationCap,
    MapPin,
    Users,
    Wallet,
    Building2,
    Pencil,
    Trash2,
    X,
    Send,
    Lock,
} from "lucide-react"

interface InternshipViewProps {
    id: string
}

const InternshipView = ({ id }: InternshipViewProps) => {
    const router = useRouter()

    const [internship, setInternship] = useState<Internship | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [deleting, setDeleting] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        async function fetchInternship() {
            try {
                setLoading(true)
                setError(null)

                const data = await internshipService.getInternshipById(id)
                setInternship(data.data)
            } catch (error) {
                console.error(error)
                setError("Unable to load this internship.")
            } finally {
                setLoading(false)
            }
        }

        fetchInternship()
    }, [id])

    const handleEdit = () => {
        router.push(`/recruiter/internships/list/${id}/edit`)
    }

    const handleDelete = async () => {
        if (!internship) return

        try {
            setDeleting(true)

            await internshipService.deleteInternship(internship.id)

            router.push("/recruiter/internships/list")
        } catch (error) {
            console.error("Failed to delete internship:", error)
        } finally {
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleStatusChange = async (
        newStatus: "published" | "closed"
    ) => {
        if (!internship) return

        try {
            setUpdatingStatus(true)

            const response = await internshipService.updateInternship(
                internship.id,
                {
                    status: newStatus,
                }
            )

            setInternship(response.data)
        } catch (error) {
            console.error("Failed to update internship status:", error)
        } finally {
            setUpdatingStatus(false)
        }
    }

    const formatDate = (date?: string) => {
        if (!date) return "Not specified"

        return new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    if (loading) {
        return <LoadingState />
    }

    if (error || !internship) {
        return (
            <ErrorState
                error={
                    error ||
                    "This internship may have been removed or is no longer available."
                }
                onBack={() => router.back()}
            />
        )
    }

    const isDeadlinePassed =
        internship.application_deadline &&
        new Date(internship.application_deadline) < new Date()

    const stipend =
        internship.stipend_amount > 0
            ? `${internship.stipend_currency || "NPR"} ${internship.stipend_amount.toLocaleString()}`
            : "Unpaid"

    const isDraft = internship.status === "draft"
    const isPublished = internship.status === "published"
    const isClosed = internship.status === "closed"
    const isExpired = internship.status === "expired"

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="bg-linear-to-br from-blue-700 via-blue-700 to-blue-600">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                    <button
                        onClick={() => router.back()}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to internships
                    </button>

                    <div className="max-w-4xl">

                        {/* Status badges */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">

                            <StatusBadge status={internship.status} />

                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-blue-100">
                                {internship.internship_type}
                            </span>

                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-blue-100">
                                {internship.work_mode}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                            {internship.title}
                        </h1>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100">

                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {internship.location ||
                                        "Location not specified"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4" />
                                <span>
                                    {internship.duration}{" "}
                                    {internship.duration_unit}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>
                                    {internship.vacancy_count}{" "}
                                    {internship.vacancy_count === 1
                                        ? "position"
                                        : "positions"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}
                    <div className="min-w-0 space-y-6">

                        {/* Description */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <SectionTitle
                                icon={
                                    <BriefcaseBusiness className="h-5 w-5" />
                                }
                                title="About the Internship"
                            />

                            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                                {internship.description}
                            </p>
                        </section>

                        {/* Responsibilities */}
                        {internship.responsibilities && (
                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    icon={
                                        <CheckCircle2 className="h-5 w-5" />
                                    }
                                    title="Responsibilities"
                                />

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {internship.responsibilities}
                                </div>
                            </section>
                        )}

                        {/* Requirements */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <SectionTitle
                                icon={
                                    <GraduationCap className="h-5 w-5" />
                                }
                                title="Requirements"
                            />

                            <div className="mt-6 space-y-6">

                                {internship.required_education && (
                                    <InfoBlock
                                        title="Education"
                                        value={
                                            internship.required_education
                                        }
                                    />
                                )}

                                {internship.required_skills && (
                                    <InfoBlock
                                        title="Required Skills"
                                        value={
                                            internship.required_skills
                                        }
                                    />
                                )}

                                {internship.preferred_skills && (
                                    <InfoBlock
                                        title="Preferred Skills"
                                        value={
                                            internship.preferred_skills
                                        }
                                    />
                                )}
                            </div>
                        </section>

                        {/* Eligibility */}
                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <SectionTitle
                                icon={
                                    <GraduationCap className="h-5 w-5" />
                                }
                                title="Student Eligibility"
                            />

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Eligible Programs
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-800">
                                        {internship.eligible_programs ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Eligible Semester
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-slate-800">
                                        {internship.eligible_semester ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Benefits */}
                        {internship.benefits && (
                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    icon={
                                        <CheckCircle2 className="h-5 w-5" />
                                    }
                                    title="Benefits"
                                />

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {internship.benefits}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* =================================================
                        RIGHT SIDEBAR
                    ================================================= */}
                    <aside className="lg:sticky lg:top-6 lg:h-fit">

                        {/* Management Card */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 p-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Internship Management
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage this internship posting and
                                    its current status.
                                </p>

                                {/* Edit */}
                                <button
                                    onClick={handleEdit}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Internship
                                </button>

                                {/* Status actions */}
                                {isDraft && (
                                    <button
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusChange(
                                                "published"
                                            )
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Send className="h-4 w-4" />
                                        {updatingStatus
                                            ? "Publishing..."
                                            : "Publish Internship"}
                                    </button>
                                )}

                                {isPublished && !isDeadlinePassed && (
                                    <button
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusChange("closed")
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Lock className="h-4 w-4" />
                                        {updatingStatus
                                            ? "Closing..."
                                            : "Close Applications"}
                                    </button>
                                )}

                                {/* Delete */}
                                <button
                                    onClick={() =>
                                        setShowDeleteConfirm(true)
                                    }
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Internship
                                </button>
                            </div>

                            {/* Internship Details */}
                            <div className="divide-y divide-slate-100">

                                <DetailRow
                                    icon={
                                        <Wallet className="h-4 w-4" />
                                    }
                                    label="Stipend"
                                    value={
                                        internship.stipend_amount > 0
                                            ? `${stipend}${internship.stipend_period
                                                ? ` / ${internship.stipend_period}`
                                                : ""
                                            }`
                                            : "Unpaid"
                                    }
                                />

                                <DetailRow
                                    icon={
                                        <MapPin className="h-4 w-4" />
                                    }
                                    label="Location"
                                    value={
                                        internship.location ||
                                        "Not specified"
                                    }
                                />

                                <DetailRow
                                    icon={
                                        <BriefcaseBusiness className="h-4 w-4" />
                                    }
                                    label="Work Mode"
                                    value={internship.work_mode}
                                    capitalize
                                />

                                <DetailRow
                                    icon={
                                        <Clock3 className="h-4 w-4" />
                                    }
                                    label="Duration"
                                    value={`${internship.duration} ${internship.duration_unit}`}
                                />

                                <DetailRow
                                    icon={
                                        <Users className="h-4 w-4" />
                                    }
                                    label="Vacancies"
                                    value={`${internship.vacancy_count}`}
                                />

                                <DetailRow
                                    icon={
                                        <CalendarDays className="h-4 w-4" />
                                    }
                                    label="Start Date"
                                    value={formatDate(
                                        internship.start_date
                                    )}
                                />

                                <DetailRow
                                    icon={
                                        <CalendarDays className="h-4 w-4" />
                                    }
                                    label="Application Deadline"
                                    value={formatDate(
                                        internship.application_deadline
                                    )}
                                    urgent={!!isDeadlinePassed}
                                />

                                <DetailRow
                                    icon={
                                        <Clock3 className="h-4 w-4" />
                                    }
                                    label="Working Hours"
                                    value={
                                        internship.working_hours ||
                                        "Flexible"
                                    }
                                />
                            </div>
                        </div>

                        {/* Employer Card */}
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Posted by
                                    </p>

                                    <p className="text-sm font-semibold text-slate-800">
                                        Your Organization
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* =========================================================
                DELETE CONFIRMATION MODAL
            ========================================================= */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
                    onClick={() => {
                        if (!deleting) {
                            setShowDeleteConfirm(false)
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Icon */}
                        <div className="flex items-start justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>

                            <button
                                onClick={() =>
                                    setShowDeleteConfirm(false)
                                }
                                disabled={deleting}
                                className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-slate-900">
                            Delete internship?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This will permanently delete{" "}
                            <span className="font-semibold text-slate-700">
                                {internship.title}
                            </span>
                            . This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                            <button
                                onClick={() =>
                                    setShowDeleteConfirm(false)
                                }
                                disabled={deleting}
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Internship"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* =============================================================
   STATUS BADGE
============================================================= */

interface StatusBadgeProps {
    status: Internship["status"]
}

const StatusBadge = ({ status }: StatusBadgeProps) => {

    const styles = {
        draft: "bg-slate-100 text-slate-700",
        published: "bg-blue-100 text-blue-700",
        closed: "bg-red-50 text-red-700",
        expired: "bg-amber-50 text-amber-700",
    }

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]
                }`}
        >
            {status}
        </span>
    )
}

/* =============================================================
   SECTION TITLE
============================================================= */

interface SectionTitleProps {
    icon: React.ReactNode
    title: string
}

const SectionTitle = ({
    icon,
    title,
}: SectionTitleProps) => {
    return (
        <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </div>

            <h2 className="text-lg font-bold text-slate-900">
                {title}
            </h2>
        </div>
    )
}

/* =============================================================
   INFO BLOCK
============================================================= */

interface InfoBlockProps {
    title: string
    value: string
}

const InfoBlock = ({
    title,
    value,
}: InfoBlockProps) => {
    return (
        <div>

            <h3 className="mb-2 text-sm font-semibold text-slate-800">
                {title}
            </h3>

            <p className="whitespace-pre-line text-sm leading-6 text-slate-500">
                {value}
            </p>
        </div>
    )
}

/* =============================================================
   DETAIL ROW
============================================================= */

interface DetailRowProps {
    icon: React.ReactNode
    label: string
    value: string
    capitalize?: boolean
    urgent?: boolean
}

const DetailRow = ({
    icon,
    label,
    value,
    capitalize,
    urgent,
}: DetailRowProps) => {
    return (
        <div className="flex gap-3 p-4">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {label}
                </p>

                <p
                    className={`mt-1 text-sm font-semibold ${urgent
                            ? "text-red-600"
                            : "text-slate-700"
                        } ${capitalize
                            ? "capitalize"
                            : ""
                        }`}
                >
                    {value}
                </p>
            </div>
        </div>
    )
}

/* =============================================================
   LOADING STATE
============================================================= */

const LoadingState = () => {
    return (
        <div className="min-h-screen bg-slate-50">

            <div className="h-56 animate-pulse bg-slate-200" />

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

                    <div className="space-y-6">

                        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />

                        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />

                        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />

                        <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white" />
                    </div>

                    <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
                </div>
            </main>
        </div>
    )
}

/* =============================================================
   ERROR STATE
============================================================= */

interface ErrorStateProps {
    error: string
    onBack: () => void
}

const ErrorState = ({
    error,
    onBack,
}: ErrorStateProps) => {
    return (
        <div className="min-h-screen bg-slate-50">

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <BriefcaseBusiness className="h-7 w-7 text-red-600" />
                    </div>

                    <h1 className="text-xl font-bold text-slate-900">
                        Internship not found
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={onBack}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InternshipView