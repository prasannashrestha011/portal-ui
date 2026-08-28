"use client";

import type { ReactNode } from "react";
import axios from "axios";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    ArrowUpRight,
    BadgeCheck,
    Banknote,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    GraduationCap,
    LoaderCircle,
    Mail,
    MapPin,
    RefreshCw,
    Send,
    Sparkles,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { internshipService } from "@/src/services/internship";
import { INTERNSHIP_STATUS, type Internship } from "@/src/types/internship";
import {
    formatDeadline,
    formatDuration,
    formatRelativeTime,
    formatStipend,
    splitCsv,
    workModeLabel,
} from "@/src/utils/internship";

const modeStyles: Record<Internship["work_mode"], string> = {
    remote: "border-emerald-300/30 bg-emerald-400/15 text-emerald-100",
    hybrid: "border-violet-300/30 bg-violet-400/15 text-violet-100",
    onsite: "border-blue-300/30 bg-blue-400/15 text-blue-100",
};

export default function InternshipDetail({ id }: { id: string }) {
    const { data, error, isPending, isFetching, refetch } = useQuery({
        queryKey: ["internships", "detail", id],
        queryFn: async ({ signal }) => {
            const response = await internshipService.getInternshipById(id, signal);

            if (!response.success || !response.data) {
                throw new Error(response.message || "This internship could not be found.");
            }

            return response.data;
        },
        retry: 1,
        staleTime: 60_000,
    });

    if (isPending) return <DetailSkeleton />;

    if (!data) {
        return (
            <ErrorState
                message={
                    error instanceof Error && error.message
                        ? error.message
                        : "This internship may have expired or been removed."
                }
                isRetrying={isFetching}
                onRetry={() => void refetch()}
            />
        );
    }

    return <DetailContent internship={data} />;
}

