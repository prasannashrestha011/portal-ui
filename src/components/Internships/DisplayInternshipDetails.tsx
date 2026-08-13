"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    MapPin,
    Briefcase,
    DollarSign,
    GraduationCap,
    ExternalLink,
    Mail,
    Clock,
    Users,
    ArrowLeft,
    Share2,
    Sparkles,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

import { Internship } from "@/src/types/internship";
import { internshipService } from "@/src/services/internship";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface InternshipDetailViewProps {
    internshipId: string;
}

export function InternshipDetailView({ internshipId }: InternshipDetailViewProps) {
    const [internship, setInternship] = useState<Internship | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInternship() {
            try {
                setLoading(true);
                setError(null);
                const response = await internshipService.getInternshipById(internshipId);
                if (response.data) {
                    setInternship(response.data);
                } else {
                    setError("Internship posting not found.");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "Failed to load opportunity details.");
            } finally {
                setLoading(false);
            }
        }

        if (internshipId) fetchInternship();
    }, [internshipId]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-32 w-full rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <Skeleton className="lg:col-span-8 h-150 rounded-2xl" />
                    <Skeleton className="lg:col-span-4 h-96 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !internship) {
        return (
            <div className="max-w-md mx-auto my-20 p-8 text-center border rounded-2xl bg-background space-y-4 shadow-sm">
                <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
                <h2 className="text-xl font-semibold tracking-tight">{error || "Posting Not Found"}</h2>
                <p className="text-xs text-muted-foreground">
                    This opportunity may have expired or been removed.
                </p>
                <Button variant="outline" size="sm">
                    <Link href="/internships">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Opportunities
                    </Link>
                </Button>
            </div>
        );
    }

    const formattedStipend = internship.stipend_amount
        ? `${internship.stipend_currency || "NPR"} ${internship.stipend_amount.toLocaleString()}${internship.stipend_period ? ` / ${internship.stipend_period}` : ""}`
        : "Stipend Negotiable";

    const formattedDuration = internship.duration
        ? `${internship.duration} ${internship.duration_unit || ""}`
        : "Flexible";

    const skillsList = internship.required_skills
        ? internship.required_skills.split(",").map((s) => s.trim())
        : [];

    const preferredSkillsList = internship.preferred_skills
        ? internship.preferred_skills.split(",").map((s) => s.trim())
        : [];

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Navigation Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" >
                    <Link href="/internships">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Opportunities
                    </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </div>

            {/* Main Title & Hero Meta */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="capitalize text-xs">
                        {internship.internship_type}
                    </Badge>
                    {internship.work_mode === "remote" && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Remote Available
                        </Badge>
                    )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {internship.title}
                </h1>

                {/* Highlight Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-xl border bg-card/50 space-y-0.5">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> Location
                        </span>
                        <p className="text-sm font-semibold truncate">{internship.location}</p>
                    </div>
                    <div className="p-3 rounded-xl border bg-card/50 space-y-0.5">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-primary" /> Mode
                        </span>
                        <p className="text-sm font-semibold capitalize">{internship.work_mode}</p>
                    </div>
                    <div className="p-3 rounded-xl border bg-card/50 space-y-0.5">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-primary" /> Stipend
                        </span>
                        <p className="text-sm font-semibold truncate">{formattedStipend}</p>
                    </div>
                    <div className="p-3 rounded-xl border bg-card/50 space-y-0.5">
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3 text-primary" /> Openings
                        </span>
                        <p className="text-sm font-semibold">{internship.vacancy_count} Position(s)</p>
                    </div>
                </div>
            </div>

            {/* Two-Column Asymmetrical Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Narrative Details (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Skills Pills */}
                    {skillsList.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {skillsList.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground border border-border/50"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {preferredSkillsList.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Preferred Skills
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {preferredSkillsList.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium rounded-lg bg-muted text-muted-foreground border border-border/50"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Role Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight">About the Internship</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                            {internship.description}
                        </div>
                    </div>

                    {internship.responsibilities && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold tracking-tight">Responsibilities</h3>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {internship.responsibilities}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Student Specific Eligibility Checklist */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tight">Applicant Eligibility Checklist</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-muted/30">
                                <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-xs space-y-0.5">
                                    <span className="font-semibold text-foreground block">Eligible Programs</span>
                                    <span className="text-muted-foreground">
                                        {internship.eligible_programs || "Open to all undergraduate programs."}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-muted/30">
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-xs space-y-0.5">
                                    <span className="font-semibold text-foreground block">Eligible Semester</span>
                                    <span className="text-muted-foreground">
                                        {internship.eligible_semester || "No minimum semester requirement."}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3.5 rounded-xl border bg-muted/30">
                                <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-xs space-y-0.5">
                                    <span className="font-semibold text-foreground block">Academic Degree Level</span>
                                    <span className="text-muted-foreground">
                                        {internship.required_education || "Bachelor's level student or recent graduate."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sticky Column: Action Panel (4 Columns) */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
                    <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-5">
                        <div className="space-y-1">
                            <h2 className="text-base font-bold">Apply for Position</h2>
                            <p className="text-xs text-muted-foreground">
                                Review requirements above before submitting your application.
                            </p>
                        </div>

                        {internship.application_deadline && (
                            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>
                                    Deadline:{" "}
                                    <strong>
                                        {new Date(internship.application_deadline).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </strong>
                                </span>
                            </div>
                        )}

                        <div className="space-y-2 pt-1">
                            {internship.application_url ? (
                                <Button className="w-full font-semibold">
                                    <a href={internship.application_url} target="_blank" rel="noopener noreferrer">
                                        Apply Directly <ExternalLink className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                            ) : internship.application_email ? (
                                <Button className="w-full font-semibold">
                                    <a href={`mailto:${internship.application_email}?subject=Application for ${internship.title}`}>
                                        Apply via Email <Mail className="w-4 h-4 ml-2" />
                                    </a>
                                </Button>
                            ) : (
                                <Button disabled variant="secondary" className="w-full">
                                    Applications Closed
                                </Button>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span className="font-medium text-foreground">{formattedDuration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Internship Type</span>
                                <span className="font-medium text-foreground capitalize">{internship.internship_type}</span>
                            </div>
                            {internship.working_hours && (
                                <div className="flex justify-between">
                                    <span>Working Hours</span>
                                    <span className="font-medium text-foreground">{internship.working_hours}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}