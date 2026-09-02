"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Activity,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    Search,
    Sparkles,
    UserRound,
    XCircle,
} from "lucide-react";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa6";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import { studentService } from "@/src/services/studentProfile";
import type { StudentApplicationStats } from "@/src/types/studentProfile";
import { calculateCompletionScore } from "@/src/utils/calcStudentProfileCompletion";
import { authService } from "@/src/services/auth";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./DashboardSkeleton";
import MetricCard from "./MetricCard";
import PresenceLinkItem from "./PresenceLinkRow";

const EMPTY_STATS: StudentApplicationStats = {
    total_applications: 0,
    active_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    pending_applications: 0,
    under_review_applications: 0,
    shortlisted_applications: 0,
    withdrawn_applications: 0,
};

export default function StudentDashboardPage() {
    const { profile, loading, fetchProfile, saveProfile } = useStudentProfileStore();
    const [stats, setStats] = useState<StudentApplicationStats>(EMPTY_STATS);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState<string | null>(null);
    const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);

    useEffect(() => {
        let ignore = false;

        void fetchProfile();
        void studentService
            .getApplicationStats()
            .then((response) => {
                if (!ignore) setStats(response.data);
            })
            .catch(() => {
                if (!ignore) setStatsError("Application statistics could not be loaded.");
            })
            .finally(() => {
                if (!ignore) setStatsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [fetchProfile]);

    const handleRetryStats = async () => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const response = await studentService.getApplicationStats();
            setStats(response.data);
        } catch {
            setStatsError("Application statistics could not be loaded.");
        } finally {
            setStatsLoading(false);
        }
    };

    const handleToggleVisibility = async () => {
        if (!profile || isUpdatingVisibility) return;

        setIsUpdatingVisibility(true);
        try {
            await saveProfile({ ...profile, is_searchable: !profile.is_searchable });
        } finally {
            setIsUpdatingVisibility(false);
        }
    };

    if (loading || statsLoading) {
        return <DashboardSkeleton />;
    }

    const completionScore = calculateCompletionScore(profile);
    const activeRate = stats.total_applications
        ? Math.round((stats.active_applications / stats.total_applications) * 100)
        : 0;
    const approvalRate = stats.total_applications
        ? Math.round((stats.approved_applications / stats.total_applications) * 100)
        : 0;
    const statusBreakdown = [
        {
            label: "Pending",
            description: "Submitted and waiting for review",
            value: stats.pending_applications,
            bar: "bg-amber-500",
            dot: "bg-amber-500",
        },
        {
            label: "Under review",
            description: "Currently being reviewed",
            value: stats.under_review_applications,
            bar: "bg-blue-500",
            dot: "bg-blue-500",
        },
        {
            label: "Shortlisted",
            description: "Moved to the next stage",
            value: stats.shortlisted_applications,
            bar: "bg-indigo-500",
            dot: "bg-indigo-500",
        },
        {
            label: "Approved",
            description: "Accepted by the employer",
            value: stats.approved_applications,
            bar: "bg-emerald-500",
            dot: "bg-emerald-500",
        },
        {
            label: "Rejected",
            description: "Not selected for the role",
            value: stats.rejected_applications,
            bar: "bg-rose-500",
            dot: "bg-rose-500",
        },
        {
            label: "Withdrawn",
            description: "Withdrawn by you",
            value: stats.withdrawn_applications,
            bar: "bg-slate-400",
            dot: "bg-slate-400",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
            {profile && (
                <DashboardHeader
                    user={profile}
                    onLogout={async () => {
                        await authService.logout();
                    }}
                />
            )}

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-sm sm:p-6">
                    <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-blue-50 backdrop-blur-xs">
                                <Sparkles className="h-3.5 w-3.5" />
                                Student career workspace
                            </div>
                            <h1 className="workspace-page-title">
                                {profile?.full_name
                                    ? `Welcome back, ${profile.full_name.split(" ")[0]}`
                                    : "Build your student profile"}
                            </h1>
                            <p className="workspace-body max-w-2xl text-blue-100">
                                {profile
                                    ? "Track every application stage and keep your profile ready for the next opportunity."
                                    : "Create your profile before applying so employers can review your experience and skills."}
                            </p>
                        </div>

                        <Link
                            href="/student/profile/upsert"
                            className="workspace-action inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
                        >
                            {profile ? "Update profile" : "Create profile"}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>

                {statsError && (
                    <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
                        <span>{statsError} Try again to refresh the dashboard.</span>
                        <button
                            type="button"
                            onClick={handleRetryStats}
                            className="font-semibold text-rose-700 underline-offset-4 hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                <section aria-label="Application summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Total Applications"
                        value={stats.total_applications}
                        subtitle="All applications submitted"
                        icon={<BriefcaseBusiness className="h-4 w-4" />}
                    />
                    <MetricCard
                        title="Active Applications"
                        value={stats.active_applications}
                        subtitle={`${stats.pending_applications} waiting for first review`}
                        badge={`${activeRate}% of total`}
                        icon={<Activity className="h-4 w-4" />}
                        tone="amber"
                    />
                    <MetricCard
                        title="Approved Applications"
                        value={stats.approved_applications}
                        subtitle={`${approvalRate}% overall approval rate`}
                        icon={<CheckCircle2 className="h-4 w-4" />}
                        tone="emerald"
                    />
                    <MetricCard
                        title="Rejected Applications"
                        value={stats.rejected_applications}
                        subtitle="Completed without an offer"
                        icon={<XCircle className="h-4 w-4" />}
                        tone="rose"
                    />
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs lg:col-span-2">
                        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="workspace-section-title text-slate-900">Application status breakdown</h2>
                                <p className="workspace-meta mt-0.5 text-slate-500">A complete view of your current application pipeline.</p>
                            </div>
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                <Clock3 className="h-3.5 w-3.5" />
                                {stats.active_applications} in progress
                            </span>
                        </div>

                        {stats.total_applications === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                    <Search className="h-5 w-5" />
                                </div>
                                <h3 className="workspace-section-title text-slate-900">No applications yet</h3>
                                <p className="workspace-body mt-1 max-w-sm text-slate-500">
                                    Explore available internships and submit your first application to start tracking progress here.
                                </p>
                                <Link
                                    href="/internships"
                                    className="workspace-action mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-white transition-colors hover:bg-blue-700"
                                >
                                    Browse internships
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                                {statusBreakdown.map((status) => {
                                    const percentage = Math.round((status.value / stats.total_applications) * 100);

                                    return (
                                        <div key={status.label} className="space-y-2.5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-2.5">
                                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${status.dot}`} />
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-slate-800">{status.label}</h3>
                                                        <p className="workspace-meta mt-0.5 text-slate-500">{status.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-slate-900">{status.value}</span>
                                                    <span className="ml-1 text-[10px] font-medium text-slate-400">{percentage}%</span>
                                                </div>
                                            </div>
                                            <div
                                                className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                                                role="progressbar"
                                                aria-label={`${status.label} applications`}
                                                aria-valuenow={status.value}
                                                aria-valuemin={0}
                                                aria-valuemax={stats.total_applications}
                                            >
                                                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <div className="space-y-6">
                        <section className="space-y-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <h2 className="workspace-section-title text-slate-900">Profile strength</h2>
                                <span className="text-xs font-bold text-blue-600">{completionScore}%</span>
                            </div>
                            <div
                                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                                role="progressbar"
                                aria-label="Profile completion"
                                aria-valuenow={completionScore}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div className="h-full rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${completionScore}%` }} />
                            </div>
                            <p className="workspace-body text-slate-500">
                                {completionScore < 100
                                    ? "Add missing profile details and links to help employers evaluate your application."
                                    : "Your profile is complete and ready for employer review."}
                            </p>

                            {profile && (
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <div className="space-y-0.5">
                                        <label htmlFor="searchable-toggle" className="cursor-pointer text-sm font-semibold text-slate-900">
                                            Recruiter talent pool
                                        </label>
                                        <p className="workspace-meta text-slate-500">
                                            {profile.is_searchable ? "Visible to recruiters" : "Hidden from recruiter search"}
                                        </p>
                                    </div>
                                    <button
                                        id="searchable-toggle"
                                        type="button"
                                        role="switch"
                                        aria-checked={profile.is_searchable}
                                        aria-label="Toggle profile visibility to recruiters"
                                        onClick={handleToggleVisibility}
                                        disabled={isUpdatingVisibility}
                                        className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60 ${profile.is_searchable ? "bg-blue-600" : "bg-slate-300"}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${profile.is_searchable ? "translate-x-4" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                            <h2 className="workspace-section-title text-slate-900">Quick actions</h2>
                            <div className="mt-3 space-y-1">
                                {[
                                    { label: "Find internships", href: "/internships", icon: Search },
                                    { label: "Manage documents", href: "/student/profile/documents", icon: FileText },
                                    { label: "Update profile", href: "/student/profile/upsert", icon: UserRound },
                                ].map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="workspace-action group flex items-center justify-between rounded-lg px-2.5 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-700"
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                                            {label}
                                        </span>
                                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-600" />
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3.5 rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                            <h2 className="workspace-section-title text-slate-900">Links & online presence</h2>
                            <div className="space-y-3 pt-1">
                                <PresenceLinkItem label="LinkedIn" url={profile?.linkedin_url} icon={<FaLinkedin className="h-4 w-4 text-blue-600" />} />
                                <PresenceLinkItem label="GitHub" url={profile?.github_url} icon={<FaGithub className="h-4 w-4 text-slate-600" />} />
                                <PresenceLinkItem label="Portfolio" url={profile?.portfolio_url} icon={<FaGlobe className="h-4 w-4 text-slate-600" />} />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
