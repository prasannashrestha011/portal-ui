'use client';
import React, { useMemo, useState } from "react";
import { adminService } from "@/src/services/admin";
import {
    OrganizationVerification,
    OrganizationVerificationStatus,
} from "@/src/types/organizationVerification";
import {
    Building2,
    Mail,
    FileText,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type StatusFilter = "all" | OrganizationVerificationStatus;

const STATUS_STYLES: Record<
    OrganizationVerificationStatus,
    { badge: string; label: string }
> = {
    pending: { badge: "bg-amber-50 text-amber-700", label: "Pending" },
    verified: { badge: "bg-green-50 text-green-700", label: "Verified" },
    rejected: { badge: "bg-red-50 text-red-700", label: "Rejected" },
};

export function OrganizationVerificationsListPage() {
    const queryClient = useQueryClient();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

    const [reviewTarget, setReviewTarget] = useState<OrganizationVerification | null>(null);
    const [reviewAction, setReviewAction] = useState<"verified" | "rejected" | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [reviewNotes, setReviewNotes] = useState("");

    const { data: verifications, isLoading, error } = useQuery({
        queryKey: ["org-verifications", currentPage, pageSize, statusFilter],
        queryFn: () =>
            adminService.listOrganizationVerifications(
                currentPage,
                pageSize,
                statusFilter === "all" ? undefined : statusFilter
            ),
    });

    const totalRecords = verifications?.pagination?.total_size ?? 0;
    const totalPages = verifications?.pagination?.total_pages ?? 1;

    const counts = useMemo(() => {
        if (!verifications) return { pending: 0, verified: 0, rejected: 0 };
        return verifications.data.reduce(
            (acc, v) => {
                acc[v.status] = (acc[v.status] || 0) + 1;
                return acc;
            },
            { pending: 0, verified: 0, rejected: 0 } as Record<OrganizationVerificationStatus, number>
        );
    }, [verifications]);

    const reviewMutation = useMutation({
        mutationFn: () => {
            if (!reviewTarget || !reviewAction) throw new Error("Missing review target/action");
            return adminService.reviewOrganizationVerification(reviewTarget.id, {
                status: reviewAction,
                rejection_reason: reviewAction === "rejected" ? rejectionReason : undefined,
                review_notes: reviewNotes || undefined,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["org-verifications"] });
            closeDialog();
        },
    });

    const openReview = (verification: OrganizationVerification, action: "verified" | "rejected") => {
        setReviewTarget(verification);
        setReviewAction(action);
        setRejectionReason("");
        setReviewNotes("");
    };

    const closeDialog = () => {
        setReviewTarget(null);
        setReviewAction(null);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">
            {/* Header */}
            <header className="bg-linear-to-br from-indigo-600 via-indigo-600 to-indigo-500 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Organization Verifications
                            </h1>
                            <p className="mt-1 text-sm text-indigo-100">
                                Review and action employer verification submissions.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Loading */}
                {isLoading && (
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="p-0 overflow-hidden border-slate-200">
                                <div className="p-6 flex items-center justify-between gap-6">
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-6 w-24 rounded-md bg-indigo-50" />
                                        <Skeleton className="h-6 w-1/2 bg-slate-200" />
                                        <Skeleton className="h-4 w-40 bg-slate-100" />
                                    </div>
                                    <Skeleton className="h-10 w-28 rounded-md bg-slate-100" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800 font-semibold">
                            Unable to Load Verifications
                        </AlertTitle>
                        <AlertDescription className="text-red-700">{error.message}</AlertDescription>
                    </Alert>
                )}

                {/* Empty */}
                {!isLoading && !error && verifications && verifications.data.length === 0 && (
                    <Card className="max-w-lg mx-auto text-center border-dashed border-2 border-indigo-100 bg-indigo-50/50 my-12 shadow-none">
                        <CardContent className="pt-12 pb-12 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Verifications Found</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    There are no organization verification requests matching this filter.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                {!isLoading && !error && verifications && verifications.data.length > 0 && (
                    <div className="space-y-6">
                        {/* Stats + Filter */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="font-medium text-slate-500">
                                    <strong className="text-indigo-700">{totalRecords}</strong> total
                                </span>
                                <span className="h-4 w-px bg-slate-200" />
                                <span className="font-medium text-amber-700">{counts.pending} pending</span>
                                <span className="font-medium text-green-700">{counts.verified} verified</span>
                                <span className="font-medium text-red-700">{counts.rejected} rejected</span>
                            </div>

                            <Select
                                value={statusFilter}
                                onValueChange={(v) => {
                                    setStatusFilter(v as StatusFilter);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="h-9 w-40 text-sm ring-indigo-500 focus:ring-indigo-500">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cards */}
                        <div className="space-y-4">
                            {verifications.data.map((verification) => {
                                const style = STATUS_STYLES[verification.status];
                                const orgName =
                                    verification.recruiter_profile?.organization_name ?? "Unnamed Organization";
                                const email = verification.organization_email ?? verification.recruiter_profile?.user?.email;

                                return (
                                    <Card
                                        key={verification.id}
                                        className="group shadow-sm transition-all overflow-hidden bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                                    >
                                        <div className="p-5 sm:p-6 sm:flex sm:items-center sm:justify-between gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline" className={`border-none font-semibold ${style.badge}`}>
                                                        {style.label}
                                                    </Badge>
                                                    {verification.method && (
                                                        <Badge variant="outline" className="capitalize bg-slate-50 text-slate-600 border-slate-200">
                                                            {verification.method.replace("_", " ")}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <CardTitle className="text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {orgName}
                                                </CardTitle>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                                    {email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-indigo-500 shrink-0" />
                                                            <span className="truncate">{email}</span>
                                                        </div>
                                                    )}
                                                    {verification.document_type && (
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                                                            <span className="truncate">{verification.document_type}</span>
                                                        </div>
                                                    )}
                                                    {verification.submitted_at && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                                                            <span>
                                                                Submitted{" "}
                                                                {new Date(verification.submitted_at).toLocaleDateString(undefined, {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {verification.status === "pending" && (
                                                <div className="mt-4 sm:mt-0 flex gap-2 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        className="h-9 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => openReview(verification, "rejected")}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                        onClick={() => openReview(verification, "verified")}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Verify
                                                    </Button>
                                                </div>
                                            )}

                                            {verification.status !== "pending" && (
                                                <div className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-slate-400 shrink-0">
                                                    <Clock className="h-4 w-4" />
                                                    {verification.reviewed_at &&
                                                        new Date(verification.reviewed_at).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
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
                                                className={`text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                                                    }`}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={currentPage === pageNum}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(pageNum);
                                                    }}
                                                    className={
                                                        currentPage === pageNum
                                                            ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                                                            : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                                                    }
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                                className={`text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                                                    }`}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Review Dialog */}
            <Dialog open={!!reviewTarget} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">
                            {reviewAction === "verified" ? "Verify Organization" : "Reject Verification"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <p className="text-sm text-slate-500">
                            {reviewTarget?.recruiter_profile?.organization_name ?? "This organization"}
                            {reviewAction === "verified"
                                ? " will be marked as verified and gain full employer access."
                                : " will be marked as rejected. Provide a reason so they can resubmit."}
                        </p>

                        {reviewAction === "rejected" && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Rejection reason</label>
                                <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="e.g. Document unreadable, domain mismatch..."
                                    className="border-slate-200 focus-visible:ring-indigo-500"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Internal notes (optional)</label>
                            <Textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Notes visible only to admins"
                                className="border-slate-200 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeDialog} disabled={reviewMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => reviewMutation.mutate()}
                            disabled={
                                reviewMutation.isPending ||
                                (reviewAction === "rejected" && !rejectionReason.trim())
                            }
                            className={
                                reviewAction === "verified"
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }
                        >
                            {reviewMutation.isPending
                                ? "Saving..."
                                : reviewAction === "verified"
                                    ? "Confirm Verify"
                                    : "Confirm Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}