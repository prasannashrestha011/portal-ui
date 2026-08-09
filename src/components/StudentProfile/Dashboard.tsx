"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import { DashboardHeader } from "./DashboardHeader";
import { useAuthStore } from "@/src/context/useAuth";
import { authService } from "@/src/services/auth";

// Crisp Lucide-style Icon Components
const Icons = {
    Eye: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    Search: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
    ),
    Briefcase: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4v-4.25m16.5 0a2.125 2.125 0 00-2.125-2.125H5.875A2.125 2.125 0 003.75 14.15m16.5 0v.75A2.125 2.125 0 0118.125 17H5.875A2.125 2.125 0 013.75 14.9v-.75m16.5 0a2.125 2.125 0 00-2.125-2.125H5.875A2.125 2.125 0 003.75 12" />
        </svg>
    ),
    Bookmark: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
    ),
    ExternalLink: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    ),
    ArrowUpRight: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
    ),
    Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
    )
};

export default function StudentDashboardPage() {
    const { profile, loading, fetchProfile, saveProfile } = useStudentProfileStore();

    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    const completionScore = calculateCompletionScore(profile);

    const handleToggleVisibility = async () => {
        if (!profile || isUpdatingVisibility) return;
        setIsUpdatingVisibility(true);
        try {
            await saveProfile({ ...profile, is_searchable: !profile.is_searchable });
        } finally {
            setIsUpdatingVisibility(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
            <DashboardHeader user={profile} onLogout={async () => { await authService.logout() }} />

            {/* Main Layout Container */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">

                {/* Profile Readiness Banner (LinkedIn Blue Theme) */}
                <div className="relative overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-blue-100 backdrop-blur-xs">
                                <Icons.Sparkles className="h-3.5 w-3.5 text-blue-200" />
                                Recruiter Visibility Mode
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">
                                Complete your profile to unlock direct recruiter messages
                            </h2>
                            <p className="text-xs text-blue-100/90 max-w-2xl leading-relaxed">
                                Students with a completed profile and linked GitHub/Portfolio receive up to 3x more search impressions from hiring teams.
                            </p>
                        </div>
                        <Link
                            href="/profile"
                            className="shrink-0 inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50 transition-colors"
                        >
                            Update Profile Details
                        </Link>
                    </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ShadcnMetricCard
                        title="Active Applications"
                        value="3"
                        subtitle="2 under active review"
                        icon={<Icons.Briefcase className="h-4 w-4 text-blue-600" />}
                    />
                    <ShadcnMetricCard
                        title="Recruiter Bookmarks"
                        value="2"
                        subtitle=""
                        icon={<Icons.Bookmark className="h-4 w-4 text-blue-600" />}
                    />
                </div>

                {/* 2-Column Section Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Main Workspace Column (2 Cols) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Active Applications Card */}
                        <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Active Applications</h3>
                                    <p className="text-xs text-slate-500">Track progress and interview schedules</p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                                    3 Submissions
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <ApplicationRow
                                    role="Frontend Developer Intern"
                                    company="TechCorp Solutions"
                                    location="Remote"
                                    date="Applied Aug 3, 2026"
                                    status="Interviewing"
                                    variant="warning"
                                />
                                <ApplicationRow
                                    role="Junior Software Engineer"
                                    company="Apex Labs"
                                    location="San Francisco, CA"
                                    date="Applied Aug 1, 2026"
                                    status="In Review"
                                    variant="info"
                                />
                                <ApplicationRow
                                    role="Web Developer"
                                    company="Vanguard Digital"
                                    location="Hybrid"
                                    date="Applied Jul 28, 2026"
                                    status="Submitted"
                                    variant="default"
                                />
                            </div>
                        </div>

                        {/* Recommended Jobs Card */}
                        <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Recommended Jobs</h3>
                                    <p className="text-xs text-slate-500">
                                        Matches your preference: <span className="font-semibold text-blue-700">{profile?.preferred_job_categories || "Software Development"}</span>
                                    </p>
                                </div>
                                <Link
                                    href="/jobs"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Explore all <Icons.ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y divide-slate-100">
                                <JobOpportunityRow
                                    role="Fullstack React Developer"
                                    company="CloudScale Systems"
                                    location={profile?.preferred_locations || "Remote"}
                                    salary={profile?.expected_salary || "$75k - $90k"}
                                    tags={["React", "TypeScript", "Node.js"]}
                                />
                                <JobOpportunityRow
                                    role="Junior Web Engineer"
                                    company="DesignCraft"
                                    location="Hybrid • New York"
                                    salary="$65k / year"
                                    tags={["Next.js", "Tailwind CSS"]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Column (1 Col) */}
                    <div className="space-y-6">

                        {/* Profile Health / LinkedIn Widget */}
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900">Profile Strength</h3>
                                <span className="text-xs font-bold text-blue-600">{completionScore}%</span>
                            </div>

                            {/* LinkedIn Blue Progress Bar */}
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                                    style={{ width: `${completionScore}%` }}
                                />
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                {completionScore < 100
                                    ? "Add missing links and bio to maximize matching with tech recruiters."
                                    : "Your profile is fully optimized for employer matching."}
                            </p>

                            {/* Employer Visibility Switch */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="space-y-0.5">
                                    <label htmlFor="searchable-toggle" className="text-xs font-semibold text-slate-900 cursor-pointer">
                                        Recruiter Talent Pool
                                    </label>
                                    <p className="text-[11px] text-slate-500">
                                        {profile?.is_searchable ? "Open to opportunities" : "Hidden from search"}
                                    </p>
                                </div>

                                <button
                                    id="searchable-toggle"
                                    type="button"
                                    role="switch"
                                    aria-checked={profile?.is_searchable ?? false}
                                    onClick={handleToggleVisibility}
                                    disabled={isUpdatingVisibility}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${profile?.is_searchable ? "bg-blue-600" : "bg-slate-300"
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-2xs transition duration-200 ease-in-out ${profile?.is_searchable ? "translate-x-4" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Links & Presence Card */}
                        <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5">
                            <h3 className="text-sm font-bold text-slate-900">Links & Online Presence</h3>
                            <div className="space-y-3 pt-1">
                                <PresenceLinkItem label="LinkedIn" url={profile?.linkedin_url} />
                                <PresenceLinkItem label="GitHub" url={profile?.github_url} />
                                <PresenceLinkItem label="Portfolio" url={profile?.portfolio_url} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Shadcn Metric Card with Blue Accents
function ShadcnMetricCard({
    title,
    value,
    subtitle,
    icon,
    badge,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        {icon}
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{title}</span>
                </div>
                {badge && (
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">{subtitle}</p>
            </div>
        </div>
    );
}

// Application Row
function ApplicationRow({
    role,
    company,
    location,
    date,
    status,
    variant,
}: {
    role: string;
    company: string;
    location: string;
    date: string;
    status: string;
    variant: "warning" | "info" | "default";
}) {
    const badgeStyles = {
        warning: "bg-amber-50 text-amber-800 border-amber-200",
        info: "bg-blue-50 text-blue-700 border-blue-200",
        default: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
        <div className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
            <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">{role}</h4>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{company}</span> • {location}
                </p>
                <p className="text-[11px] text-slate-400">{date}</p>
            </div>
            <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${badgeStyles[variant]}`}>
                {status}
            </span>
        </div>
    );
}

// Job Opportunity Row with Blue Interactive State
function JobOpportunityRow({
    role,
    company,
    location,
    salary,
    tags,
}: {
    role: string;
    company: string;
    location: string;
    salary: string;
    tags: string[];
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 gap-3 hover:bg-blue-50/30 transition-colors">
            <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">{role}</h4>
                <p className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{company}</span> • {location}
                </p>
                <div className="flex items-center gap-1.5 pt-0.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-800">{salary}</span>
                <button
                    type="button"
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-600 shadow-2xs hover:bg-blue-600 hover:text-white transition-all"
                >
                    Quick Apply
                </button>
            </div>
        </div>
    );
}

// Presence Link Item
function PresenceLinkItem({ label, url }: { label: string; url?: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">{label}</span>
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[150px]"
                >
                    {url.replace(/^https?:\/\/(www\.)?/, "")}
                    <Icons.ExternalLink className="h-3 w-3 text-blue-500" />
                </a>
            ) : (
                <Link href="/profile" className="text-slate-400 hover:text-blue-600 transition-colors">
                    + Add Link
                </Link>
            )}
        </div>
    );
}

// Completion Score Calculation
function calculateCompletionScore(profile: any): number {
    if (!profile) return 0;
    const fields = [
        "full_name",
        "phone",
        "location",
        "bio",
        "college_name",
        "degree",
        "faculty_or_major",
        "preferred_job_categories",
        "preferred_locations",
        "linkedin_url",
        "github_url",
    ];
    const filled = fields.filter((f) => Boolean(profile[f])).length;
    return Math.round((filled / fields.length) * 100);
}

// Dashboard Skeleton Loader
function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-7xl p-8 space-y-6 animate-pulse">
            <div className="h-10 bg-slate-200 rounded-lg w-48" />
            <div className="h-24 bg-blue-100/50 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 bg-slate-200 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl" />
                <div className="h-72 bg-slate-200 rounded-xl" />
            </div>
        </div>
    );
}