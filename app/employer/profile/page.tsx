"use client";

import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    RefreshCw,
    CheckCircle2,
    Building2,
    Plus,
    ExternalLink,
    HelpCircle,
    Briefcase
} from "lucide-react";
import { EmployerProfileCard } from "@/src/components/EmployerProfile/ProfileCard";
import { EmployerProfileForm } from "@/src/components/EmployerProfile/ProfileForm";
import { useEmployerProfileStore } from "@/src/context/useEmployerProfile";
import { UpsertEmployerProfileRequest } from "@/src/types/employerProfile";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function EmployerProfilePage() {
    const { profile, loading, error, fetchProfile, saveProfile } = useEmployerProfileStore();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpsert = async (payload: UpsertEmployerProfileRequest) => {
        setSaving(true);
        try {
            await saveProfile(payload);
            setIsEditing(false);
        } catch {
            // Store captures error message in `error` state
        } finally {
            setSaving(false);
        }
    };

    // Calculate profile completion percentage
    const calculateCompletion = () => {
        if (!profile) return 0;
        let score = 0;
        if (profile.user?.email) score += 15;
        if (profile.designation) score += 15;
        if (profile.company?.name) score += 15;
        if (profile.company?.website) score += 15;
        if (profile.company?.verification_status === "approved") score += 40; // Bonus for verified company
        return score;
    };

    const completionScore = calculateCompletion();

    return (
        <div className="relative min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
            {/* Full Page Grid Background */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px]"
            />

            <div className="relative z-10 mx-auto max-w-6xl space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            {isEditing ? "Edit Employer Profile" : "Employer Dashboard"}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage your personal details, workspace access, and recruitment configuration
                        </p>
                    </div>

                    {!loading && profile && !isEditing && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1.5 border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Active Workspace
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                            <div>
                                <p className="text-sm font-semibold">Something went wrong</p>
                                <p className="text-xs text-red-700">{error}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProfile()}
                            className="gap-2 border-red-200 bg-white text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Retry
                        </Button>
                    </div>
                )}

                {/* 2-Column Main Layout Grid */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Main Content Column (2 Columns wide) */}
                    <div className="space-y-6 lg:col-span-2">
                        {loading ? (
                            <Card className="overflow-hidden border border-slate-200 bg-white shadow-2xs">
                                <Skeleton className="h-32 w-full rounded-none bg-slate-200 sm:h-40" />
                                <CardContent className="relative px-6 pb-6 pt-0 sm:px-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                                        <div className="-mt-16 sm:-mt-20">
                                            <Skeleton className="h-28 w-28 rounded-full border-4 border-white bg-slate-200 sm:h-36 sm:w-36" />
                                        </div>
                                        <Skeleton className="mt-4 h-9 w-28 rounded-full bg-slate-200 sm:mt-0" />
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        <Skeleton className="h-7 w-52 bg-slate-200" />
                                        <Skeleton className="h-4 w-40 bg-slate-200" />
                                    </div>
                                </CardContent>
                            </Card>
                        ) : isEditing || !profile ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
                                <EmployerProfileForm
                                    initialData={profile}
                                    onSubmit={handleUpsert}
                                    onCancel={profile ? () => setIsEditing(false) : undefined}
                                    isSubmitting={saving}
                                />
                            </div>
                        ) : (
                            <EmployerProfileCard
                                profile={profile}
                                onEdit={() => setIsEditing(true)}
                            />
                        )}

                        {/* Quick Workspace Overview Card */}
                        {!isEditing && profile && (
                            <Card className="border border-slate-200 bg-white p-6 shadow-2xs">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-[#0a66c2]" />
                                        <h3 className="font-bold text-slate-900">Recruitment Summary</h3>
                                    </div>
                                    <span className="text-xs text-slate-500">Updated today</span>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                                        <p className="text-xs font-semibold text-slate-500">Access Role</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">
                                            {profile.is_owner ? "Company Owner" : "Member"}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                                        <p className="text-xs font-semibold text-slate-500">Account Type</p>
                                        <p className="mt-1 text-sm font-bold text-slate-900">Verified Recruiter</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                                        <p className="text-xs font-semibold text-slate-500">Company Status</p>
                                        <p className="mt-1 text-sm font-bold text-emerald-600">
                                            {profile.company ? "Connected" : "Action Needed"}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar Column (1 Column wide) */}
                    <div className="space-y-6">

                        {/* Profile Completion Card */}
                        <Card className="border border-slate-200 bg-white shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold text-slate-900">
                                    Profile Strength
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500">
                                    Complete your profile to build trust with candidates
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                        <span>Progress</span>
                                        <span className="text-[#0a66c2]">{completionScore}%</span>
                                    </div>
                                    <Progress value={completionScore} className="h-2 bg-slate-100" />
                                </div>

                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className={`h-4 w-4 ${profile?.user?.email ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span>Work email added</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className={`h-4 w-4 ${profile?.designation ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span>Designation defined</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className={`h-4 w-4 ${profile?.company?.name ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span>Connected to company</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className={`h-4 w-4 ${profile?.company?.website ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span>Company website linked</span>
                                    </li>

                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className={`h-4 w-4 ${profile?.company?.verification_status === "approved" ? "text-emerald-500" : "text-slate-300"}`} />
                                        <span>Company verified</span>
                                    </li>
                                </ul>

                                {completionScore < 100 && !isEditing && (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs border-slate-200 hover:opacity-0.8 text-slate-50"
                                    >
                                        Complete missing fields
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions Sidebar */}
                        <Card className="border border-slate-200 bg-white shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold text-slate-900">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {profile?.company?.website && (
                                    <a
                                        href={profile.company.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-[#0a66c2]" />
                                            Company Website
                                        </span>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                    </a>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    <span className="flex items-center gap-2">
                                        <Plus className="h-4 w-4 text-[#0a66c2]" />
                                        Edit Profile & Company
                                    </span>
                                </button>
                            </CardContent>
                        </Card>

                        {/* Support / Guidelines Box */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900">
                            <div className="flex items-center gap-2 font-bold text-[#0a66c2]">
                                <HelpCircle className="h-4 w-4" />
                                Employer Guidelines
                            </div>
                            <p className="mt-1.5 text-slate-600 leading-relaxed">
                                Ensure your designation and company details match official records. Unverified workspaces may have limited candidate outreach capabilities.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}