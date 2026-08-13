'use client'
import React, { useEffect, useMemo, useState } from "react";
import { Internship } from "@/src/types/internship";
import { internshipService } from "@/src/services/internship";
import { useRecruiterProfileStore } from "@/src/context/useRecruiterProfile";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    AlertCircle,
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Calendar,
    Eye,
    Sparkles,
    ArrowRight,
    AlertTriangle,
    GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type StatusFilter = "all" | "published" | "draft" | "closed";

const DEADLINE_SOON_DAYS = 3;

function daysUntil(dateStr: string) {
    const diffMs = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function CompanyInternshipsListPage() {
    const router = useRouter();
    const { myCompany } = useRecruiterProfileStore();

    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalInternships, setTotalInternships] = useState<number>(0);

    useEffect(() => {
        async function fetchJobs() {
            if (!myCompany?.id) return;
            try {
                setLoading(true);
                setError(null);

                const response = await internshipService.listMyInternships();

                const list = response.data;

                if (list) {
                    setInternships(list || []);
                    if (response.pagination) {
                        setTotalPages(response.pagination.total_pages || 1);
                        setTotalInternships(response.pagination.page_size || 0);
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.log(err);
                setError("Failed to fetch internships. Please try refreshing the page.");
            } finally {
                setLoading(false);
            }
        }

        if (myCompany?.id) {
            fetchJobs();
        }
    }, [myCompany?.id, currentPage, pageSize]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const counts = useMemo(() => {
        return internships.reduce(
            (acc, internship) => {
                const s = (internship.status || "published") as StatusFilter;
                acc[s] = (acc[s] || 0) + 1;
                return acc;
            },
            { published: 0, draft: 0, closed: 0 } as Record<string, number>
        );
    }, [internships]);

    const visibleInternships = useMemo(() => {
        if (statusFilter === "all") return internships;
        return internships.filter((i) => (i.status || "published") === statusFilter);
    }, [internships, statusFilter]);

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-50 pb-16 text-slate-900 ">
            {/* Sticky Top Header */}
            <header className="bg-linear-to-br from-blue-700 via-blue-700 to-blue-600  sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Internship Openings
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            Manage, review, and monitor your active and past internship listings.
                        </p>
                    </div>

                    <Button className="h-12 bg-white text-blue-700 hover:bg-blue-50 shadow-sm transition-all">
                        <Link href="/internships/create" className="flex items-center justify-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Post New Opening
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="p-0 overflow-hidden border-slate-200">
                                <div className="p-6 sm:flex sm:items-center sm:justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-20 rounded-md bg-blue-50" />
                                            <Skeleton className="h-6 w-16 rounded-md bg-slate-100" />
                                        </div>
                                        <Skeleton className="h-7 w-3/4 sm:w-1/2 bg-slate-200" />
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <Skeleton className="h-4 w-24 bg-slate-100" />
                                            <Skeleton className="h-4 w-32 bg-slate-100" />
                                            <Skeleton className="h-4 w-28 bg-slate-100" />
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0">
                                        <Skeleton className="h-10 w-full sm:w-28 rounded-md bg-slate-100" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800 font-semibold">Unable to Load Internships</AlertTitle>
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                )}

                {/* Empty State (no internships at all) */}
                {!loading && !error && internships.length === 0 && (
                    <Card className="max-w-lg mx-auto text-center border-dashed border-2 border-blue-100 bg-blue-50/50 my-12 shadow-none">
                        <CardContent className="pt-12 pb-12 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Internship Openings Yet</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Get started by creating your first internship listing to attract top student talent.
                                </p>
                            </div>
                            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                <Link href="/internships/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Internship
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Internships List */}
                {!loading && !error && internships.length > 0 && (
                    <div className="space-y-6">

                        {/* Stats + Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="font-medium text-slate-500">
                                    <strong className="text-blue-700">{totalInternships}</strong> total
                                </span>
                                <span className="h-4 w-px bg-slate-200" />
                                <span className="font-medium text-emerald-700">{counts.published} active</span>
                                <span className="font-medium text-slate-500">{counts.draft} draft</span>
                                <span className="font-medium text-slate-400">{counts.closed} closed</span>
                            </div>

                            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                                <SelectTrigger className="h-9 w-40 text-sm">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtered empty state */}
                        {visibleInternships.length === 0 ? (
                            <Card className="text-center border-dashed border-2 border-slate-200 bg-white shadow-none">
                                <CardContent className="py-10">
                                    <p className="text-sm text-slate-500">
                                        No postings match this filter. Try a different status.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {visibleInternships.map((internship) => {
                                    const stipendText = internship.stipend_amount
                                        ? `${internship.stipend_currency || 'NPR'} ${internship.stipend_amount.toLocaleString()}${internship.stipend_period ? ` / ${internship.stipend_period}` : ''}`
                                        : "Unpaid";

                                    const durationText = internship.duration
                                        ? `${internship.duration} ${internship.duration_unit || ''}`
                                        : "Duration flexible";

                                    const isDraft = internship.status === "draft";
                                    const isClosed = internship.status === "closed";
                                    const daysLeft = internship.application_deadline ? daysUntil(internship.application_deadline) : null;
                                    const isUrgent = !isClosed && !isDraft && daysLeft !== null && daysLeft >= 0 && daysLeft <= DEADLINE_SOON_DAYS;

                                    return (
                                        <Card
                                            key={internship.id}
                                            className={`group shadow transition-all cursor-pointer overflow-hidden bg-white ${isDraft
                                                ? "border-dashed border-slate-300 opacity-80 hover:opacity-100"
                                                : isUrgent
                                                    ? "border-amber-300 hover:border-amber-400 hover:shadow-md"
                                                    : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                                                }`}
                                        >
                                            <div className="p-0 sm:flex sm:items-stretch sm:justify-between">
                                                {/* Left side info */}
                                                <div className="p-5 sm:p-6 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        <Badge
                                                            variant="outline"
                                                            className={`border-none capitalize font-semibold tracking-wide ${isDraft
                                                                ? "bg-slate-100 text-slate-600"
                                                                : isClosed
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-blue-100 text-blue-700"
                                                                }`}
                                                        >
                                                            {internship.status || "Published"}
                                                        </Badge>

                                                        <Badge variant="outline" className="capitalize bg-slate-50 text-slate-600 border-slate-200">
                                                            {internship.internship_type}
                                                        </Badge>

                                                        {internship.work_mode === "remote" && (
                                                            <Badge variant="outline" className="gap-1 bg-indigo-50 text-indigo-700 border-none">
                                                                <Sparkles className="h-3 w-3" />
                                                                Remote
                                                            </Badge>
                                                        )}

                                                        {isUrgent && (
                                                            <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-700 border-none">
                                                                <AlertTriangle className="h-3 w-3" />
                                                                {daysLeft === 0 ? "Closes today" : `${daysLeft}d left`}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <CardTitle className={`text-lg sm:text-xl mb-4 line-clamp-1 transition-colors ${isDraft ? "text-slate-600" : "text-slate-900 group-hover:text-blue-600"}`}>
                                                        {internship.title}
                                                    </CardTitle>

                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                                                            <span className="truncate max-w-37.5">{internship.location}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
                                                            <span className="truncate">{stipendText}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                                                            <span className="truncate">{durationText}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side actionable area */}
                                                <div className={`transition-colors sm:w-48 p-4 sm:p-6 border-t sm:border-t-0 sm:border-l border-slate-100 flex sm:flex-col justify-between items-center sm:items-end gap-4 ${isUrgent ? "bg-amber-50/60 group-hover:bg-amber-50" : "bg-slate-50 group-hover:bg-blue-50/50"}`}>

                                                    {internship.application_deadline ? (
                                                        <div className="text-right flex items-center sm:items-end flex-row sm:flex-col gap-2 sm:gap-1">
                                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deadline</span>
                                                            <div className={`flex items-center gap-1.5 text-sm font-semibold ${isUrgent ? "text-amber-700" : "text-slate-700"}`}>
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(internship.application_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="hidden sm:block text-xs text-slate-400">Open Deadline</div>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        className="w-full sm:w-auto h-9 gap-2 bg-white sm:bg-transparent border border-slate-200 sm:border-none text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/internships/${internship.id}`);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sm:hidden">View Internship</span>
                                                        <ArrowRight className="hidden sm:block h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pt-6 pb-2 border-t border-slate-200">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={`text-slate-600 hover:text-blue-600 hover:bg-blue-50 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                            (pageNum) => (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={currentPage === pageNum}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(pageNum);
                                                        }}
                                                        className={currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                                className={`text-slate-600 hover:text-blue-600 hover:bg-blue-50 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
