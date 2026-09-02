"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    Mail,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { adminService } from "@/src/services/admin";
import type {
    OrganizationVerification,
    OrganizationVerificationStatus,
} from "@/src/types/organizationVerification";
import { PaginationBar } from "@/src/components/shared/PaginationBar";
import { AdminPageHeader } from "./AdminPageHeader";
import { VerificationStatusBadge } from "./VerificationStatusBadge";

const PAGE_SIZE = 10;
const VALID_STATUSES: OrganizationVerificationStatus[] = [
    "pending",
    "approved",
    "rejected",
];

function isVerificationStatus(value?: string): value is OrganizationVerificationStatus {
    return !!value && VALID_STATUSES.includes(value as OrganizationVerificationStatus);
}

function ListSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
                >
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-5 w-24 rounded-full bg-surface-muted" />
                            <Skeleton className="h-6 w-1/2 bg-surface-muted" />
                            <Skeleton className="h-4 w-64 max-w-full bg-surface-muted" />
                        </div>
                        <Skeleton className="h-9 w-28 rounded-lg bg-surface-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function OrganizationVerificationsListPage({ status }: { status?: string }) {
    const queryClient = useQueryClient();
    const activeStatus = isVerificationStatus(status) ? status : undefined;
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewTarget, setReviewTarget] = useState<OrganizationVerification | null>(null);
    const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [reviewNotes, setReviewNotes] = useState("");

    const {
        data: verifications,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["org-verifications", currentPage, PAGE_SIZE, activeStatus],
        queryFn: () =>
            adminService.listOrganizationVerifications(
                currentPage,
                PAGE_SIZE,
                activeStatus
            ),
    });

    const totalRecords = verifications?.pagination?.total_size ?? 0;
    const totalPages = verifications?.pagination?.total_pages ?? 1;

    const closeDialog = () => {
        setReviewTarget(null);
        setReviewAction(null);
        setRejectionReason("");
        setReviewNotes("");
    };

    const reviewMutation = useMutation({
        mutationFn: () => {
            if (!reviewTarget || !reviewAction) {
                throw new Error("Choose a verification and review action first.");
            }

            return adminService.reviewOrganizationVerification(reviewTarget.id, {
                status: reviewAction,
                rejection_reason: reviewAction === "rejected" ? rejectionReason : undefined,
                review_notes: reviewNotes.trim() || undefined,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["org-verifications"] });
            closeDialog();
        },
    });

    const openReview = (
        verification: OrganizationVerification,
        action: "approved" | "rejected"
    ) => {
        reviewMutation.reset();
        setReviewTarget(verification);
        setReviewAction(action);
        setRejectionReason("");
        setReviewNotes("");
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const filterLabel = activeStatus
        ? activeStatus === "approved"
            ? "Verified"
            : `${activeStatus[0].toUpperCase()}${activeStatus.slice(1)}`
        : "All requests";

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <AdminPageHeader
                title="Organization verifications"
                description="Review employer submissions, validate their evidence, and control access to recruiting tools."
                icon={ShieldCheck}
                action={
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-sm">
                        <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                        {filterLabel}
                    </div>
                }
            />

            <main className="mt-8">
                {isLoading && <ListSkeleton />}

                {error && !isLoading && (
                    <div className="flex flex-col items-center rounded-2xl border border-error/20 bg-error-subtle px-5 py-12 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-surface text-error">
                            <AlertCircle className="size-5" />
                        </span>
                        <h2 className="mt-4 text-lg font-semibold text-text-primary">
                            Unable to load verifications
                        </h2>
                        <p className="workspace-body mt-1 max-w-md text-text-secondary">
                            {error.message}
                        </p>
                    </div>
                )}

                {!isLoading && !error && verifications?.data.length === 0 && (
                    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                            <Building2 className="size-7" />
                        </span>
                        <h2 className="mt-5 text-lg font-semibold text-text-primary">
                            No verifications found
                        </h2>
                        <p className="workspace-body mt-2 max-w-sm text-text-muted">
                            There are no organization requests matching the current filter.
                        </p>
                        {activeStatus && (
                            <Link
                                href="/admin/organization-verifications"
                                className="workspace-action mt-5 text-primary hover:text-primary-hover"
                            >
                                View all requests
                            </Link>
                        )}
                    </div>
                )}

                {!isLoading && !error && verifications && verifications.data.length > 0 && (
                    <div>
                        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="workspace-body text-text-secondary">
                                <strong className="font-semibold text-text-primary">{totalRecords}</strong>{" "}
                                {totalRecords === 1 ? "request" : "requests"}
                            </p>
                            {activeStatus && (
                                <Link
                                    href="/admin/organization-verifications"
                                    className="workspace-action text-primary hover:text-primary-hover"
                                >
                                    Clear filter
                                </Link>
                            )}
                        </div>

                        <div className="space-y-4">
                            {verifications.data.map((verification) => {
                                const organizationName =
                                    verification.recruiter_profile?.organization_name ??
                                    "Unnamed organization";
                                const email =
                                    verification.organization_email ??
                                    verification.recruiter_profile?.user?.email;

                                return (
                                    <article
                                        key={verification.id}
                                        className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-6"
                                    >
                                        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <VerificationStatusBadge status={verification.status} />
                                                    {verification.method && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-border bg-background font-medium text-text-secondary capitalize"
                                                        >
                                                            {verification.method.replace("_", " ")}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h2 className="mt-3 text-lg font-semibold text-text-primary transition-colors group-hover:text-primary">
                                                    {organizationName}
                                                </h2>

                                                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
                                                    {email && (
                                                        <span className="flex min-w-0 items-center gap-2">
                                                            <Mail className="size-4 shrink-0 text-primary" />
                                                            <span className="truncate">{email}</span>
                                                        </span>
                                                    )}
                                                    {verification.document_type && (
                                                        <span className="flex items-center gap-2">
                                                            <FileText className="size-4 shrink-0 text-primary" />
                                                            {verification.document_type}
                                                        </span>
                                                    )}
                                                    {verification.submitted_at && (
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="size-4 shrink-0 text-primary" />
                                                            Submitted{" "}
                                                            {new Date(
                                                                verification.submitted_at
                                                            ).toLocaleDateString(undefined, {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-wrap items-center gap-2">
                                                {verification.status !== "pending" &&
                                                    verification.reviewed_at && (
                                                        <span className="mr-1 flex items-center gap-1.5 text-xs text-text-muted">
                                                            <Clock className="size-3.5" />
                                                            {new Date(
                                                                verification.reviewed_at
                                                            ).toLocaleDateString(undefined, {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    )}
                                                {verification.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="destructive"
                                                            size="lg"
                                                            onClick={() =>
                                                                openReview(verification, "rejected")
                                                            }
                                                        >
                                                            <XCircle />
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="lg"
                                                            onClick={() =>
                                                                openReview(verification, "approved")
                                                            }
                                                        >
                                                            <CheckCircle2 />
                                                            Verify
                                                        </Button>
                                                    </>
                                                )}
                                                <Link
                                                    href={`/admin/organization-verifications/${verification.id}`}
                                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover"
                                                >
                                                    Details
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>

            <Dialog open={!!reviewTarget} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="border-border bg-surface sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-text-primary">
                            {reviewAction === "approved"
                                ? "Verify organization"
                                : "Reject verification"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <p className="workspace-body text-text-secondary">
                            {reviewTarget?.recruiter_profile?.organization_name ??
                                "This organization"}
                            {reviewAction === "approved"
                                ? " will be marked as verified and gain full employer access."
                                : " will be rejected. Add a clear reason so the recruiter can correct the submission."}
                        </p>

                        {reviewAction === "rejected" && (
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="list-rejection-reason"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Rejection reason
                                </label>
                                <Textarea
                                    id="list-rejection-reason"
                                    value={rejectionReason}
                                    onChange={(event) => setRejectionReason(event.target.value)}
                                    placeholder="For example: the document is unreadable or the domain does not match."
                                    className="border-border bg-background"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label
                                htmlFor="list-review-notes"
                                className="text-sm font-semibold text-text-primary"
                            >
                                Internal notes <span className="font-normal text-text-muted">(optional)</span>
                            </label>
                            <Textarea
                                id="list-review-notes"
                                value={reviewNotes}
                                onChange={(event) => setReviewNotes(event.target.value)}
                                placeholder="Notes visible only to administrators"
                                className="border-border bg-background"
                            />
                        </div>

                        {reviewMutation.error && (
                            <p className="rounded-lg bg-error-subtle px-3 py-2 text-sm text-error">
                                {reviewMutation.error.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={closeDialog}
                            disabled={reviewMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={reviewAction === "rejected" ? "destructive" : "default"}
                            onClick={() => reviewMutation.mutate()}
                            disabled={
                                reviewMutation.isPending ||
                                (reviewAction === "rejected" && !rejectionReason.trim())
                            }
                        >
                            {reviewMutation.isPending && <Loader2 className="animate-spin" />}
                            {reviewMutation.isPending
                                ? "Saving"
                                : reviewAction === "approved"
                                  ? "Confirm verification"
                                  : "Confirm rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
