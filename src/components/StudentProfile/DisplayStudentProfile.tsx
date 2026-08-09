"use client";

import React, { useEffect } from "react";
import { Inter } from "next/font/google";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    GraduationCap,
    Briefcase,
    MapPin,
    Globe,
    UserCircle2,
    Mail,
    Phone,
    CalendarDays,
    Target,
    Award,
    Pencil,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function DisplayStudentProfile() {
    const { profile, loading, fetchProfile } = useStudentProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (loading) return <ProfileSkeleton />;

    if (!profile) {
        return (
            <div
                className={`${inter.className} flex min-h-[70vh] items-center justify-center bg-[#F3F2EF] px-4 font-sans text-slate-800`}
            >
                <Card className="w-full max-w-md border border-slate-200 bg-white p-8 text-center shadow-sm rounded-xl">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F2CE]/30 border-4 border-[#0A66C2]/10">
                        <UserCircle2 className="h-10 w-10 text-[#0A66C2]" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-900">
                        Profile Not Found
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                        It looks like you haven&apos;t created your student profile yet.
                    </p>
                    <div className="mt-8">
                        <Link href="/student/profile/upsert">
                            <Button className="w-full h-11 rounded-full bg-[#0A66C2] text-sm font-semibold text-white shadow-sm hover:bg-[#004182] transition-colors">
                                Create My Profile
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    const jobCategories = profile.preferred_job_categories
        ? profile.preferred_job_categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

    const locations = profile.preferred_locations
        ? profile.preferred_locations
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        : [];

    return (
        <main
            className={`${inter.className} min-h-screen bg-[#F3F2EF] px-3 py-6 sm:px-6 sm:py-10 text-slate-900 font-sans`}
        >
            <div className="mx-auto max-w-4xl space-y-4">
                {/* Main Banner & Profile Header Card */}
                <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-xl">
                    {/* Cover Header Banner */}
                    <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-[#004182] via-[#0A66C2] to-[#0077B5] relative">
                        <div className="absolute top-4 right-4">
                            <Link href="/student/profile/upsert">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full bg-white/90 text-[#0A66C2] hover:bg-white hover:text-[#004182] font-semibold text-xs backdrop-blur-sm shadow-sm"
                                >
                                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Header
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 relative sm:px-8">
                        {/* Avatar Row */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-4 gap-4">
                            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white ring-1 ring-slate-200/60 shadow-md bg-white">
                                <AvatarImage
                                    src={profile.profile_picture_url}
                                    alt={profile.full_name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-full bg-[#0A66C2] text-3xl font-bold text-white">
                                    {profile.full_name
                                        ? profile.full_name.charAt(0).toUpperCase()
                                        : "S"}
                                </AvatarFallback>
                            </Avatar>

                            <Link href="/student/profile/upsert" className="self-start sm:self-auto">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10 font-semibold text-sm px-5 h-9"
                                >
                                    Edit Full Profile
                                </Button>
                            </Link>
                        </div>

                        {/* Main Details */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                    {profile.full_name || "Unnamed Student"}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={
                                        profile.is_searchable
                                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium text-xs flex items-center gap-1.5"
                                            : "border-slate-300 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium text-xs"
                                    }
                                >
                                    {profile.is_searchable && (
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                        </span>
                                    )}
                                    {profile.is_searchable ? "Open to Work" : "Hidden Profile"}
                                </Badge>
                            </div>

                            <p className="text-base sm:text-lg text-slate-700 font-normal leading-snug">
                                {profile.degree && profile.faculty_or_major
                                    ? `${profile.degree} in ${profile.faculty_or_major}`
                                    : profile.degree || profile.faculty_or_major || "Student"}
                                {profile.college_name && (
                                    <span className="text-slate-500 font-normal">
                                        {" "}
                                        • {profile.college_name}
                                    </span>
                                )}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-normal pt-0.5">
                                {profile.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        {profile.location}
                                    </span>
                                )}
                                {profile.email && (
                                    <a
                                        href={`mailto:${profile.email}`}
                                        className="flex items-center gap-1 text-[#0A66C2] hover:underline font-medium"
                                    >
                                        <Mail className="h-4 w-4 text-[#0A66C2]" />
                                        Contact Info
                                    </a>
                                )}
                                {profile.phone_number && (
                                    <span className="flex items-center gap-1 text-slate-600">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        {profile.phone_number}
                                    </span>
                                )}
                            </div>

                            {/* Social Links Bar */}
                            {(profile.linkedin_url ||
                                profile.github_url ||
                                profile.portfolio_url) && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {profile.linkedin_url && (
                                            <SocialBadge
                                                href={profile.linkedin_url}
                                                label="LinkedIn"
                                                icon={<FaLinkedin className="h-4 w-4 text-[#0A66C2]" />}
                                            />
                                        )}
                                        {profile.github_url && (
                                            <SocialBadge
                                                href={profile.github_url}
                                                label="GitHub"
                                                icon={<FaGithub className="h-4 w-4 text-slate-800" />}
                                            />
                                        )}
                                        {profile.portfolio_url && (
                                            <SocialBadge
                                                href={profile.portfolio_url}
                                                label="Portfolio"
                                                icon={<Globe className="h-4 w-4 text-teal-600" />}
                                            />
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </Card>

                {/* About Section */}
                {profile.bio && (
                    <Card className="border border-slate-200 bg-white p-6 sm:p-8 shadow-sm rounded-xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                            {profile.bio}
                        </p>
                    </Card>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Education Section */}
                    <Card className="border border-slate-200 bg-white p-6 shadow-sm rounded-xl md:col-span-1 space-y-5">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-[#0A66C2]">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900">Education</h2>
                        </div>

                        <div className="space-y-4">
                            <DetailItem
                                label="Institution"
                                value={profile.college_name}
                                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Degree"
                                value={profile.degree}
                                icon={<Award className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Major / Faculty"
                                value={profile.faculty_or_major}
                                icon={<Target className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Current Semester"
                                value={profile.current_semester}
                                icon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Graduation Year"
                                value={profile.graduation_year?.toString()}
                                icon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                            />
                        </div>
                    </Card>

                    {/* Career Preferences Section */}
                    <Card className="border border-slate-200 bg-white p-6 shadow-sm rounded-xl md:col-span-2 space-y-6">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-[#0A66C2]">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <h2 className="text-base font-bold text-slate-900">
                                Career Preferences
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                            <DetailItem
                                label="Preferred Work Mode"
                                value={profile.preferred_work_mode}
                                capitalize
                                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Availability"
                                value={profile.availability}
                                icon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                            />
                            <DetailItem
                                label="Expected Salary"
                                value={profile.expected_salary}
                                icon={<Award className="w-4 h-4 text-slate-400" />}
                            />
                        </div>

                        {jobCategories.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Target Roles
                                </span>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {jobCategories.map((cat, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="border border-slate-200 bg-slate-50 text-slate-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-slate-100 transition-colors"
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {locations.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Target Locations
                                </span>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {locations.map((loc, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="border border-blue-100 bg-[#E8F4F9] text-[#0A66C2] px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {loc}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </main>
    );
}

/* Helper Components */

function DetailItem({
    label,
    value,
    capitalize = false,
    icon,
}: {
    label: string;
    value?: string | null;
    capitalize?: boolean;
    icon?: React.ReactNode;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
            <div className="min-w-0">
                <dt className="text-xs font-medium text-slate-500">{label}</dt>
                <dd
                    className={`text-sm font-semibold text-slate-800 mt-0.5 truncate ${capitalize ? "capitalize" : ""
                        }`}
                >
                    {value}
                </dd>
            </div>
        </div>
    );
}

function SocialBadge({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-100 hover:border-slate-300"
        >
            {icon}
            <span>{label}</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
        </a>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[#F3F2EF] px-4 py-8">
            <div className="mx-auto max-w-4xl animate-pulse space-y-4">
                <div className="h-72 rounded-xl border border-slate-200 bg-white" />
                <div className="h-32 rounded-xl border border-slate-200 bg-white" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-64 rounded-xl border border-slate-200 bg-white md:col-span-1" />
                    <div className="h-64 rounded-xl border border-slate-200 bg-white md:col-span-2" />
                </div>
            </div>
        </div>
    );
}