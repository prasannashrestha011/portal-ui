"use client"

import { internshipService } from "@/src/services/internship"
import { INTERNSHIP_STATUS, Internship, InternshipStatus } from "@/src/types/internship"
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
        newStatus: InternshipStatus
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

    const isPrivate = internship.status === INTERNSHIP_STATUS.PRIVATE
    const isPublished = internship.status === INTERNSHIP_STATUS.PUBLISHED

    return (
        <div className="min-h-screen bg-background text-text-primary">

            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="bg-linear-to-br from-primary-active via-primary to-accent">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                    <button
                        onClick={() => router.back()}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 transition hover:text-primary-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to internships
                    </button>

                    <div className="max-w-4xl">

                        {/* Status badges */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">

                            <StatusBadge status={internship.status} />

                            <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium capitalize text-primary-foreground/80">
                                {internship.internship_type}
                            </span>

                            <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium capitalize text-primary-foreground/80">
                                {internship.work_mode}
                            </span>
                        </div>

                        <h1 className="workspace-page-title text-primary-foreground">
                            {internship.title}
                        </h1>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/80">

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
                        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                            <SectionTitle
                                icon={
                                    <BriefcaseBusiness className="h-5 w-5" />
                                }
                                title="About the Internship"
                            />

                            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-text-secondary">
                                {internship.description}
                            </p>
                        </section>

                        {/* Responsibilities */}
                        {internship.responsibilities && (
                            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    icon={
                                        <CheckCircle2 className="h-5 w-5" />
                                    }
                                    title="Responsibilities"
                                />

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-text-secondary">
                                    {internship.responsibilities}
                                </div>
                            </section>
                        )}

                        {/* Requirements */}
                        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
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
                        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                            <SectionTitle
                                icon={
                                    <GraduationCap className="h-5 w-5" />
                                }
                                title="Student Eligibility"
                            />

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">

                                <div className="rounded-lg bg-surface-hover p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Eligible Programs
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-text-primary">
                                        {internship.eligible_programs ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-surface-hover p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Eligible Semester
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-text-primary">
                                        {internship.eligible_semester ||
                                            "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Benefits */}
                        {internship.benefits && (
                            <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
                                <SectionTitle
                                    icon={
                                        <CheckCircle2 className="h-5 w-5" />
                                    }
                                    title="Benefits"
                                />

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-text-secondary">
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
                        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">

                            <div className="border-b border-border p-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                                    Internship Management
                                </p>

                                <p className="mt-1 text-sm text-text-muted">
                                    Manage this internship posting and
                                    its current status.
                                </p>

                                <button
                                    onClick={() =>
                                        router.push(
                                            `/recruiter/candidates?internship_id=${internship.id}`
                                        )
                                    }
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
                                >
                                    <Users className="h-4 w-4" />
                                    View Applications
                                </button>

                                {/* Edit */}
                                <button
                                    onClick={handleEdit}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary-subtle px-4 py-3 text-sm font-semibold text-primary-hover transition hover:bg-primary-subtle"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Internship
                                </button>

                                {/* Status actions */}
                                {isPrivate && (
                                    <button
                                        disabled={updatingStatus}
                                        onClick={() =>
                                            handleStatusChange(
                                                INTERNSHIP_STATUS.PUBLISHED
                                            )
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary-subtle px-4 py-3 text-sm font-semibold text-primary-hover transition hover:bg-primary-subtle disabled:cursor-not-allowed disabled:opacity-60"
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
                                            handleStatusChange(INTERNSHIP_STATUS.CLOSED)
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-warning/30 bg-warning-subtle px-4 py-3 text-sm font-semibold text-warning-active transition hover:bg-warning-subtle disabled:cursor-not-allowed disabled:opacity-60"
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
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-error/25 bg-surface px-4 py-3 text-sm font-semibold text-error transition hover:bg-error-subtle"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Internship
                                </button>
                            </div>

                            {/* Internship Details */}
                            <div className="divide-y divide-border">

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
                        <div className="mt-4 rounded-xl border border-border bg-surface p-5 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle">
                                    <Building2 className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-text-muted">
                                        Posted by
                                    </p>

                                    <p className="text-sm font-semibold text-text-primary">
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4 backdrop-blur-sm"
                    onClick={() => {
                        if (!deleting) {
                            setShowDeleteConfirm(false)
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Icon */}
                        <div className="flex items-start justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error-subtle">
                                <Trash2 className="h-5 w-5 text-error" />
                            </div>

                            <button
                                onClick={() =>
                                    setShowDeleteConfirm(false)
                                }
                                disabled={deleting}
                                className="rounded-md p-1.5 text-text-muted transition hover:bg-surface-muted hover:text-text-secondary disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <h2 className="workspace-section-title mt-4 text-text-primary">
                            Delete internship?
                        </h2>

                        <p className="workspace-body mt-2 text-text-muted">
                            This will permanently delete{" "}
                            <span className="font-semibold text-text-secondary">
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
                                className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-error px-4 py-2.5 text-sm font-semibold text-error-foreground transition hover:bg-error-hover disabled:cursor-not-allowed disabled:opacity-60"
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

    const styles: Record<InternshipStatus, string> = {
        [INTERNSHIP_STATUS.PRIVATE]: "bg-surface-muted text-text-secondary",
        [INTERNSHIP_STATUS.PUBLISHED]: "bg-primary-subtle text-primary-hover",
        [INTERNSHIP_STATUS.CLOSED]: "bg-error-subtle text-error",
        [INTERNSHIP_STATUS.EXPIRED]: "bg-warning-subtle text-warning-active",
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

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                {icon}
            </div>

            <h2 className="workspace-section-title text-text-primary">
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

            <h3 className="workspace-section-title mb-2 text-text-primary">
                {title}
            </h3>

            <p className="whitespace-pre-line text-sm leading-6 text-text-muted">
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

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-text-muted">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    {label}
                </p>

                <p
                    className={`mt-1 text-sm font-semibold ${urgent
                            ? "text-error"
                            : "text-text-secondary"
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
        <div className="min-h-screen bg-background">

            <div className="h-56 animate-pulse bg-surface-muted" />

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

                    <div className="space-y-6">

                        <div className="h-8 w-3/4 animate-pulse rounded bg-surface-muted" />

                        <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />

                        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-muted" />

                        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />

                        <div className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
                    </div>

                    <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
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
        <div className="min-h-screen bg-background">

            <div className="flex min-h-[70vh] items-center justify-center px-4">

                <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-subtle">
                        <BriefcaseBusiness className="h-7 w-7 text-error" />
                    </div>

                    <h1 className="workspace-section-title text-text-primary">
                        Internship not found
                    </h1>

                    <p className="workspace-body mt-2 text-text-muted">
                        {error}
                    </p>

                    <button
                        onClick={onBack}
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
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
