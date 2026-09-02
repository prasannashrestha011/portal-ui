import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ClipboardCheck,
    LayoutDashboard,
    ShieldCheck,
    Users,
} from "lucide-react";
import { AdminPageHeader } from "@/src/components/Admin/AdminPageHeader";

const workspaceLinks = [
    {
        title: "Review organizations",
        description:
            "Inspect employer details, check submitted evidence, and approve or reject requests.",
        href: "/admin/organization-verifications?status=pending",
        action: "Open review queue",
        icon: Building2,
        tone: "bg-warning-subtle text-warning-hover",
    },
    {
        title: "Manage users",
        description:
            "Browse the complete user directory and quickly find students, recruiters, or admins.",
        href: "/admin/users",
        action: "View user directory",
        icon: Users,
        tone: "bg-accent-subtle text-accent-hover",
    },
];

const workflow = [
    {
        title: "Open the review queue",
        description: "Start with pending organization submissions.",
        icon: ClipboardCheck,
    },
    {
        title: "Validate the evidence",
        description: "Compare organization details with the submitted document or email.",
        icon: ShieldCheck,
    },
    {
        title: "Record the decision",
        description: "Approve valid requests or leave a clear reason when rejecting one.",
        icon: CheckCircle2,
    },
];

export default function AdminDashboardPage() {
    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <AdminPageHeader
                title="Overview"
                description="Review access requests and manage the people using Intern Hub from one focused workspace."
                icon={LayoutDashboard}
            />

            <section className="mt-8" aria-labelledby="admin-actions-title">
                <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                        <h2
                            id="admin-actions-title"
                            className="workspace-section-title text-text-primary"
                        >
                            Admin tools
                        </h2>
                        <p className="workspace-body mt-1 text-text-muted">
                            Choose an area to continue.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {workspaceLinks.map(({ title, description, href, action, icon: Icon, tone }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
                                    <Icon className="size-5" />
                                </span>
                                <ArrowRight className="size-5 text-text-disabled transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-text-primary transition-colors group-hover:text-primary">
                                {title}
                            </h3>
                            <p className="workspace-body mt-2 text-text-secondary">{description}</p>
                            <span className="workspace-action mt-5 inline-flex items-center text-primary">
                                {action}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section
                className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
                aria-labelledby="review-workflow-title"
            >
                <div className="border-b border-border px-5 py-4 sm:px-6">
                    <h2 id="review-workflow-title" className="workspace-section-title text-text-primary">
                        Verification workflow
                    </h2>
                    <p className="workspace-body mt-1 text-text-muted">
                        A consistent review process keeps employer access decisions clear and auditable.
                    </p>
                </div>
                <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                    {workflow.map(({ title, description, icon: Icon }, index) => (
                        <div key={title} className="p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-subtle text-primary-hover">
                                    <Icon className="size-4.5" />
                                </span>
                                <span className="workspace-meta font-bold tracking-wider text-text-muted uppercase">
                                    Step {index + 1}
                                </span>
                            </div>
                            <h3 className="mt-4 font-semibold text-text-primary">{title}</h3>
                            <p className="workspace-body mt-1 text-text-secondary">{description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
