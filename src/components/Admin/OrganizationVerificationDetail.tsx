"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
    Loader2,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    FileText,
    Building2,
    Mail,
    Calendar,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { OrganizationVerification, OrganizationVerificationStatus, ReviewOrganizationVerificationRequest } from "@/src/types/organizationVerification";
import { adminService } from "@/src/services/admin";

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${map[status.toLowerCase()] ?? map.pending
                }`}
        >
            {status}
        </span>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail;
    label: string;
    value?: string | null;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm text-slate-900">{value}</p>
            </div>
        </div>
    );
}

export default function OrganizationVerificationDetail({ id }: { id: string }) {
    const router = useRouter();

    const [data, setData] = useState<OrganizationVerification | null>(null);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [reviewAction, setReviewAction] = useState<OrganizationVerificationStatus | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [reviewNotes, setReviewNotes] = useState("");

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        setLoading(true);
        setError(null);

        adminService
            .getOrganizationVerification(id)
            .then((res) => {
                if (ignore) return;
                setData(res);
            })
            .catch((e) => {
                if (ignore) return;
                setError(e instanceof Error ? e.message : "Failed to load verification");
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
            if (!id || !reviewAction) return;
            const payload: ReviewOrganizationVerificationRequest = {
                status: reviewAction,
                review_notes: reviewNotes || undefined,
                ...(reviewAction === "rejected" ? { rejection_reason: rejectionReason } : {}),
            };
            await adminService.reviewOrganizationVerification(id, payload);
        },
        onSuccess: () => {
            router.push("/admin/organization-verifications");
        },
        onError: (e) => {
            setError(e instanceof Error ? e.message : "Failed to submit review");
        },
    });

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="mx-auto max-w-2xl p-6">
                <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-8 text-sm text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    {error ?? "Verification not found"}
                </div>
            </div>
        );
    }

    const isPending = data.status.toLowerCase() === "pending";

    return (
        <div className="mx-auto max-w-3xl p-6">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <div className="rounded-lg border border-slate-200">
                <div className="flex items-start justify-between border-b border-slate-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-800">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">{data.recruiter_profile?.organization_name}</h1>
                        </div>
                    </div>
                    <StatusBadge status={data.status} />
                </div>

                <div className="grid grid-cols-1 gap-x-6 p-5 sm:grid-cols-2">
                    <InfoRow icon={Mail} label="Contact email" value={data.organization_email} />
                    <InfoRow
                        icon={Calendar}
                        label="Submitted"
                        value={data.submitted_at ? new Date(data.submitted_at).toLocaleDateString() : undefined}
                    />
                </div>

                {documentUrl && (
                    <div className="border-t border-slate-200 p-5">
                        <a
                            href={documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                            <FileText className="h-4 w-4" />
                            View submitted document
                        </a>
                    </div>
                )}

                {isPending && (
                    <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
                        <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => setReviewAction("rejected")}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                        <Button
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                            onClick={() => setReviewAction("approved")}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                        </Button>
                    </div>
                )}
            </div>

            {/* Review Dialog */}
            <Dialog open={!!reviewAction} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">
                            {reviewAction === "approved" ? "Verify organization" : "Reject verification"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <p className="text-sm text-slate-500">
                            {data.recruiter_profile?.organization_name}
                            {reviewAction === "approved"
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
                                reviewAction === "approved"
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }
                        >
                            {reviewMutation.isPending
                                ? "Saving..."
                                : reviewAction === "approved"
                                    ? "Confirm verify"
                                    : "Confirm reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}