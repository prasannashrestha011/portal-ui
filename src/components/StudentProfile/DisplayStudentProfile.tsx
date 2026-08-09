"use client";

import React, { useEffect } from "react";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import Link from "next/link";

export default function DisplayStudentProfile() {
    const { profile, loading, fetchProfile } = useStudentProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) return <ProfileSkeleton />;

    if (!profile) {
        return (
            <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">No profile found</h3>
                <p className="mt-1 text-sm text-slate-500">You haven&apos;t set up your student profile yet.</p>
                <div className="mt-6">
                    <Link
                        href="/student/profile/upsert"
                        className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                        Create Profile
                    </Link>
                </div>
            </div>
        );
    }

    // Parse comma-separated strings for badge displays
    const jobCategories = profile.preferred_job_categories
        ? profile.preferred_job_categories.split(",").map((c) => c.trim()).filter(Boolean)
        : [];

    const locations = profile.preferred_locations
        ? profile.preferred_locations.split(",").map((l) => l.trim()).filter(Boolean)
        : [];

    return (
        <main className="min-h-full bg-slate-100 px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
            {/* 1. Header Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Avatar Placeholder */}
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-inner">
                            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "S"}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    {profile.full_name || "Unnamed Student"}
                                </h1>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${profile.is_searchable
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                                        }`}
                                >
                                    {profile.is_searchable ? "Visible to Employers" : "Hidden"}
                                </span>
                            </div>

                            <p className="text-sm font-medium text-slate-600">
                                {profile.degree && profile.faculty_or_major
                                    ? `${profile.degree} in ${profile.faculty_or_major}`
                                    : profile.degree || profile.faculty_or_major || "Student"}
                            </p>

                            {profile.location && (
                                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {profile.location}
                                </p>
                            )}
                        </div>
                    </div>

                    <Link
                        href="/student/profile/upsert"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                    {profile.linkedin_url && (
                        <SocialLink href={profile.linkedin_url} label="LinkedIn" />
                    )}
                    {profile.github_url && (
                        <SocialLink href={profile.github_url} label="GitHub" />
                    )}
                    {profile.portfolio_url && (
                        <SocialLink href={profile.portfolio_url} label="Portfolio" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 2. Academic Background Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        Academic Information
                    </h2>

                    <div className="space-y-3">
                        <DetailItem label="College / Institution" value={profile.college_name} />
                        <DetailItem label="Degree" value={profile.degree} />
                        <DetailItem label="Faculty / Major" value={profile.faculty_or_major} />
                        <DetailItem label="Current Semester" value={profile.current_semester} />
                        <DetailItem label="Expected Graduation" value={profile.graduation_year?.toString()} />
                    </div>
                </div>

                {/* 3. Job & Career Preferences Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Career Preferences
                    </h2>

                    <div className="space-y-3">
                        <DetailItem label="Preferred Work Mode" value={profile.preferred_work_mode} capitalize />
                        <DetailItem label="Availability" value={profile.availability} />
                        <DetailItem label="Expected Salary" value={profile.expected_salary} />

                        {/* Job Categories Badges */}
                        {jobCategories.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-slate-500">Target Roles</span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {jobCategories.map((cat, i) => (
                                        <span key={i} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Preferred Locations Badges */}
                        {locations.length > 0 && (
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-slate-500">Target Locations</span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {locations.map((loc, i) => (
                                        <span key={i} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                            {loc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </main>
    );
}

/* Helper Components */

function DetailItem({ label, value, capitalize = false }: { label: string; value?: string | null; capitalize?: boolean }) {
    if (!value) return null;
    return (
        <div>
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className={`text-sm font-medium text-slate-900 ${capitalize ? "capitalize" : ""}`}>{value}</dd>
        </div>
    );
}

function SocialLink({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {label}
        </a>
    );
}

function ProfileSkeleton() {
    return (
        <div className="mx-auto max-w-4xl animate-pulse space-y-6 p-6">
            <div className="h-44 rounded-2xl border border-slate-200 bg-slate-100" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="h-56 rounded-2xl border border-slate-200 bg-slate-100" />
                <div className="h-56 rounded-2xl border border-slate-200 bg-slate-100" />
            </div>
        </div>
    );
}
