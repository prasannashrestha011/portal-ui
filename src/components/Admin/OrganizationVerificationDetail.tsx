"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    ExternalLink,
    FileText,
    Globe2,
    Loader2,
    Mail,
    MessageSquareText,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type {
    OrganizationVerification,
    OrganizationVerificationStatus,
    ReviewOrganizationVerificationRequest,
} from "@/src/types/organizationVerification";
import { adminService } from "@/src/services/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { VerificationStatusBadge } from "./VerificationStatusBadge";

function formatDate(value?: string | null) {
    if (!value) return undefined;

    return new Date(value).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value?: string | null;
}) {
    if (!value) return null;

    return (
        <div className="flex items-start gap-3 rounded-xl bg-background p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <Icon className="size-4" />
            </span>
            <div className="min-w-0">
                <p className="workspace-meta font-medium text-text-muted">{label}</p>
                <p className="workspace-body mt-0.5 break-words font-semibold text-text-primary">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function OrganizationVerificationDetail({ id }: { id: string }) {
    const router = useRouter();
    const [data, setData] = useState<OrganizationVerification | null>(null);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [reviewAction, setReviewAction] =
        useState<OrganizationVerificationStatus | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [reviewNotes, setReviewNotes] = useState("");

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        adminService
            .getOrganizationVerification(id)
            .then((response) => {
                if (ignore) return;
                setData(response.verification);
                setDocumentUrl(response.document_url ?? null);
            })
            .catch((error) => {
                if (ignore) return;
                setFetchError(
                    error instanceof Error ? error.message : "Failed to load verification"
                );
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [id]);

    const closeDialog = () => {
        setReviewAction(null);
        setRejectionReason("");
        setReviewNotes("");
    };

    const reviewMutation = useMutation({
        mutationFn: async () => {
            if (!reviewAction) return;

            const payload: ReviewOrganizationVerificationRequest = {
                status: reviewAction,
                review_notes: reviewNotes.trim() || undefined,
                ...(reviewAction === "rejected"
                    ? { rejection_reason: rejectionReason.trim() }
                    : {}),
            };
            await adminService.reviewOrganizationVerification(id, payload);
        },
        onSuccess: () => {
            router.push("/admin/organization-verifications");
        },
    });

    const openReview = (action: "approved" | "rejected") => {
        reviewMutation.reset();
        setReviewAction(action);
        setRejectionReason("");
        setReviewNotes("");
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-text-muted">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="workspace-body">Loading verification…</p>
            </div>
        );
    }

    if (fetchError || !data) {
        return (
            <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/admin/organization-verifications"
                    className="workspace-action inline-flex items-center gap-2 text-text-secondary hover:text-primary"
                >
                    <ArrowLeft className="size-4" />
                    Back to verifications
                </Link>
                <div className="mt-6 flex flex-col items-center rounded-2xl border border-error/20 bg-error-subtle px-6 py-12 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-surface text-error">
                        <AlertCircle className="size-5" />
                    </span>
                    <h1 className="mt-4 text-lg font-semibold text-text-primary">
                        Verification unavailable
                    </h1>
                    <p className="workspace-body mt-1 max-w-md text-text-secondary">
                        {fetchError ?? "This verification could not be found."}
                    </p>
                </div>
            </div>
        );
    }

    const isPending = data.status === "pending";
    const organizationName =
        data.recruiter_profile?.organization_name ?? "Unnamed organization";

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <Link
                href="/admin/organization-verifications"
                className="workspace-action mb-5 inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-primary"
            >
                <ArrowLeft className="size-4" />
                Back to verifications
            </Link>

            <AdminPageHeader
                title="Review submission"
                description={`Inspect the evidence submitted by ${organizationName} before recording a decision.`}
                icon={ShieldCheck}
                eyebrow="Organization verification"
                action={<VerificationStatusBadge status={data.status} />}
            />

            <div className="mt-8 space-y-5">
                <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                    <div className="flex items-start gap-4 border-b border-border p-5 sm:p-6">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-hover">
                            <Building2 className="size-6" />
                        </span>
                        <div className="min-w-0">
                            <p className="workspace-meta font-semibold tracking-wider text-text-muted uppercase">
                                Organization
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-text-primary">
                                {organizationName}
                            </h2>
                            {data.recruiter_profile?.user?.email && (
                                <p className="workspace-body mt-1 break-all text-text-secondary">
                                    {data.recruiter_profile.user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                        <InfoItem
                            icon={Mail}
                            label="Organization email"
                            value={data.organization_email}
                        />
                        <InfoItem icon={Globe2} label="Email domain" value={data.email_domain} />
                        <InfoItem
                            icon={ShieldCheck}
                            label="Verification method"
                            value={data.method?.replace("_", " ")}
                        />
                        <InfoItem
                            icon={FileText}
                            label="Document type"
                            value={data.document_type}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="Submitted"
                            value={formatDate(data.submitted_at)}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="Reviewed"
                            value={formatDate(data.reviewed_at)}
                        />
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent-hover">
                                <FileText className="size-5" />
                            </span>
                            <div>
                                <h2 className="workspace-section-title text-text-primary">
                                    Submitted evidence
                                </h2>
                                <p className="workspace-body mt-1 text-text-muted">
                                    {documentUrl
                                        ? "Open the uploaded file in a new tab to verify its contents."
                                        : "No uploaded document is attached to this submission."}
                                </p>
                            </div>
                        </div>
                        {documentUrl && (
                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                            >
                                Open document
                                <ExternalLink className="size-4" />
                            </a>
                        )}
                    </div>
                </section>

                {(data.review_notes || data.rejection_reason) && (
                    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-text-secondary">
                                <MessageSquareText className="size-5" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="workspace-section-title text-text-primary">
                                    Review record
                                </h2>
                                {data.rejection_reason && (
                                    <div className="mt-3 rounded-xl bg-error-subtle p-4">
                                        <p className="workspace-meta font-semibold text-error">
                                            Rejection reason
                                        </p>
                                        <p className="workspace-body mt-1 text-text-primary">
                                            {data.rejection_reason}
                                        </p>
                                    </div>
                                )}
                                {data.review_notes && (
                                    <div className="mt-3">
                                        <p className="workspace-meta font-semibold text-text-muted">
                                            Internal notes
                                        </p>
                                        <p className="workspace-body mt-1 text-text-secondary">
                                            {data.review_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {isPending && (
                    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div>
                            <h2 className="workspace-section-title text-text-primary">
                                Record your decision
                            </h2>
                            <p className="workspace-body mt-1 text-text-muted">
                                Approve valid evidence or provide a useful reason for rejection.
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <Button
                                variant="destructive"
                                size="lg"
                                onClick={() => openReview("rejected")}
                            >
                                <XCircle />
                                Reject
                            </Button>
                            <Button size="lg" onClick={() => openReview("approved")}>
                                <CheckCircle2 />
                                Verify organization
                            </Button>
                        </div>
                    </section>
                )}
            </div>

            <Dialog open={!!reviewAction} onOpenChange={(open) => !open && closeDialog()}>
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
                            {organizationName}
                            {reviewAction === "approved"
                                ? " will be marked as verified and gain full employer access."
                                : " will be rejected. Add a clear reason so the recruiter can correct the submission."}
                        </p>

                        {reviewAction === "rejected" && (
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="detail-rejection-reason"
                                    className="text-sm font-semibold text-text-primary"
                                >
                                    Rejection reason
                                </label>
                                <Textarea
                                    id="detail-rejection-reason"
                                    value={rejectionReason}
                                    onChange={(event) => setRejectionReason(event.target.value)}
                                    placeholder="For example: the document is unreadable or the domain does not match."
                                    className="border-border bg-background"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label
                                htmlFor="detail-review-notes"
                                className="text-sm font-semibold text-text-primary"
                            >
                                Internal notes <span className="font-normal text-text-muted">(optional)</span>
                            </label>
                            <Textarea
                                id="detail-review-notes"
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
