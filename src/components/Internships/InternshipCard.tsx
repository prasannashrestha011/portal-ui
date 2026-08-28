import Link from "next/link";
import {
    ArrowUpRight,
    BadgeCheck,
    Banknote,
    CalendarDays,
    Clock3,
    MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Internship } from "@/src/types/internship";
import {
    formatDeadline,
    formatDuration,
    formatRelativeTime,
    formatStipend,
    splitCsv,
    workModeLabel,
} from "@/src/utils/internship";

const modeStyles: Record<Internship["work_mode"], string> = {
    remote: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    hybrid: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
    onsite: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
};

export function InternshipCard({ internship }: { internship: Internship }) {
    const organizationName = internship.issuer?.organization_name || "Verified employer";
    const duration = formatDuration(internship.duration, internship.duration_unit);
    const deadline = formatDeadline(internship.application_deadline);
    const allSkills = splitCsv(internship.required_skills);
    const skills = allSkills.slice(0, 3);
    const remainingSkills = Math.max(0, allSkills.length - skills.length);
    const detailsHref = `/internships/${internship.id}`;

    return (
        <Card className="group relative h-full gap-0 overflow-hidden rounded-2xl bg-white py-0 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(30,64,175,0.13)] hover:ring-blue-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-blue-700">
            <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-400 opacity-80 transition-opacity group-hover:opacity-100" />

            <CardContent className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-blue-800 text-sm font-bold text-white shadow-sm shadow-blue-900/20">
                            {getInitials(organizationName)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {organizationName}
                                </p>
                                <BadgeCheck className="size-4 shrink-0 fill-blue-600 text-white dark:text-slate-900" aria-label="Verified employer" />
                            </div>
                            <p className="mt-0.5 text-xs text-slate-400">Verified employer</p>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className={`h-6 shrink-0 px-2.5 capitalize ${modeStyles[internship.work_mode]}`}
                    >
                        {workModeLabel(internship.work_mode)}
                    </Badge>
                </div>

                <div className="mt-5">
                    <Link
                        href={detailsHref}
                        className="block text-lg font-bold leading-snug tracking-tight text-slate-950 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400"
                    >
                        <span className="line-clamp-2">{internship.title}</span>
                    </Link>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="size-4 shrink-0 text-slate-400" />
                        <span className="truncate">{internship.location || "Location flexible"}</span>
                    </div>
                </div>

                {internship.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {internship.description}
                    </p>
                )}

                {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Required skills">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                                {skill}
                            </span>
                        ))}
                        {remainingSkills > 0 && (
                            <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                                +{remainingSkills}
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Banknote className="size-3.5 text-emerald-500" />
                            Stipend
                        </div>
                        <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                            {formatStipend(internship)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <Clock3 className="size-3.5 text-blue-500" />
                            Duration
                        </div>
                        <p className="mt-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                            {duration || "Flexible"}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="min-w-0">
                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${deadline?.urgent ? "text-amber-600" : "text-slate-600 dark:text-slate-300"}`}>
                                <CalendarDays className="size-3.5 shrink-0" />
                                <span className="truncate">{deadline?.label || "Open deadline"}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">
                                Posted {formatRelativeTime(internship.created_at)}
                            </p>
                        </div>

                        <Link
                            href={detailsHref}
                            aria-label={`View ${internship.title}`}
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/15 transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/30"
                        >
                            View details
                            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function InternshipCardSkeleton() {
    return (
        <div className="h-full overflow-hidden rounded-2xl bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
            <div className="h-1 animate-pulse bg-slate-200 dark:bg-slate-800" />
            <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                            <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                        </div>
                    </div>
                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="mt-6 h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                <div className="mt-5 space-y-2">
                    <div className="h-3.5 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                    <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800/70" />
                </div>
                <div className="mt-5 flex gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
                    <div className="h-6 w-20 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
                    <div className="h-6 w-14 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
        </div>
    );
}

function getInitials(value: string) {
    return value
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join("") || "VE";
}
