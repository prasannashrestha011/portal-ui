"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    BookOpen,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Check,
    CircleDollarSign,
    Clock3,
    Eye,
    EyeOff,
    GraduationCap,
    MapPin,
    Pencil,
    Phone,
    Sparkles,
    UserRound,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import type { StudentProfile } from "@/src/types/studentProfile";

const PROFILE_FIELDS: Array<keyof StudentProfile> = [
    "full_name",
    "phone",
    "location",
    "bio",
    "college_name",
    "degree",
    "faculty_or_major",
    "current_semester",
    "graduation_year",
    "preferred_job_categories",
    "preferred_locations",
    "preferred_work_mode",
    "availability",
    "expected_salary",
    "linkedin_url",
    "github_url",
    "portfolio_url",
];

export default function DisplayStudentProfile() {
    const { profile, loading, fetchProfile } = useStudentProfileStore();

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    if (loading) return <ProfileSkeleton />;
    if (!profile) return <EmptyProfile />;

    const jobCategories = parseCommaSeparated(profile.preferred_job_categories);
    const locations = parseCommaSeparated(profile.preferred_locations);
    const completion = getCompletionPercentage(profile);
    const imageSource = getProfileImageSource(profile.profile_image_key);
    const initials = getInitials(profile.full_name);
    const updatedAt = formatDate(profile.updated_at);
    const headline = [profile.degree, profile.faculty_or_major]
        .filter(Boolean)
        .join(" · ");

    return (
        <main className="min-h-screen bg-background text-text-primary">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Student workspace
                        </div>
                        <h1 className="workspace-page-title">
                            Your professional profile
                        </h1>
                        <p className="workspace-body mt-1.5 max-w-2xl text-text-secondary">
                            Review the information employers see when you apply for an opportunity.
                        </p>
                    </div>

                    <Link
                        href="/student/profile/upsert"
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/40 sm:self-auto"
                    >
                        <Pencil className="size-4" aria-hidden="true" />
                        Edit profile
                    </Link>
                </header>

                <Card className="gap-0 border border-border bg-surface py-0 shadow-sm ring-0">
                    <div className="relative h-28 overflow-hidden bg-linear-to-br from-primary-active via-primary to-accent sm:h-36">
                        <div className="absolute -right-12 -top-16 size-52 rounded-full bg-primary-foreground/10" />
                        <div className="absolute bottom-[-5rem] right-24 size-44 rounded-full border-[28px] border-primary-foreground/10" />
                    </div>

                    <div className="px-5 pb-6 sm:px-7 sm:pb-7">
                        <div className="-mt-11 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                            <Avatar className="size-24 border-4 border-surface bg-surface shadow-md sm:size-28">
                                {imageSource && (
                                    <AvatarImage src={imageSource} alt={`${profile.full_name}'s profile`} />
                                )}
                                <AvatarFallback className="bg-primary-subtle text-2xl font-bold text-primary sm:text-3xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <Badge
                                variant="outline"
                                className={
                                    profile.is_searchable
                                        ? "h-7 gap-1.5 border-success/25 bg-success-subtle px-3 text-success"
                                        : "h-7 gap-1.5 border-border-strong bg-surface-muted px-3 text-text-secondary"
                                }
                            >
                                {profile.is_searchable ? (
                                    <Eye className="size-3.5!" aria-hidden="true" />
                                ) : (
                                    <EyeOff className="size-3.5!" aria-hidden="true" />
                                )}
                                {profile.is_searchable ? "Visible to employers" : "Profile hidden"}
                            </Badge>
                        </div>

                        <div className="mt-5">
                            <h2 className="workspace-page-title">
                                {profile.full_name || "Unnamed student"}
                            </h2>
                            <p className="mt-1.5 text-sm font-medium text-text-secondary sm:text-base">
                                {headline || "Student seeking new opportunities"}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-muted">
                                {profile.college_name && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Building2 className="size-4 text-primary" aria-hidden="true" />
                                        {profile.college_name}
                                    </span>
                                )}
                                {profile.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="size-4 text-primary" aria-hidden="true" />
                                        {profile.location}
                                    </span>
                                )}
                                {profile.phone && (
                                    <a
                                        href={`tel:${profile.phone}`}
                                        className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                                    >
                                        <Phone className="size-4 text-primary" aria-hidden="true" />
                                        {profile.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                    <div className="space-y-5">
                        <ProfileSection
                            title="About"
                            description="A short introduction for potential employers"
                            icon={<UserRound className="size-5" />}
                        >
                            {profile.bio ? (
                                <p className="workspace-body whitespace-pre-line text-text-secondary">
                                    {profile.bio}
                                </p>
                            ) : (
                                <MissingContent message="Add a short bio describing your strengths, interests, and career goals." />
                            )}
                        </ProfileSection>

                        <ProfileSection
                            title="Education"
                            description="Your current academic background"
                            icon={<GraduationCap className="size-5" />}
                        >
                            <dl className="grid gap-3 sm:grid-cols-2">
                                <DetailTile
                                    label="Institution"
                                    value={profile.college_name}
                                    icon={<Building2 className="size-4" />}
                                />
                                <DetailTile
                                    label="Degree"
                                    value={profile.degree}
                                    icon={<BookOpen className="size-4" />}
                                />
                                <DetailTile
                                    label="Faculty or major"
                                    value={profile.faculty_or_major}
                                    icon={<GraduationCap className="size-4" />}
                                />
                                <DetailTile
                                    label="Current semester"
                                    value={profile.current_semester}
                                    icon={<CalendarDays className="size-4" />}
                                />
                                <DetailTile
                                    label="Graduation year"
                                    value={profile.graduation_year > 0 ? String(profile.graduation_year) : ""}
                                    icon={<CalendarDays className="size-4" />}
                                />
                            </dl>
                        </ProfileSection>

                        <ProfileSection
                            title="Career preferences"
                            description="The opportunities and working arrangements you prefer"
                            icon={<BriefcaseBusiness className="size-5" />}
                        >
                            <dl className="grid gap-3 sm:grid-cols-3">
                                <DetailTile
                                    label="Work mode"
                                    value={formatDisplayValue(profile.preferred_work_mode)}
                                    icon={<MapPin className="size-4" />}
                                />
                                <DetailTile
                                    label="Availability"
                                    value={profile.availability}
                                    icon={<Clock3 className="size-4" />}
                                />
                                <DetailTile
                                    label="Expected salary"
                                    value={profile.expected_salary}
                                    icon={<CircleDollarSign className="size-4" />}
                                />
                            </dl>

                            <TagGroup
                                label="Target roles"
                                values={jobCategories}
                                emptyMessage="No target roles added yet"
                            />
                            <TagGroup
                                label="Preferred locations"
                                values={locations}
                                emptyMessage="No preferred locations added yet"
                                accent
                            />
                        </ProfileSection>
                    </div>

                    <aside className="space-y-5">
                        <Card className="gap-0 border border-border bg-surface py-0 shadow-sm ring-0">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="workspace-section-title">Profile strength</p>
                                        <p className="workspace-meta mt-1 text-text-muted">
                                            Complete profiles help employers evaluate you faster.
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-primary-subtle px-2.5 py-1 text-sm font-bold text-primary">
                                        {completion}%
                                    </span>
                                </div>

                                <div
                                    className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted"
                                    role="progressbar"
                                    aria-label="Profile completion"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={completion}
                                >
                                    <div
                                        className="h-full rounded-full bg-primary transition-[width]"
                                        style={{ width: `${completion}%` }}
                                    />
                                </div>

                                <p className="workspace-meta mt-3 flex items-start gap-2 text-text-secondary">
                                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                                    {completion >= 80
                                        ? "Your profile is ready to make a strong first impression."
                                        : "Add missing details to improve your visibility and matches."}
                                </p>

                                <Link
                                    href="/student/profile/upsert"
                                    className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-surface-elevated px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/30"
                                >
                                    Improve profile
                                </Link>
                            </div>
                        </Card>

                        <Card className="gap-0 border border-border bg-surface py-0 shadow-sm ring-0">
                            <div className="border-b border-border px-5 py-4">
                                <h3 className="workspace-section-title">Online presence</h3>
                                <p className="workspace-meta mt-1 text-text-muted">Portfolio and professional profiles</p>
                            </div>
                            <div className="space-y-2 p-3">
                                <PresenceLink
                                    href={profile.linkedin_url}
                                    label="LinkedIn"
                                    icon={<FaLinkedin className="size-4" />}
                                />
                                <PresenceLink
                                    href={profile.github_url}
                                    label="GitHub"
                                    icon={<FaGithub className="size-4" />}
                                />
                                <PresenceLink
                                    href={profile.portfolio_url}
                                    label="Portfolio"
                                    icon={<ArrowUpRight className="size-4" />}
                                />
                                {!profile.linkedin_url && !profile.github_url && !profile.portfolio_url && (
                                    <p className="px-2 py-5 text-center text-xs leading-5 text-text-muted">
                                        Add professional links to showcase your work.
                                    </p>
                                )}
                            </div>
                        </Card>

                        {updatedAt && (
                            <p className="px-1 text-center text-xs text-text-muted">
                                Last updated {updatedAt}
                            </p>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}

function ProfileSection({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <Card className="gap-0 border border-border bg-surface py-0 shadow-sm ring-0">
            <div className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-subtle text-primary">
                    {icon}
                </span>
                <div>
                    <h2 className="workspace-section-title text-text-primary">{title}</h2>
                    <p className="workspace-meta mt-0.5 text-text-muted">{description}</p>
                </div>
            </div>
            <div className="space-y-5 p-5 sm:p-6">{children}</div>
        </Card>
    );
}

function DetailTile({ label, value, icon }: { label: string; value?: string; icon: ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-surface-elevated p-3.5">
            <dt className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <span className="text-primary">{icon}</span>
                {label}
            </dt>
            <dd className={`mt-2 text-sm font-semibold ${value ? "text-text-primary" : "text-text-disabled"}`}>
                {value || "Not added"}
            </dd>
        </div>
    );
}

function TagGroup({
    label,
    values,
    emptyMessage,
    accent = false,
}: {
    label: string;
    values: string[];
    emptyMessage: string;
    accent?: boolean;
}) {
    return (
        <div className="border-t border-border pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">{label}</p>
            {values.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {values.map((value) => (
                        <Badge
                            key={value}
                            variant="outline"
                            className={
                                accent
                                    ? "h-7 border-accent/20 bg-accent-subtle px-3 text-accent-hover"
                                    : "h-7 border-primary/20 bg-primary-subtle px-3 text-primary-hover"
                            }
                        >
                            {accent && <MapPin className="size-3!" aria-hidden="true" />}
                            {value}
                        </Badge>
                    ))}
                </div>
            ) : (
                <p className="mt-2 text-sm text-text-disabled">{emptyMessage}</p>
            )}
        </div>
    );
}

function PresenceLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
    if (!href) return null;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/30"
        >
            <span className="grid size-8 place-items-center rounded-lg bg-primary-subtle text-primary">{icon}</span>
            <span className="flex-1">{label}</span>
            <ArrowUpRight className="size-4 text-text-disabled" aria-hidden="true" />
        </a>
    );
}

function MissingContent({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-elevated px-4 py-5 text-sm leading-6 text-text-muted">
            {message}
        </div>
    );
}

function EmptyProfile() {
    return (
        <main className="grid min-h-[75vh] place-items-center bg-background px-4 py-12 text-text-primary">
            <Card className="w-full max-w-lg gap-0 border border-border bg-surface py-0 text-center shadow-sm ring-0">
                <div className="p-7 sm:p-9">
                    <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary-subtle text-primary">
                        <UserRound className="size-8" aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        Student workspace
                    </p>
                    <h1 className="workspace-page-title mt-2">Create your professional profile</h1>
                    <p className="workspace-body mx-auto mt-3 max-w-sm text-text-secondary">
                        Add your education, career preferences, and portfolio links so employers can understand what you bring.
                    </p>
                    <Link
                        href="/student/profile/upsert"
                        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/40"
                    >
                        Create profile
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </Card>
        </main>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-3 w-32 rounded-full bg-surface-muted" />
                        <div className="h-8 w-64 rounded-lg bg-surface-muted" />
                        <div className="h-4 w-80 max-w-full rounded bg-surface-muted" />
                    </div>
                    <div className="hidden h-10 w-32 rounded-lg bg-surface-muted sm:block" />
                </div>
                <div className="h-72 rounded-xl border border-border bg-surface" />
                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="space-y-5">
                        <div className="h-44 rounded-xl border border-border bg-surface" />
                        <div className="h-72 rounded-xl border border-border bg-surface" />
                    </div>
                    <div className="space-y-5">
                        <div className="h-52 rounded-xl border border-border bg-surface" />
                        <div className="h-48 rounded-xl border border-border bg-surface" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function parseCommaSeparated(value: string) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function getInitials(name: string) {
    const initials = name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return initials || "ST";
}

function getCompletionPercentage(profile: StudentProfile) {
    const apiPercentage = Number(profile.profile_completion_percentage);
    if (apiPercentage > 0) return Math.min(100, Math.max(0, Math.round(apiPercentage)));

    const completedFields = PROFILE_FIELDS.filter((field) => Boolean(profile[field])).length;
    return Math.round((completedFields / PROFILE_FIELDS.length) * 100);
}

function getProfileImageSource(value: string) {
    const imageKey = value.trim();
    return /^(https?:\/\/|\/|data:image\/|blob:)/i.test(imageKey) ? imageKey : undefined;
}

function formatDisplayValue(value: string) {
    if (!value) return "";
    return value
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