function DetailContent({ internship }: { internship: Internship }) {
    const organizationName =
        internship.issuer?.organization_name || internship.issued_by || "Verified employer";
    const postedAt = formatRelativeTime(internship.created_at);
    const duration = formatDuration(internship.duration, internship.duration_unit);
    const deadline = formatDeadline(internship.application_deadline);
    const requiredSkills = splitCsv(internship.required_skills);
    const preferredSkills = splitCsv(internship.preferred_skills);
    const applicationUrl = normalizeExternalUrl(internship.application_url);
    const organizationWebsite = normalizeExternalUrl(internship.issuer?.organization_website);
    const applicationsClosed =
        !internship.is_active ||
        internship.status !== INTERNSHIP_STATUS.PUBLISHED ||
        Boolean(deadline?.closed);

    return (
        <div className="min-h-screen bg-[#f6f8fc] text-slate-950 dark:bg-slate-950 dark:text-white">
            <section className="overflow-hidden bg-[#071b33] text-white">
                <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pb-18 lg:px-8">
                    <Link
                        href="/internships"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-400/40"
                    >
                        <ArrowLeft className="size-4" />
                        Back to all internships
                    </Link>

                    <div className="mt-8 max-w-4xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={`h-7 px-3 capitalize ${modeStyles[internship.work_mode]}`}
                            >
                                {workModeLabel(internship.work_mode)}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="h-7 border-white/15 bg-white/10 px-3 capitalize text-slate-100"
                            >
                                {internship.internship_type} internship
                            </Badge>
                        </div>

                        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                            {internship.title}
                        </h1>

                        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <CompanyMark name={organizationName} size="large" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="truncate font-semibold text-white">{organizationName}</p>
                                        <BadgeCheck
                                            className="size-4 shrink-0 fill-blue-500 text-[#071b33]"
                                            aria-label="Verified employer"
                                        />
                                    </div>
                                    <p className="mt-0.5 text-sm text-slate-400">Verified employer</p>
                                </div>
                            </div>

                            <div className="hidden h-10 w-px bg-white/10 sm:block" />
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="size-4 text-blue-300" />
                                    {internship.location || "Location flexible"}
                                </span>
                                {postedAt && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock3 className="size-4 text-blue-300" />
                                        Posted {postedAt}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="relative -mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.10)] ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-800 lg:grid-cols-4">
                    <SummaryMetric
                        icon={<Banknote className="size-4 text-emerald-500" />}
                        label="Stipend"
                        value={formatStipend(internship)}
                    />
                    <SummaryMetric
                        icon={<Clock3 className="size-4 text-blue-500" />}
                        label="Duration"
                        value={duration || "Flexible"}
                    />
                    <SummaryMetric
                        icon={<Users className="size-4 text-violet-500" />}
                        label="Openings"
                        value={`${internship.vacancy_count || 1} ${
                            internship.vacancy_count === 1 ? "position" : "positions"
                        }`}
                    />
                    <SummaryMetric
                        icon={<CalendarDays className="size-4 text-amber-500" />}
                        label="Deadline"
                        value={deadline?.label || "Open deadline"}
                        valueClassName={deadline?.urgent ? "text-amber-600" : undefined}
                    />
                </div>

                <div className="mt-8 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="order-2 min-w-0 space-y-6 lg:order-1">
                        <DetailSection
                            icon={<BriefcaseBusiness className="size-5" />}
                            eyebrow="Role overview"
                            title="About the internship"
                        >
                            <BodyCopy>{internship.description}</BodyCopy>
                        </DetailSection>

                        {internship.responsibilities && (
                            <DetailSection
                                icon={<CheckCircle2 className="size-5" />}
                                eyebrow="What you’ll do"
                                title="Responsibilities"
                            >
                                <BodyCopy>{internship.responsibilities}</BodyCopy>
                            </DetailSection>
                        )}

                        <DetailSection
                            icon={<Sparkles className="size-5" />}
                            eyebrow="Your toolkit"
                            title="Skills and requirements"
                        >
                            <div className="space-y-6">
                                {requiredSkills.length > 0 && (
                                    <SkillGroup label="Required skills" skills={requiredSkills} tone="required" />
                                )}
                                {preferredSkills.length > 0 && (
                                    <SkillGroup label="Preferred skills" skills={preferredSkills} tone="preferred" />
                                )}

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoPanel
                                        icon={<GraduationCap className="size-5 text-blue-600" />}
                                        label="Education"
                                        value={internship.required_education || "No specific education requirement"}
                                    />
                                    <InfoPanel
                                        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
                                        label="Eligible programs"
                                        value={internship.eligible_programs || "Open to all study programs"}
                                    />
                                    <InfoPanel
                                        icon={<GraduationCap className="size-5 text-violet-600" />}
                                        label="Eligible semester"
                                        value={internship.eligible_semester || "No semester restriction"}
                                    />
                                    <InfoPanel
                                        icon={<Clock3 className="size-5 text-amber-600" />}
                                        label="Working hours"
                                        value={internship.working_hours || "Flexible schedule"}
                                    />
                                </div>
                            </div>
                        </DetailSection>

                        {internship.benefits && (
                            <DetailSection
                                icon={<Sparkles className="size-5" />}
                                eyebrow="What you’ll gain"
                                title="Benefits"
                            >
                                <BodyCopy>{internship.benefits}</BodyCopy>
                            </DetailSection>
                        )}
                    </div>

                    <aside className="order-1 space-y-5 lg:order-2 lg:sticky lg:top-6">
                        <ApplicationCard
                            internship={internship}
                            applicationUrl={applicationUrl}
                            applicationsClosed={applicationsClosed}
                            deadlineUrgent={Boolean(deadline?.urgent)}
                        />

                        <section className="rounded-2xl bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/90 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
                            <div className="flex items-center gap-3">
                                <CompanyMark name={organizationName} />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h2 className="truncate font-bold text-slate-900 dark:text-white">
                                            {organizationName}
                                        </h2>
                                        <BadgeCheck className="size-4 shrink-0 fill-blue-600 text-white dark:text-slate-900" />
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-400">Verified employer</p>
                                </div>
                            </div>

                            {internship.issuer?.organization_about && (
                                <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {internship.issuer.organization_about}
                                </p>
                            )}
                            {organizationWebsite && (
                                <a
                                    href={organizationWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Visit company website
                                    <ArrowUpRight className="size-4" />
                                </a>
                            )}
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
}

function ApplicationCard({
    internship,
    applicationUrl,
    applicationsClosed,
    deadlineUrgent,
}: {
    internship: Internship;
    applicationUrl: string | null;
    applicationsClosed: boolean;
    deadlineUrgent: boolean;
}) {
    const applyMutation = useMutation({
        mutationFn: async () => {
            const response = await internshipService.applyForInternship(internship.id);

            if (!response.success) {
                throw new Error(response.message || "Unable to submit your application.");
            }

            return response;
        },
    });
    const hasAdditionalInformation = Boolean(
        applicationUrl || internship.application_email
    );

    return (
        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_35px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/90 dark:bg-slate-900 dark:ring-slate-800">
            <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-400" />
            <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                    Ready to apply?
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Take the next step
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Review the role details, then submit your application through the student portal.
                </p>

                <div
                    className={`mt-5 flex items-start gap-3 rounded-xl border p-3.5 ${
                        applicationsClosed
                            ? "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                            : deadlineUrgent
                              ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                              : "border-blue-100 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                    }`}
                >
                    <CalendarDays className="mt-0.5 size-4 shrink-0" />
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide">
                            {applicationsClosed ? "Applications closed" : "Application deadline"}
                        </p>
                        <p className="mt-1 text-sm font-bold">
                            {internship.application_deadline
                                ? formatDate(internship.application_deadline)
                                : "Open until filled"}
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    {!applicationsClosed && !applyMutation.isSuccess && (
                        <Button
                            size="lg"
                            className="h-11 w-full bg-blue-600 px-5 font-semibold text-white shadow-sm shadow-blue-900/20 hover:bg-blue-700"
                            onClick={() => applyMutation.mutate()}
                            disabled={applyMutation.isPending}
                        >
                            {applyMutation.isPending ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                                <Send className="size-4" />
                            )}
                            {applyMutation.isPending ? "Submitting application" : "Apply"}
                        </Button>
                    )}

                    {applyMutation.isSuccess && (
                        <div
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900"
                            role="status"
                        >
                            <CheckCircle2 className="size-4" />
                            Application submitted
                        </div>
                    )}

                    {applicationsClosed && (
                        <div
                            aria-disabled="true"
                            className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-100 px-5 text-sm font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                        >
                            Applications closed
                        </div>
                    )}

                    {applyMutation.isError && (
                        <p
                            className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            role="alert"
                        >
                            {getApplyErrorMessage(applyMutation.error)}
                        </p>
                    )}
                </div>

                {hasAdditionalInformation && (
                    <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                            Additional application information
                        </p>
                        <div className="mt-3 space-y-3">
                            {applicationUrl && (
                                <ApplicationInfoRow
                                    icon={<ExternalLink className="size-4" />}
                                    label="Application URL"
                                >
                                    <a
                                        href={applicationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-all font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {internship.application_url}
                                    </a>
                                </ApplicationInfoRow>
                            )}
                            {internship.application_email && (
                                <ApplicationInfoRow
                                    icon={<Mail className="size-4" />}
                                    label="Application email"
                                >
                                    <a
                                        href={`mailto:${internship.application_email}`}
                                        className="break-all font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        {internship.application_email}
                                    </a>
                                </ApplicationInfoRow>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                    <SidebarFact label="Start date" value={formatDate(internship.start_date)} />
                    <SidebarFact
                        label="Internship type"
                        value={`${capitalize(internship.internship_type)} internship`}
                    />
                    <SidebarFact label="Work mode" value={workModeLabel(internship.work_mode)} />
                </div>
            </div>
        </section>
    );
}

function ApplicationInfoRow({
    icon,
    label,
    children,
}: {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60">
            <div className="mt-0.5 text-slate-400">{icon}</div>
            <div className="min-w-0 text-xs leading-5">
                <p className="font-medium text-slate-400">{label}</p>
                <div className="mt-0.5">{children}</div>
            </div>
        </div>
    );
}

function SummaryMetric({
    icon,
    label,
    value,
    valueClassName,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="min-w-0 bg-white p-4 dark:bg-slate-900 sm:p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                {icon}
                {label}
            </div>
            <p
                className={`mt-2 truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base ${
                    valueClassName || ""
                }`}
                title={value}
            >
                {value}
            </p>
        </div>
    );
}

function DetailSection({
    icon,
    eyebrow,
    title,
    children,
}: {
    icon: ReactNode;
    eyebrow: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/90 dark:bg-slate-900 dark:ring-slate-800 sm:p-7">
            <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    {icon}
                </div>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                        {eyebrow}
                    </p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {title}
                    </h2>
                </div>
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function BodyCopy({ children }: { children: ReactNode }) {
    return (
        <p className="whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {children}
        </p>
    );
}

function SkillGroup({
    label,
    skills,
    tone,
}: {
    label: string;
    skills: string[];
    tone: "required" | "preferred";
}) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className={
                            tone === "required"
                                ? "rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900"
                                : "rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                        }
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

function InfoPanel({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
            </div>
            <p className="mt-2.5 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                {value}
            </p>
        </div>
    );
}

function SidebarFact({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="text-right font-semibold text-slate-700 dark:text-slate-200">{value}</span>
        </div>
    );
}

function CompanyMark({ name, size = "default" }: { name: string; size?: "default" | "large" }) {
    return (
        <div
            className={`grid shrink-0 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-lg shadow-black/15 ${
                size === "large" ? "size-12" : "size-11"
            }`}
        >
            {getInitials(name)}
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div
            className="min-h-screen bg-[#f6f8fc] dark:bg-slate-950"
            aria-label="Loading internship details"
            role="status"
        >
            <section className="bg-[#071b33]">
                <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
                    <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
                    <div className="mt-10 h-7 w-40 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-5 h-11 max-w-2xl animate-pulse rounded-lg bg-white/10" />
                    <div className="mt-6 h-12 w-80 max-w-full animate-pulse rounded-xl bg-white/10" />
                </div>
            </section>
            <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="relative -mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white p-5 dark:bg-slate-900">
                            <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                            <div className="mt-3 h-5 w-28 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                        </div>
                    ))}
                </div>
                <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="order-2 space-y-6 lg:order-1">
                        {[260, 220, 340].map((height) => (
                            <div
                                key={height}
                                className="animate-pulse rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                                style={{ height }}
                            />
                        ))}
                    </div>
                    <div className="order-1 h-96 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:order-2" />
                </div>
            </main>
        </div>
    );
}

function ErrorState({
    message,
    isRetrying,
    onRetry,
}: {
    message: string;
    isRetrying: boolean;
    onRetry: () => void;
}) {
    return (
        <div className="min-h-screen bg-[#f6f8fc] px-4 py-16 dark:bg-slate-950 sm:py-24">
            <div className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-white text-center shadow-[0_14px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-400" />
                <div className="p-7 sm:p-9">
                    <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                        <AlertCircle className="size-6" />
                    </div>
                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        Internship unavailable
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
                    <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                        <Link
                            href="/internships"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                                className:
                                    "h-10 border-slate-200 px-4 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200",
                            })}
                        >
                            <ArrowLeft className="size-4" />
                            Browse internships
                        </Link>
                        <Button
                            size="lg"
                            className="h-10 bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700"
                            onClick={onRetry}
                            disabled={isRetrying}
                        >
                            <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
                            {isRetrying ? "Trying again" : "Try again"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "Not specified";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not specified";

    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function normalizeExternalUrl(value?: string) {
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function getApplyErrorMessage(error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        if (error.response?.status === 401) {
            return "Sign in with a student account to apply for this internship.";
        }
        if (error.response?.status === 403) {
            return "Only student accounts can submit internship applications.";
        }
        if (error.response?.status === 409) {
            return "You have already applied for this internship.";
        }

        return error.response?.data?.message || "Unable to submit your application.";
    }

    if (error instanceof Error && error.message) return error.message;
    return "Unable to submit your application.";
}

function getInitials(value: string) {
    return (
        value
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join("") || "VE"
    );
}

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
