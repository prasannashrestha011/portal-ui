"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowRight,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Inbox,
    MapPin,
    MessageSquareText,
    RotateCcw,
    XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { applicationService } from "@/src/services/application";
import type {
    ApplicationStatus,
    StudentApplicationStatusFilter,
    StudentApplicationSummary,
} from "@/src/types/application";
import { PaginationBar } from "@/src/components/shared/PaginationBar";

const PAGE_SIZE = 8;

const filters: Array<{
    label: string;
    value: StudentApplicationStatusFilter | "";
}> = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
];

const statusDetails: Record<
    ApplicationStatus,
    { label: string; className: string }
> = {
    submitted: {
        label: "Pending",
        className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    reviewing: {
        label: "Under review",
        className: "border-violet-200 bg-violet-50 text-violet-700",
    },
    shortlisted: {
        label: "Shortlisted",
        className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    accepted: {
        label: "Accepted",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    rejected: {
        label: "Rejected",
        className: "border-rose-200 bg-rose-50 text-rose-700",
    },
    withdrawn: {
        label: "Withdrawn",
        className: "border-slate-200 bg-slate-100 text-slate-600",
    },
};

export function StudentApplicationsList() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const status = parseStatusFilter(searchParams.get("status"));
    const page = positiveInteger(searchParams.get("page"), 1);

    const updateQuery = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const applicationsQuery = useQuery({
        queryKey: ["student-applications", { page, status }],
        queryFn: async ({ signal }) => {
            const response = await applicationService.listStudentApplications(
                {
                    page,
                    page_size: PAGE_SIZE,
                    status: status || undefined,
                },
                signal
            );
            if (!response.success) {
                throw new Error(response.message || "Unable to load applications.");
            }
            return response;
        },
        staleTime: 30_000,
    });

    const applications = useMemo(
        () => applicationsQuery.data?.data ?? [],
        [applicationsQuery.data?.data]
    );
    const totalItems = applicationsQuery.data?.pagination?.total_size ?? 0;
    const totalPages = applicationsQuery.data?.pagination?.total_pages ?? 1;

    return (
        <div className="min-h-full bg-slate-50/80 pb-14 text-slate-950">
            <header className="bg-linear-to-br from-blue-800 via-blue-700 to-indigo-700 text-white">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                            <BriefcaseBusiness className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                                Student workspace
                            </p>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight">
                                My applications
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                                Follow every internship application and see recruiter decisions in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
                <section
                    aria-label="Application status filters"
                    className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                >
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                        {filters.map((filter) => {
                            const isActive = status === filter.value;
                            return (
                                <button
                                    key={filter.label}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() =>
                                        updateQuery({
                                            status: filter.value || null,
                                            page: null,
                                        })
                                    }
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                        {applicationsQuery.isPending
                            ? "Loading applications…"
                            : `${totalItems} ${totalItems === 1 ? "application" : "applications"}`}
                    </p>
                    {applicationsQuery.isFetching && !applicationsQuery.isPending && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                            <RotateCcw className="size-3 animate-spin" />
                            Refreshing
                        </span>
                    )}
                </div>

                {applicationsQuery.isPending && <StudentApplicationsSkeleton />}

                {applicationsQuery.error && !applicationsQuery.isPending && (
                    <Alert variant="destructive" className="mt-5 border-rose-200 bg-rose-50">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Unable to load applications</AlertTitle>
                        <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                            <span>{getErrorMessage(applicationsQuery.error)}</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => void applicationsQuery.refetch()}
                            >
                                Try again
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {!applicationsQuery.isPending &&
                    !applicationsQuery.error &&
                    applications.length === 0 && (
                        <EmptyApplications
                            status={status}
                            onShowAll={() => updateQuery({ status: null, page: null })}
                        />
                    )}

                {!applicationsQuery.isPending &&
                    !applicationsQuery.error &&
                    applications.length > 0 && (
                        <>
                            <div className="mt-4 space-y-3">
                                {applications.map((application) => (
                                    <ApplicationCard
                                        key={application.id}
                                        application={application}
                                    />
                                ))}
                            </div>
                            <PaginationBar
                                currentPage={page}
                                totalPages={Math.max(totalPages, 1)}
                                onPageChange={(nextPage) =>
                                    updateQuery({
                                        page: nextPage === 1 ? null : String(nextPage),
                                    })
                                }
                            />
                        </>
                    )}
            </main>
        </div>
    );
}

function ApplicationCard({ application }: { application: StudentApplicationSummary }) {
    const internship = application.internship;

    return (
        <Card className="gap-0 border border-slate-200 bg-white py-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-5 sm:p-6">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                                <Building2 className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                                    {internship?.title || "Internship unavailable"}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-600">
                                    {internship?.organization_name || "Organization not available"}
                                </p>
                            </div>
                        </div>
                        <ApplicationStatusBadge status={application.status} />
                    </div>

                    <div className="grid gap-3 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="size-4 shrink-0 text-slate-400" />
                            <span>
                                Applied <strong className="font-semibold text-slate-800">{formatDate(application.applied_at)}</strong>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 shrink-0 text-slate-400" />
                            <span className="truncate">
                                {internship?.location || "Location not specified"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 capitalize">
                            <BriefcaseBusiness className="size-4 shrink-0 text-slate-400" />
                            <span>
                                {[internship?.work_mode, internship?.internship_type]
                                    .filter(Boolean)
                                    .join(" · ") || "Details unavailable"}
                            </span>
                        </div>
                    </div>

                    {application.employer_note && (
                        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                            <MessageSquareText className="mt-0.5 size-4 shrink-0 text-blue-600" />
                            <div>
                                <p className="text-xs font-bold text-blue-900">Message from recruiter</p>
                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-blue-800">
                                    {application.employer_note}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 className="size-3.5" />
                        Last updated {formatDate(application.updated_at)}
                    </p>
                    {internship && (
                        <Link
                            href={`/internships/${internship.id}`}
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                                className: "gap-1.5 text-blue-700 hover:bg-blue-50 hover:text-blue-800",
                            })}
                        >
                            View internship
                            <ArrowRight className="size-3.5" />
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
    const details = statusDetails[status];
    const Icon =
        status === "accepted"
            ? CheckCircle2
            : status === "rejected"
              ? XCircle
              : Clock3;

    return (
        <Badge variant="outline" className={`h-7 gap-1.5 px-2.5 ${details.className}`}>
            <Icon className="size-3.5" />
            {details.label}
        </Badge>
    );
}

function EmptyApplications({
    status,
    onShowAll,
}: {
    status: StudentApplicationStatusFilter | "";
    onShowAll: () => void;
}) {
    const filtered = Boolean(status);
    const label = status ? status[0].toUpperCase() + status.slice(1) : "";

    return (
        <Card className="mt-5 border border-dashed border-slate-300 bg-white shadow-none">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Inbox className="size-7" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">
                    {filtered ? `No ${label.toLowerCase()} applications` : "No applications yet"}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    {filtered
                        ? `None of your applications are currently ${label.toLowerCase()}. You can switch back to see every application.`
                        : "Once you apply for an internship, its progress and the recruiter’s decision will appear here."}
                </p>
                {filtered ? (
                    <Button type="button" variant="outline" onClick={onShowAll} className="mt-5">
                        Show all applications
                    </Button>
                ) : (
                    <Link
                        href="/internships"
                        className={buttonVariants({ className: "mt-5 gap-1.5" })}
                    >
                        Browse internships
                        <ArrowRight className="size-4" />
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

export function StudentApplicationsSkeleton() {
    return (
        <div className="mt-4 space-y-3" aria-label="Loading applications">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-center gap-3">
                            <Skeleton className="size-11 rounded-xl" />
                            <div className="w-full max-w-sm space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                        <Skeleton className="h-7 w-24 rounded-full" />
                    </div>
                    <Skeleton className="mt-5 h-12 w-full rounded-xl" />
                </div>
            ))}
        </div>
    );
}

function parseStatusFilter(value: string | null): StudentApplicationStatusFilter | "" {
    return filters.some((filter) => filter.value === value)
        ? (value as StudentApplicationStatusFilter)
        : "";
}

function positiveInteger(value: string | null, fallback: number) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown";
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

function getErrorMessage(error: unknown) {
    return error instanceof Error && error.message
        ? error.message
        : "Something went wrong while loading your applications.";
}
