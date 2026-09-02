import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
    title: string;
    description: string;
    icon: LucideIcon;
    eyebrow?: string;
    action?: ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    icon: Icon,
    eyebrow = "Admin workspace",
    action,
}: AdminPageHeaderProps) {
    return (
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary-hover ring-1 ring-primary/10">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                    <p className="workspace-meta font-semibold tracking-[0.16em] text-primary uppercase">
                        {eyebrow}
                    </p>
                    <h1 className="workspace-page-title mt-1 text-text-primary">{title}</h1>
                    <p className="workspace-body mt-2 max-w-2xl text-text-secondary">
                        {description}
                    </p>
                </div>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}
