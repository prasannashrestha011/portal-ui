import type { OrganizationVerificationStatus } from "@/src/types/organizationVerification";

const STATUS_STYLES: Record<OrganizationVerificationStatus, string> = {
    pending: "border-warning/20 bg-warning-subtle text-warning-hover",
    approved: "border-success/20 bg-success-subtle text-success-hover",
    rejected: "border-error/20 bg-error-subtle text-error",
};

const STATUS_LABELS: Record<OrganizationVerificationStatus, string> = {
    pending: "Pending",
    approved: "Verified",
    rejected: "Rejected",
};

export function VerificationStatusBadge({
    status,
}: {
    status: OrganizationVerificationStatus;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
        >
            <span className="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden="true" />
            {STATUS_LABELS[status]}
        </span>
    );
}
