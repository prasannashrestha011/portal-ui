"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    AlertCircle,
    ArrowRight,
    FilterX,
    GraduationCap,
    MapPin,
    Search,
    UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { applicationService } from "@/src/services/application";
import { internshipService } from "@/src/services/internship";
import {
    APPLICATION_STATUS,
    type ApplicationStatus,
    type RecruiterApplicationSummary,
} from "@/src/types/application";
import { PaginationBar } from "@/src/components/shared/PaginationBar";

const PAGE_SIZE = 10;

const statusOptions: Array<{ value: ApplicationStatus; label: string }> = [
    { value: APPLICATION_STATUS.SUBMITTED, label: "Submitted" },
    { value: APPLICATION_STATUS.REVIEWING, label: "Reviewing" },
    { value: APPLICATION_STATUS.SHORTLISTED, label: "Shortlisted" },
    { value: APPLICATION_STATUS.ACCEPTED, label: "Accepted" },
    { value: APPLICATION_STATUS.REJECTED, label: "Rejected" },
    { value: APPLICATION_STATUS.WITHDRAWN, label: "Withdrawn" },
];

export function RecruiterApplicationsInbox() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = positiveInteger(searchParams.get("page"), 1);
    const query = searchParams.get("q")?.trim() ?? "";
    const internshipID = searchParams.get("internship_id") ?? "";
    const status = parseApplicationStatus(searchParams.get("status"));
    const [searchInput, setSearchInput] = useState(query);
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const updateQuery = useCallback(
        (updates: Record<string, string | null>) => {
            const next = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(updates)) {
                if (value) next.set(key, value);
                else next.delete(key);
            }
            const nextQuery = next.toString();
            router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
                scroll: false,
            });
        },
        [pathname, router, searchParams]
    );

    useEffect(() => {
        if (debouncedSearch.trim() === query) return;
        updateQuery({ q: debouncedSearch.trim() || null, page: null });
    }, [debouncedSearch, query, updateQuery]);

    const applicationsQuery = useQuery({
        queryKey: [
            "recruiter-applications",
            "list",
            { page, query, internshipID, status },
        ],
        queryFn: async ({ signal }) => {
            const response = await applicationService.listRecruiterApplications(
                {
                    page,
                    page_size: PAGE_SIZE,
                    q: query || undefined,
                    internship_id: internshipID || undefined,
                    status: status || undefined,
                },
                signal
            );
            if (!response.success) {
                throw new Error(response.message || "Unable to load applications.");
            }
            return response;
        },
        placeholderData: (previous) => previous,
        staleTime: 30_000,
    });

    const internshipsQuery = useQuery({
        queryKey: ["recruiter-internships", "application-filter"],
        queryFn: async () => {
            const response = await internshipService.listMyInternships({
                page: 1,
                page_size: 100,
            });
            if (!response.success) {
                throw new Error(response.message || "Unable to load internships.");
            }
            return response.data;
        },
        staleTime: 5 * 60_000,
    });

    const applications = useMemo(
        () => applicationsQuery.data?.data ?? [],
        [applicationsQuery.data?.data]
    );
    const totalItems = applicationsQuery.data?.pagination?.total_size ?? 0;
    const totalPages = applicationsQuery.data?.pagination?.total_pages ?? 1;
    const hasFilters = Boolean(query || internshipID || status);
    const selectedInternship = useMemo(
        () =>
            internshipsQuery.data?.find((internship) => internship.id === internshipID) ??
            applications.find((application) => application.internship?.id === internshipID)
                ?.internship,
        [applications, internshipID, internshipsQuery.data]
    );

    const clearFilters = () => {
        setSearchInput("");
        updateQuery({ q: null, internship_id: null, status: null, page: null });
    };

    return (
        <div className="min-h-screen bg-background pb-14 text-text-primary">
            <header className="bg-linear-to-br from-primary-active via-primary to-accent text-primary-foreground">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
                            <UsersRound className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/80">
                                Recruiter workspace
                            </p>
                            <h1 className="workspace-page-title mt-1">
                                Candidates
                            </h1>
                            <p className="workspace-body mt-2 max-w-2xl text-primary-foreground/80">
                                Review student applications across all of your internship openings.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                    <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_260px_210px_auto]">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                            <Input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search candidate name"
                                aria-label="Search candidate name"
                                className="h-10 pl-9"
                            />
                        </div>

                        <Select
                            value={internshipID || "all"}
                            onValueChange={(value) =>
                                updateQuery({
                                    internship_id: value === "all" ? null : value,
                                    page: null,
                                })
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All internships" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All internships</SelectItem>
                                {selectedInternship &&
                                    !internshipsQuery.data?.some(
                                        (internship) => internship.id === selectedInternship.id
                                    ) && (
                                        <SelectItem value={selectedInternship.id}>
                                            {selectedInternship.title}
                                        </SelectItem>
                                    )}
                                {internshipsQuery.data?.map((internship) => (
                                    <SelectItem key={internship.id} value={internship.id}>
                                        {internship.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={status || "all"}
                            onValueChange={(value) =>
                                updateQuery({
                                    status: value === "all" ? null : value,
                                    page: null,
                                })
                            }
                        >
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearFilters}
                            disabled={!hasFilters && !searchInput}
                            className="h-10 gap-2"
                        >
                            <FilterX className="size-4" />
                            Clear
                        </Button>
                    </div>
                </section>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            {applicationsQuery.isPending
                                ? "Loading applications…"
                                : `${totalItems} ${totalItems === 1 ? "application" : "applications"}`}
                        </p>
                        {selectedInternship && (
                            <p className="mt-0.5 text-xs text-text-muted">
                                Filtered to {selectedInternship.title}
                            </p>
                        )}
                    </div>
                    {applicationsQuery.isFetching && !applicationsQuery.isPending && (
                        <span className="text-xs font-medium text-primary">Refreshing…</span>
                    )}
                </div>

                {applicationsQuery.isPending && <ApplicationsTableSkeleton />}

                {applicationsQuery.error && !applicationsQuery.isPending && (
                    <Alert variant="destructive" className="mt-5 border-error/25 bg-error-subtle">
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
                        <EmptyApplications hasFilters={hasFilters} onClear={clearFilters} />
                    )}

                {!applicationsQuery.isPending &&
                    !applicationsQuery.error &&
                    applications.length > 0 && (
                        <>
                            <ApplicationsTable applications={applications} />
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

function ApplicationsTable({
    applications,
}: {
    applications: RecruiterApplicationSummary[];
}) {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <Table>
                <TableHeader className="bg-surface-hover">
                    <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Internship</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((application) => {
                        const candidate = application.student;
                        const internship = application.internship;
                        return (
                            <TableRow key={application.id} className="group">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <CandidateMark name={candidate?.full_name} />
                                        <div className="min-w-0">
                                            <p className="max-w-52 truncate font-semibold text-text-primary">
                                                {candidate?.full_name || "Unnamed candidate"}
                                            </p>
                                            <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
                                                <MapPin className="size-3" />
                                                {candidate?.location || "Location not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-52 truncate text-sm font-medium text-text-secondary">
                                        {candidate?.degree || candidate?.faculty_or_major || "Not provided"}
                                    </p>
                                    <p className="mt-0.5 max-w-52 truncate text-xs text-text-muted">
                                        {candidate?.college_name || "College not provided"}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-52 truncate text-sm font-medium text-text-primary">
                                        {internship?.title || "Internship unavailable"}
                                    </p>
                                    <p className="mt-0.5 text-xs capitalize text-text-muted">
                                        {internship?.work_mode || ""}
                                    </p>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-sm text-text-secondary">
                                    {formatDate(application.applied_at)}
                                </TableCell>
                                <TableCell>
                                    <ApplicationStatusBadge status={application.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link
                                        href={`/recruiter/candidates/${application.id}`}
                                        className={buttonVariants({
                                            variant: "ghost",
                                            size: "sm",
                                            className: "gap-1.5 text-primary-hover",
                                        })}
                                    >
                                        Review
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
    const styles: Record<ApplicationStatus, string> = {
        submitted: "border-primary/25 bg-primary-subtle text-primary-hover",
        reviewing: "border-info/25 bg-info-subtle text-info-hover",
        shortlisted: "border-warning/30 bg-warning-subtle text-warning-active",
        accepted: "border-success/25 bg-success-subtle text-success-hover",
        rejected: "border-error/25 bg-error-subtle text-error",
        withdrawn: "border-border bg-surface-muted text-text-secondary",
    };
    return (
        <Badge variant="outline" className={`capitalize ${styles[status]}`}>
            {status}
        </Badge>
    );
}

function EmptyApplications({
    hasFilters,
    onClear,
}: {
    hasFilters: boolean;
    onClear: () => void;
}) {
    return (
        <Card className="mt-5 border-dashed border-border-strong bg-surface shadow-none">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-primary-subtle text-primary">
                    {hasFilters ? (
                        <Search className="size-6" />
                    ) : (
                        <GraduationCap className="size-7" />
                    )}
                </div>
                <h2 className="workspace-section-title mt-4 text-text-primary">
                    {hasFilters ? "No matching candidates" : "No applications yet"}
                </h2>
                <p className="workspace-body mt-2 max-w-md text-text-muted">
                    {hasFilters
                        ? "Try a different name, internship, or application status."
                        : "New student applications will appear here after they apply to one of your internships."}
                </p>
                {hasFilters && (
                    <Button type="button" variant="outline" onClick={onClear} className="mt-5">
                        Clear filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function ApplicationsTableSkeleton() {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-5">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-8" />
                        <Skeleton className="h-8" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function RecruiterApplicationsInboxSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="h-48 animate-pulse bg-surface-muted" />
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
                <Skeleton className="h-18 rounded-2xl" />
                <ApplicationsTableSkeleton />
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
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-bold text-primary-hover ring-1 ring-primary/25">
            {initials}
        </div>
    );
}

function useDebouncedValue<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebounced(value), delay);
        return () => window.clearTimeout(timeout);
    }, [delay, value]);

    return debounced;
}

function parseApplicationStatus(value: string | null): ApplicationStatus | "" {
    return statusOptions.some((option) => option.value === value)
        ? (value as ApplicationStatus)
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
        : "Something went wrong while loading applications.";
}
