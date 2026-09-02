"use client";

import {
    AlertCircle,
    ArrowLeft,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileQuestion,
    FileText,
    GraduationCap,
    LoaderCircle,
    MapPin,
    Phone,
    RotateCcw,
    UserRound,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { applicationService } from "@/src/services/application";
import {
    APPLICATION_STATUS,
    type ApplicationStatus,
    type RecruiterApplication,
    type RecruiterApplicationDetail,
} from "@/src/types/application";
import { ApplicationStatusBadge } from "./RecruiterApplicationsInbox";

type Decision = Extract<ApplicationStatus, "accepted" | "rejected">;

const activeStatuses: ApplicationStatus[] = [
    APPLICATION_STATUS.SUBMITTED,
    APPLICATION_STATUS.REVIEWING,
    APPLICATION_STATUS.SHORTLISTED,
];

export default function RecruiterApplicationDetailView({ id }: { id: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const detailQueryKey = ["recruiter-applications", "detail", id] as const;
    const [decision, setDecision] = useState<Decision | null>(null);
    const [message, setMessage] = useState("");
    const [decisionError, setDecisionError] = useState<string | null>(null);

    const detailQuery = useQuery({
        queryKey: detailQueryKey,
        queryFn: async ({ signal }) => {
            const response = await applicationService.getRecruiterApplication(
                id,
                signal
            );
            if (!response.success || !response.data) {
                throw new Error(response.message || "Unable to load this application.");
            }
            return response.data;
        },
        retry: 1,
        staleTime: 45 * 60_000,
        refetchOnWindowFocus: true,
    });

    const decisionMutation = useMutation({
        mutationFn: async () => {
            if (!decision) throw new Error("Choose an application decision.");
            const response = await applicationService.updateRecruiterApplicationStatus(
                id,
                {
                    status: decision,
                    employer_note: message,
                }
            );
            if (!response.success || !response.data) {
                throw new Error(response.message || "Unable to update the application.");
            }
            return response.data;
        },
        onSuccess: (updatedApplication) => {
            queryClient.setQueryData<RecruiterApplicationDetail>(
                detailQueryKey,
                (current) =>
                    current
                        ? { ...current, application: updatedApplication }
                        : current
            );
            void queryClient.invalidateQueries({
                queryKey: ["recruiter-applications", "list"],
            });
            closeDecisionDialog();
        },
        onError: (error) => {
            setDecisionError(getErrorMessage(error));
        },
    });

    const openDecisionDialog = (nextDecision: Decision) => {
        setDecision(nextDecision);
        setMessage(detailQuery.data?.application.employer_note ?? "");
        setDecisionError(null);
    };

    const closeDecisionDialog = () => {
        if (decisionMutation.isPending) return;
        setDecision(null);
        setMessage("");
        setDecisionError(null);
    };

    if (detailQuery.isPending) return <ApplicationDetailSkeleton />;

    if (detailQuery.error || !detailQuery.data) {
        return (
            <ApplicationDetailError
                message={getErrorMessage(detailQuery.error)}
                isRetrying={detailQuery.isFetching}
                onBack={() => router.back()}
                onRetry={() => void detailQuery.refetch()}
            />
        );
    }

    const detail = detailQuery.data;
    const application = detail.application;
    const candidate = application.student;
    const internship = application.internship;
    const canDecide = activeStatuses.includes(application.status);

    return (
        <div className="min-h-screen bg-background pb-14 text-text-primary">
            <header className="bg-primary-active text-primary-foreground">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/75 transition hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/40"
                    >
                        <ArrowLeft className="size-4" />
                        Back to candidates
                    </button>

                    <div className="mt-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div className="flex min-w-0 items-center gap-4">
                            <CandidateMark name={candidate?.full_name} />
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <ApplicationStatusBadge status={application.status} />
                                    <Badge
                                        variant="outline"
                                        className="border-primary-foreground/20 bg-primary-foreground/10 capitalize text-primary-foreground"
                                    >
                                        {internship?.work_mode || "Internship"}
                                    </Badge>
                                </div>
                                <h1 className="workspace-page-title mt-3 truncate">
                                    {candidate?.full_name || "Unnamed candidate"}
                                </h1>
                                <p className="mt-2 flex items-center gap-2 text-sm text-text-disabled">
                                    <BriefcaseBusiness className="size-4 text-primary-foreground/70" />
                                    Applied for {internship?.title || "an internship"}
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-text-disabled md:text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                                Applied
                            </p>
                            <p className="mt-1 font-semibold text-primary-foreground">
                                {formatDateTime(application.applied_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-7xl items-start gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
                <div className="min-w-0 space-y-6">
                    <ProfileSection application={application} />
                    <DocumentSection detail={detail} onRefresh={() => void detailQuery.refetch()} />
                </div>

                <aside className="space-y-5 lg:sticky lg:top-6">
                    <DecisionCard
                        application={application}
                        canDecide={canDecide}
                        onAccept={() => openDecisionDialog(APPLICATION_STATUS.ACCEPTED)}
                        onReject={() => openDecisionDialog(APPLICATION_STATUS.REJECTED)}
                    />
                    <ApplicationTimeline application={application} />
                    <InternshipCard application={application} />
                </aside>
            </main>

            <DecisionDialog
                decision={decision}
                candidateName={candidate?.full_name || "this candidate"}
                message={message}
                error={decisionError}
                isPending={decisionMutation.isPending}
                onMessageChange={setMessage}
                onClose={closeDecisionDialog}
                onConfirm={() => decisionMutation.mutate()}
            />
        </div>
    );
}

function ProfileSection({ application }: { application: RecruiterApplication }) {
    const candidate = application.student;
    const links = [
        { label: "LinkedIn", value: candidate?.linkedin_url, icon: FaLinkedin },
        { label: "GitHub", value: candidate?.github_url, icon: FaGithub },
        { label: "Portfolio", value: candidate?.portfolio_url, icon: ExternalLink },
    ].map((link) => ({ ...link, href: normalizeExternalURL(link.value) }));

    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
            <SectionHeading
                icon={<UserRound className="size-5" />}
                eyebrow="Candidate profile"
                title="Background and contact"
            />

            {candidate?.bio && (
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-text-secondary">
                    {candidate.bio}
                </p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoPanel
                    icon={<GraduationCap className="size-5 text-primary" />}
                    label="Education"
                    value={
                        [candidate?.degree, candidate?.faculty_or_major]
                            .filter(Boolean)
                            .join(" · ") || "Not provided"
                    }
                />
                <InfoPanel
                    icon={<GraduationCap className="size-5 text-accent" />}
                    label="College"
                    value={candidate?.college_name || "Not provided"}
                />
                <InfoPanel
                    icon={<CalendarDays className="size-5 text-warning-hover" />}
                    label="Study progress"
                    value={
                        [
                            candidate?.current_semester,
                            candidate?.graduation_year
                                ? `Graduates ${candidate.graduation_year}`
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" · ") || "Not provided"
                    }
                />
                <InfoPanel
                    icon={<Clock3 className="size-5 text-success" />}
                    label="Availability"
                    value={candidate?.availability || "Not provided"}
                />
                <InfoPanel
                    icon={<MapPin className="size-5 text-error" />}
                    label="Location"
                    value={candidate?.location || "Not provided"}
                />
                <InfoPanel
                    icon={<Phone className="size-5 text-accent" />}
                    label="Phone"
                    value={candidate?.phone || "Not provided"}
                />
            </div>

            {links.some((link) => link.href) && (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                    {links.map(({ label, href, icon: Icon }) =>
                        href ? (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                <Icon className="size-4" />
                                {label}
                            </a>
                        ) : null
                    )}
                </div>
            )}
        </section>
    );
}

function DocumentSection({
    detail,
    onRefresh,
}: {
    detail: RecruiterApplicationDetail;
    onRefresh: () => void;
}) {
    const document = detail.document;
    const documentURL = detail.document_url;
    const canPreview = Boolean(
        documentURL &&
            document &&
            (document.mime_type === "application/pdf" ||
                document.mime_type.startsWith("image/"))
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-7">
                <SectionHeading
                    icon={<FileText className="size-5" />}
                    eyebrow="Application document"
                    title="Default resume"
                />
                {documentURL && document && (
                    <a
                        href={documentURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                        Open document
                        <ArrowUpRight className="size-4" />
                    </a>
                )}
            </div>

            {!document && (
                <div className="flex flex-col items-center px-6 py-14 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                        <FileQuestion className="size-6" />
                    </div>
                    <h3 className="workspace-section-title mt-4 text-text-primary">No default document</h3>
                    <p className="workspace-body mt-1 max-w-sm text-text-muted">
                        This candidate has not selected a default resume or supporting document.
                    </p>
                </div>
            )}

            {document && (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-hover px-5 py-3 text-xs text-text-secondary sm:px-7">
                        <span className="font-semibold text-text-primary">{document.file_name}</span>
                        <span>
                            {document.mime_type || "Unknown file type"} · {formatFileSize(document.size)}
                        </span>
                    </div>

                    {canPreview && documentURL ? (
                        <iframe
                            src={documentURL}
                            title={`Preview of ${document.file_name}`}
                            className="h-[68vh] min-h-125 w-full bg-surface-muted"
                        />
                    ) : documentURL ? (
                        <div className="flex flex-col items-center px-6 py-14 text-center">
                            <FileText className="size-10 text-primary" />
                            <h3 className="workspace-section-title mt-4 text-text-primary">
                                Preview unavailable for this file type
                            </h3>
                            <p className="workspace-body mt-2 max-w-md text-text-muted">
                                Open the signed document in a new tab to view or download it with an appropriate application.
                            </p>
                            <a
                                href={documentURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({
                                    variant: "default",
                                    size: "lg",
                                    className: "mt-5",
                                })}
                            >
                                Open document
                                <ArrowUpRight className="size-4" />
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center px-6 py-12 text-center">
                            <AlertCircle className="size-8 text-warning" />
                            <p className="mt-3 text-sm font-semibold text-text-primary">
                                The document link is unavailable.
                            </p>
                            <Button type="button" variant="outline" onClick={onRefresh} className="mt-4 gap-2">
                                <RotateCcw className="size-4" />
                                Refresh link
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

function DecisionCard({
    application,
    canDecide,
    onAccept,
    onReject,
}: {
    application: RecruiterApplication;
    canDecide: boolean;
    onAccept: () => void;
    onReject: () => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="h-1 bg-linear-to-r from-primary via-accent to-success" />
            <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    Application decision
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                    <h2 className="workspace-section-title text-text-primary">Current status</h2>
                    <ApplicationStatusBadge status={application.status} />
                </div>

                {canDecide ? (
                    <>
                        <p className="mt-3 text-sm leading-6 text-text-muted">
                            Accept or reject this application. Your optional message will be visible to the student.
                        </p>
                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onReject}
                                className="border-error/25 text-error hover:bg-error-subtle"
                            >
                                <XCircle className="size-4" />
                                Reject
                            </Button>
                            <Button
                                type="button"
                                onClick={onAccept}
                                className="bg-success text-success-foreground hover:bg-success-hover"
                            >
                                <CheckCircle2 className="size-4" />
                                Accept
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="mt-4 rounded-xl bg-surface-hover p-4 text-sm leading-6 text-text-secondary">
                        This application is final and no further recruiter decision is available.
                    </div>
                )}

                {application.employer_note && (
                    <div className="mt-5 border-t border-border pt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                            Message to student
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">
                            {application.employer_note}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function ApplicationTimeline({ application }: { application: RecruiterApplication }) {
    const events = [
        { label: "Application submitted", date: application.applied_at },
        { label: "Review started", date: application.reviewed_at },
        { label: "Shortlisted", date: application.shortlisted_at },
        { label: "Accepted", date: application.accepted_at },
        { label: "Rejected", date: application.rejected_at },
        { label: "Withdrawn", date: application.withdrawn_at },
    ].filter((event): event is { label: string; date: string } => Boolean(event.date));

    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="workspace-section-title text-text-primary">Application timeline</h2>
            <div className="mt-4 space-y-4">
                {events.map((event, index) => (
                    <div key={event.label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <span className="mt-1 size-2.5 rounded-full bg-primary ring-4 ring-primary-subtle" />
                            {index < events.length - 1 && <span className="mt-1 h-full w-px bg-surface-muted" />}
                        </div>
                        <div className="pb-1">
                            <p className="text-sm font-semibold text-text-primary">{event.label}</p>
                            <p className="mt-0.5 text-xs text-text-muted">{formatDateTime(event.date)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function InternshipCard({ application }: { application: RecruiterApplication }) {
    const internship = application.internship;
    return (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                Applied internship
            </p>
            <h2 className="workspace-section-title mt-2 text-text-primary">
                {internship?.title || "Internship unavailable"}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
                <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    {internship?.location || "Location not specified"}
                </p>
                <p className="flex items-center gap-2 capitalize">
                    <BriefcaseBusiness className="size-4 text-primary" />
                    {[internship?.work_mode, internship?.internship_type]
                        .filter(Boolean)
                        .join(" · ") || "Details unavailable"}
                </p>
            </div>
            {internship && (
                <Link
                    href={`/recruiter/internships/list/${internship.id}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-hover hover:text-primary-active"
                >
                    View internship
                    <ArrowUpRight className="size-4" />
                </Link>
            )}
        </section>
    );
}

function DecisionDialog({
    decision,
    candidateName,
    message,
    error,
    isPending,
    onMessageChange,
    onClose,
    onConfirm,
}: {
    decision: Decision | null;
    candidateName: string;
    message: string;
    error: string | null;
    isPending: boolean;
    onMessageChange: (value: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const accepting = decision === APPLICATION_STATUS.ACCEPTED;
    return (
        <Dialog open={Boolean(decision)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {accepting ? "Accept application" : "Reject application"}
                    </DialogTitle>
                    <DialogDescription>
                        Confirm that you want to {accepting ? "accept" : "reject"} {candidateName}’s application. This decision is final.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 py-2">
                    <label htmlFor="decision-message" className="text-sm font-semibold text-text-primary">
                        Message to student <span className="font-normal text-text-muted">(optional)</span>
                    </label>
                    <Textarea
                        id="decision-message"
                        value={message}
                        onChange={(event) => onMessageChange(event.target.value)}
                        placeholder={
                            accepting
                                ? "Share next steps or a welcome message…"
                                : "Share brief feedback or context…"
                        }
                        rows={5}
                        disabled={isPending}
                    />
                    <p className="text-xs leading-5 text-text-muted">
                        Leaving this empty clears any existing recruiter message.
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="border-error/25 bg-error-subtle">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Decision not saved</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className={
                            accepting
                                ? "bg-success text-success-foreground hover:bg-success-hover"
                                : "bg-error text-error-foreground hover:bg-error-hover"
                        }
                    >
                        {isPending && <LoaderCircle className="size-4 animate-spin" />}
                        {isPending
                            ? "Saving…"
                            : accepting
                              ? "Confirm acceptance"
                              : "Confirm rejection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function SectionHeading({
    icon,
    eyebrow,
    title,
}: {
    icon: ReactNode;
    eyebrow: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-primary">
                    {eyebrow}
                </p>
                <h2 className="workspace-section-title mt-0.5 text-text-primary">{title}</h2>
            </div>
        </div>
    );
}

function InfoPanel({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3 rounded-xl border border-border bg-surface-hover/80 p-4">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-text-secondary">{value}</p>
            </div>
        </div>
    );
}

function CandidateMark({ name }: { name?: string }) {
    const initials =
        name
            ?.split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "?";
    return (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground ring-4 ring-primary-foreground/10">
            {initials}
        </div>
    );
}

function ApplicationDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="h-64 animate-pulse bg-primary-active/70" />
            <div className="mx-auto grid max-w-7xl gap-7 px-4 py-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                    <Skeleton className="h-80 rounded-2xl" />
                    <Skeleton className="h-120 rounded-2xl" />
                </div>
                <div className="space-y-5">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-72 rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

function ApplicationDetailError({
    message,
    isRetrying,
    onBack,
    onRetry,
}: {
    message: string;
    isRetrying: boolean;
    onBack: () => void;
    onRetry: () => void;
}) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
            <Card className="w-full max-w-lg border-border bg-surface text-center shadow-sm">
                <CardContent className="px-6 py-12">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-error-subtle text-error">
                        <AlertCircle className="size-6" />
                    </div>
                    <h1 className="workspace-section-title mt-4 text-text-primary">Application unavailable</h1>
                    <p className="workspace-body mt-2 text-text-muted">{message}</p>
                    <div className="mt-6 flex justify-center gap-2">
                        <Button type="button" variant="outline" onClick={onBack}>
                            <ArrowLeft className="size-4" />
                            Back
                        </Button>
                        <Button type="button" onClick={onRetry} disabled={isRetrying}>
                            {isRetrying && <LoaderCircle className="size-4 animate-spin" />}
                            Try again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function normalizeExternalURL(value?: string) {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    try {
        const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
        return parsed.protocol === "http:" || parsed.protocol === "https:"
            ? parsed.toString()
            : null;
    } catch {
        return null;
    }
}

function formatDateTime(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function formatFileSize(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error && error.message
        ? error.message
        : "Something went wrong while loading this application.";
}
